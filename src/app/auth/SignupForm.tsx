"use client";

import * as Yup from "yup";
import Image from "next/image";
import { useFormik } from "formik";
import styles from "./loginform.module.css";
import { FiCopy, FiDownload } from "react-icons/fi";
import { IoCaretDownOutline } from "react-icons/io5";
import { useSignup, useOtpVerify, useEmailVerify, useResendLink, useUpdate2fa } from "@/hooks/auth";
import { generateRecoveryKey } from "@/utils/recovery";
import Input from "@/components/secondary/input/Input";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DatePicker from "@/components/secondary/datepicker/DatePicker";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import { FaUser, FaEnvelope, FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";

interface SignupFormProps {
  onError?: (message: string) => void;
}

type Phase = "form" | "recovery_key" | "otp" | "two_factor" | "verified";

export default function SignupForm({ onError }: SignupFormProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [phase, setPhase] = useState<Phase>("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const signupButtonWrapperRef = useRef<HTMLDivElement>(null);
  const [signupButtonWidthPx, setSignupButtonWidthPx] = useState<number>(150);
  const genderShellRef = useRef<HTMLDivElement | null>(null);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [lockedHeightPx, setLockedHeightPx] = useState<number | undefined>(undefined);
  const { mutate: signupUser, isPending: submitting } = useSignup();
  const { mutate: verifyOtp, isPending: verifyingOtp } = useOtpVerify();
  const { fetch: runEmailVerify, isPending: emailChecking } = useEmailVerify();
  const { mutate: resendVerificationLink, isPending: resendingLink } = useResendLink();
  const { mutate: setTwoFactor, isPending: updating2fa } = useUpdate2fa();
  const [emailVerifyState, setEmailVerifyState] = useState<"idle" | "available" | "exists" | "unverified">("idle");
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");
  const [otpInitializing, setOtpInitializing] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useLayoutEffect(() => {
    if (phase === "form" && formRef.current) {
      const h = formRef.current.offsetHeight;
      setLockedHeightPx((prev) => (prev === undefined || h > prev ? h : prev));
    }
  }, [phase, step]);

  useEffect(() => {
    const updateWidth = () => {
      const el = signupButtonWrapperRef.current;
      if (!el) return;
      const wrapperWidth = el.offsetWidth;
      const computed = Math.max(50, Math.floor(wrapperWidth - 12));
      setSignupButtonWidthPx(computed);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [phase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isGenderOpen) return;
      if (!genderShellRef.current) return;
      if (genderShellRef.current.contains(event.target as Node)) return;
      setIsGenderOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isGenderOpen]);

  const schemas: Record<0 | 1 | 2, Yup.ObjectSchema<any>> = {
    0: Yup.object({
      fullName: Yup.string()
        .min(3, "Please enter at least 3 characters")
        .max(60, "Please enter at most 60 characters")
        .matches(/^[a-zA-Z][a-zA-Z\s.'-]*$/, "Please enter a valid full name")
        .required("Full name is required"),
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9]([a-zA-Z0-9.]*[a-zA-Z0-9])?@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,}$/,
          "Please enter a valid email address"
        )
        .required("Email is required"),
    }),
    1: Yup.object({
      password: Yup.string()
        .min(8, "Please enter at least 8 characters")
        .matches(/[a-z]/, "Please enter at least a lowercase")
        .matches(/[A-Z]/, "Please enter at least an uppercase")
        .matches(/[0-9]/, "Please enter at least a number")
        .matches(/[^A-Za-z0-9]/, "Please enter a special character")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .test("match-if-filled", "Passwords must match", function (value) {
          if (!value) return true;
          return value === this.parent.password;
        }),
    }),
    2: Yup.object({
      gender: Yup.string().oneOf(["male", "female", "other"], "Select a gender").required("Gender is required"),
      dob: Yup.string()
        .required("Date of birth is required")
        .matches(/^\d{2}-\d{2}-\d{4}$/, "Use DD-MM-YYYY")
        .test("not-future", "Date of birth cannot be in the future", (val) => {
          if (!val) return true;
          const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(val);
          if (!m) return false;
          const dd = Number(m[1]);
          const mm = Number(m[2]);
          const yyyy = Number(m[3]);
          const d = new Date(yyyy, mm - 1, dd);
          if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return false;
          const today = new Date();
          const max = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const picked = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          return picked.getTime() <= max.getTime();
        }),
    }),
  };

  const dobToIso = (dob: string): string => {
    const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(dob);
    if (!m) return "";
    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yyyy = Number(m[3]);
    return new Date(Date.UTC(yyyy, mm - 1, dd)).toISOString();
  };

  const formik = useFormik<{
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: "" | "male" | "female" | "other";
    dob: string;
  }>({
    initialValues: { fullName: "", email: "", password: "", confirmPassword: "", gender: "", dob: "" },
    validationSchema: schemas[step],
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (step < 2) {
        if (step === 0) {
          try {
            await schemas[0].validate(values, { abortEarly: false });
          } catch {
            return;
          }

          let state = verifiedEmail === values.email ? emailVerifyState : "idle";
          if (state === "idle") {
            try {
              const result = await runEmailVerify(values.email);
              if (formik.values.email !== values.email) return;
              state =
                result.verified === true
                  ? "exists"
                  : result.verified === false
                    ? "unverified"
                    : "available";
              setEmailVerifyState(state);
              setVerifiedEmail(values.email);
            } catch {
              state = "available";
            }
          }

          if (state === "exists") return;
          if (state === "unverified") {
            setOtpInitializing(true);
            resendVerificationLink(
              { full_name: values.fullName, email: values.email },
              { onSettled: () => setOtpInitializing(false) }
            );
            setPhase("otp");
            return;
          }
          setStep(1);
          return;
        }

        if (step === 1 && !values.confirmPassword) {
          formik.setFieldTouched("confirmPassword", true, false);
          formik.setFieldError("confirmPassword", "Confirm your password");
          return;
        }
        try {
          await schemas[step].validate(values, { abortEarly: false });
          setStep((s) => ((s + 1) as 0 | 1 | 2));
        } catch {

        }
        return;
      }

      if (submitting) return;
      if (!values.gender) return;

      const key = generateRecoveryKey();
      signupUser(
        {
          full_name: values.fullName,
          email: values.email,
          password: values.password,
          gender: values.gender,
          dob: dobToIso(values.dob),
          recovery_key: key,
        },
        {
          onSuccess: () => {
            setRecoveryKey(key);
            setPhase("recovery_key");
          },
          onError: (error) => onError?.(error.message),
        }
      );
    },
  });

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      formik.handleBlur(e);
      const email = formik.values.email;
      if (!email) return;
      await schemas[0].validateAt("email", { email });
      if (email === verifiedEmail) return;
      const result = await runEmailVerify(email);
      if (formik.values.email !== email) return;
      const next = result.verified === true ? "exists" : result.verified === false ? "unverified" : "available";
      setEmailVerifyState(next);
      setVerifiedEmail(email);
    } catch {

    }
  };

  const emailIsExisting = verifiedEmail === formik.values.email && emailVerifyState === "exists";

  const showFieldError = (field: keyof typeof formik.values): boolean =>
    !!formik.errors[field] &&
    (formik.submitCount > 0 || !!formik.touched[field] || !!(formik.values as any)[field]);

  const fullNameHelper = showFieldError("fullName") ? (formik.errors.fullName as string) : undefined;
  const emailHelper = showFieldError("email") ? formik.errors.email : emailIsExisting ? "User with this email already exists" : undefined;
  const passwordHelper = showFieldError("password") ? (formik.errors.password as string) : undefined;
  const confirmHelper = showFieldError("confirmPassword") ? (formik.errors.confirmPassword as string) : undefined;
  const genderHelper = showFieldError("gender") ? (formik.errors.gender as string) : undefined;
  const dobHelper = showFieldError("dob") ? (formik.errors.dob as string) : undefined;

  const getIconState = (
    field: "fullName" | "email" | "password" | "confirmPassword" | "gender" | "dob"
  ): "error" | "success" | undefined => {
    if (field === "email" && emailIsExisting) return "error";
    if (showFieldError(field)) return "error";
    if (!(formik.values as any)[field]) return undefined;
    return "success";
  };

  const handleCopyRecoveryKey = async () => {
    if (!recoveryKey) return;
    try {
      await navigator.clipboard.writeText(recoveryKey);
      setKeyCopied(true);
      window.setTimeout(() => setKeyCopied(false), 1500);
    } catch {

    }
  };

  const handleDownloadRecoveryKey = () => {
    if (!recoveryKey) return;
    const safeName =
      formik.values.fullName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "user";
    const filename = `kitaab_recovery_key_${safeName}.txt`;
    const blob = new Blob([recoveryKey], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < otpDigits.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpDigits.length);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(otpDigits.length).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtpDigits(next);
    const focusIndex = Math.min(pasted.length, otpDigits.length - 1);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = () => {
    if (verifyingOtp) return;
    const otp = otpDigits.join("");
    if (otp.length !== otpDigits.length) return;
    verifyOtp(
      { email: formik.values.email, otp },
      {
        onSuccess: () => setPhase("two_factor"),
        onError: (error) => onError?.(error.message),
      }
    );
  };

  const handleEnable2fa = () => {
    if (updating2fa) return;
    setTwoFactor(
      { two_factor_enabled: true },
      {
        onSuccess: () => setPhase("verified"),
        onError: (error) => onError?.(error.message),
      }
    );
  };

  const handleSkip2fa = () => {
    if (updating2fa) return;
    setPhase("verified");
  };

  const handleResendLink = () => {
    if (resendingLink) return;
    setResendSent(false);
    resendVerificationLink(
      { full_name: formik.values.fullName, email: formik.values.email },
      {
        onSuccess: () => {
          setResendSent(true);
          window.setTimeout(() => setResendSent(false), 2000);
        },
        onError: (error) => onError?.(error.message),
      }
    );
  };

  if (phase === "recovery_key") {
    return (
      <div
        className={styles.form}
        style={{ minHeight: lockedHeightPx }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Image
            priority
            width={75}
            height={75}
            alt="Kitaab logo"
            src="/kitaab-logo.png"
          />
        </div>
        <div
          style={{
            flex: 1,
            gap: 12,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <div style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "rgb(80, 80, 80)" }}>
            Account created
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
            Save this key. If you forget your password and don't have it, all your data will be permanently lost.
          </div>
          <div
            style={{
              gap: 8,
              padding: 10,
              display: "flex",
              borderRadius: 8,
              alignItems: "center",
              background: "rgb(255, 255, 255)",
              border: "1px solid rgb(230, 230, 230)",
            }}
          >
            <code
              style={{
                flex: 1,
                fontSize: 12,
                wordBreak: "break-all",
                color: "rgb(80, 80, 80)",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              {recoveryKey}
            </code>
            <button
              type="button"
              onClick={handleCopyRecoveryKey}
              aria-label={keyCopied ? "Copied" : "Copy recovery key"}
              style={{
                border: "none",
                cursor: "pointer",
                padding: "6px 8px",
                borderRadius: 6,
                background: "transparent",
                color: keyCopied ? "rgb(34, 139, 34)" : "rgb(120, 120, 120)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {keyCopied ? <FaCheck size={12} /> : <FiCopy size={12} />}
            </button>
            <button
              type="button"
              onClick={handleDownloadRecoveryKey}
              aria-label="Download recovery key"
              style={{
                border: "none",
                cursor: "pointer",
                padding: "6px 8px",
                borderRadius: 6,
                background: "transparent",
                color: "rgb(120, 120, 120)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiDownload size={12} />
            </button>
          </div>
          <div style={{ textAlign: "center", fontSize: 11, color: "rgb(170, 60, 60)" }}>
            This key will not be shown again.
          </div>
        </div>
        <div ref={signupButtonWrapperRef} className={styles.actionsSignup}>
          <ButtonGroup activeIndex={0} buttonWidth={signupButtonWidthPx}>
            <button
              type="button"
              onClick={() => setPhase("otp")}
            >
              Next
            </button>
          </ButtonGroup>
        </div>
      </div>
    );
  }

  if (phase === "otp") {
    const otpComplete = otpDigits.every((d) => d !== "");
    return (
      <div
        className={styles.form}
        style={{ minHeight: lockedHeightPx }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Image
            priority
            width={75}
            height={75}
            alt="Kitaab logo"
            src="/kitaab-logo.png"
          />
        </div>
        {otpInitializing ? (
          <div
            style={{
              flex: 1,
              gap: 16,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <div className={styles.spinner} aria-hidden="true" />
            <div style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "rgb(80, 80, 80)" }}>
              We already have your record
            </div>
            <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
              Redirecting you to verify your email...
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                flex: 1,
                gap: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <div style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "rgb(80, 80, 80)" }}>
                Verify your email
              </div>
              <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
                Enter the 4-digit code we sent to <strong style={{ color: "rgb(90, 90, 90)" }}>{formik.values.email}</strong>.
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpInputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    disabled={verifyingOtp}
                    aria-label={`Digit ${index + 1}`}
                    className={styles.otpInput}
                  />
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)" }}>
                Didn&apos;t get the code?{" "}
                <button
                  type="button"
                  className={styles.resendLink}
                  onClick={handleResendLink}
                  disabled={resendingLink || verifyingOtp}
                  aria-busy={resendingLink}
                >
                  {resendingLink ? "Sending..." : resendSent ? "Sent" : "Resend link"}
                </button>
              </div>
            </div>
            <div ref={signupButtonWrapperRef} className={styles.actionsSignup}>
              <ButtonGroup activeIndex={0} buttonWidth={signupButtonWidthPx}>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!otpComplete || verifyingOtp}
                  aria-busy={verifyingOtp}
                >
                  {verifyingOtp ? "Verifying..." : "Verify"}
                </button>
              </ButtonGroup>
            </div>
          </>
        )}
      </div>
    );
  }

  if (phase === "two_factor") {
    return (
      <div
        className={styles.form}
        style={{ minHeight: lockedHeightPx }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Image
            priority
            width={75}
            height={75}
            alt="Kitaab logo"
            src="/kitaab-logo.png"
          />
        </div>
        <div
          style={{
            flex: 1,
            gap: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <div style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "rgb(80, 80, 80)" }}>
            Enable two-factor authentication
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
            Add an extra layer of security to your account by requiring a code at sign-in.
          </div>
        </div>
        <div ref={signupButtonWrapperRef} className={styles.actionsSignup} style={{ marginTop: 19 }}>
          <ButtonGroup activeIndex={1} buttonWidth={(signupButtonWidthPx / 2) - 12}>
            <button
              type="button"
              onClick={handleSkip2fa}
              disabled={updating2fa}
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleEnable2fa}
              disabled={updating2fa}
              aria-busy={updating2fa}
            >
              {updating2fa ? "Enabling..." : "Enable"}
            </button>
          </ButtonGroup>
        </div>
      </div>
    );
  }

  if (phase === "verified") {
    return (
      <div
        className={styles.form}
        style={{ minHeight: lockedHeightPx }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Image
            priority
            width={75}
            height={75}
            alt="Kitaab logo"
            src="/kitaab-logo.png"
          />
        </div>
        <div
          style={{
            flex: 1,
            gap: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <div style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "rgb(80, 80, 80)" }}>
            Email verified
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)" }}>
            Your account is ready. You are now signed in.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={formik.handleSubmit} noValidate>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <Image
          priority
          width={75}
          height={75}
          alt="Kitaab logo"
          src="/kitaab-logo.png"
        />
      </div>
      <div className={styles.fullWidthStack}>
        {step === 0 ? (
          <>
            <Input
              required
              width="100%"
              name="fullName"
              inputType="text"
              label="Full name"
              id="signup-full-name"
              ariaLabel="Full name"
              placeholder="John Doe"
              onBlur={formik.handleBlur}
              helperText={fullNameHelper}
              onChange={formik.handleChange}
              value={formik.values.fullName}
              iconState={getIconState("fullName")}
              leftIcon={<FaUser />}
              leftIconSize={14}
            />
            <Input
              required
              width="100%"
              name="email"
              label="Email"
              id="signup-email"
              inputType="email"
              ariaLabel="Email"
              placeholder="your@mail.com"
              helperText={emailHelper}
              onBlur={handleEmailBlur}
              value={formik.values.email}
              onChange={formik.handleChange}
              iconState={getIconState("email")}
              leftIconSize={14}
              leftIcon={<FaEnvelope />}
            />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <Input
              required
              width="100%"
              name="password"
              label="Password"
              id="signup-password"
              ariaLabel="Password"
              placeholder="Pass@123"
              rightIconSize={16}
              onBlur={formik.handleBlur}
              helperText={passwordHelper}
              value={formik.values.password}
              onChange={formik.handleChange}
              iconState={getIconState("password")}
              inputType={showPassword ? "text" : "password"}
              onRightIconClick={() => setShowPassword((s) => !s)}
              rightIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
            />
            <Input
              required
              width="100%"
              name="confirmPassword"
              placeholder="Pass@123"
              label="Confirm Password"
              id="signup-confirm-password"
              ariaLabel="Confirm password"
              helperText={confirmHelper}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              iconState={getIconState("confirmPassword")}
              inputType={showConfirmPassword ? "text" : "password"}
              onRightIconClick={() => setShowConfirmPassword((s) => !s)}
              rightIcon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              rightIconSize={16}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <DatePicker
              required
              id="signup-dob"
              label="Date of Birth"
              placeholder="DD-MM-YYYY"
              ariaLabel="Date of birth"
              maxDate={new Date()}
              helperText={dobHelper}
              value={formik.values.dob}
              isError={getIconState("dob") === "error"}
              onChange={(v) => formik.setFieldValue("dob", v)}
            />
            <div style={{ position: "relative" }} ref={genderShellRef}>
              <div className={styles.topRow}>
                <label className={styles.label}>
                  Gender
                  <span className={styles.requiredMark}>*</span>
                </label>
                {genderHelper ? (
                  <span className={`${styles.helperText} ${styles.helperTextError}`}>{genderHelper}</span>
                ) : <span aria-hidden="true" />}
              </div>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isGenderOpen}
                onClick={() => setIsGenderOpen((o) => !o)}
                className={`${styles.input} ${genderHelper ? styles.inputErrorState : ""}`}
              >
                <span style={{ color: formik.values.gender ? "rgb(90, 90, 90)" : "rgb(180, 180, 180)" }}>
                  {formik.values.gender
                    ? formik.values.gender.charAt(0).toUpperCase() + formik.values.gender.slice(1)
                    : "Select gender"}
                </span>
                <IoCaretDownOutline
                  size={12}
                  className={`${styles.caretIcon} ${isGenderOpen ? styles.caretIconRotated : ""}`}
                />
              </button>
              {isGenderOpen ? (
                <div className={styles.selectDropdown} role="listbox" aria-label="Select gender">
                  {["male", "female", "other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={styles.selectDropdownItem}
                      onClick={() => {
                        formik.setFieldValue("gender", g);
                        setIsGenderOpen(false);
                      }}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
      <div ref={signupButtonWrapperRef} className={styles.actionsSignup} style={{ marginTop: 19 }}>
        <ButtonGroup activeIndex={1} buttonWidth={(signupButtonWidthPx / 2) - 12}>
          <button
            type="button"
            onClick={() => setStep((s) => (s > 0 ? ((s - 1) as 0 | 1 | 2) : s))}
            disabled={step === 0}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={submitting || (step === 0 && (emailChecking || emailIsExisting))}
            aria-busy={submitting || (step === 0 && emailChecking)}
          >
            {submitting ? "Signing up..." : step === 0 && emailChecking ? "Checking..." : step < 2 ? "Next": "Sign up"}
          </button>
        </ButtonGroup>
      </div>
      <div className={styles.separator}>
        <div className={styles.separatorLine} />
        <span>OR</span>
        <div className={styles.separatorLine} />
      </div>
      <div className={styles.secondaryActions}>
        <span>Already have an account?</span>
        <ButtonGroup buttonWidth={100}>
          <button
            type="button"
            data-flip
          >
            Login
          </button>
        </ButtonGroup>
      </div>
    </form>
  );
}