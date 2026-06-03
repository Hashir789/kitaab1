"use client";

import * as Yup from "yup";
import Image from "next/image";
import { useFormik } from "formik";
import styles from "./loginform.module.css";
import Input from "@/components/secondary/input/Input";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import { useLogin, useOtpVerify, useResendLink, useUpdate2fa } from "@/hooks/auth";

interface LoginFormProps {
  onError?: (message: string) => void;
}

type Step = "login" | "otp" | "ask_2fa" | "done";

export default function LoginForm({ onError }: LoginFormProps) {
  const [step, setStep] = useState<Step>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [otpInitializing, setOtpInitializing] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [fullName, setFullName] = useState<string>("");
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const loginButtonWrapperRef = useRef<HTMLDivElement>(null);
  const twoFaButtonWrapperRef = useRef<HTMLDivElement>(null);
  const otpButtonWrapperRef = useRef<HTMLDivElement>(null);
  const { mutate: loginUser, isPending: submitting } = useLogin();
  const { mutate: update2fa, isPending: updating2fa } = useUpdate2fa();
  const { mutate: verifyOtp, isPending: verifyingOtp } = useOtpVerify();
  const { mutate: resendVerificationLink, isPending: resendingLink } = useResendLink();
  const [loginButtonWidthPx, setLoginButtonWidthPx] = useState<number>(150);
  const [twoFaButtonWidthPx, setTwoFaButtonWidthPx] = useState<number>(120);
  const [otpButtonWidthPx, setOtpButtonWidthPx] = useState<number>(150);
  const [lockedHeightPx, setLockedHeightPx] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (step === "login" && formRef.current) {
      setLockedHeightPx(formRef.current.offsetHeight);
    }
  }, [step]);

  useEffect(() => {
    const updateWidth = () => {
      const loginEl = loginButtonWrapperRef.current;
      if (loginEl) {
        const wrapperWidth = loginEl.offsetWidth;
        setLoginButtonWidthPx(Math.max(50, Math.floor(wrapperWidth * 0.5)));
      }
      const twoFaEl = twoFaButtonWrapperRef.current;
      if (twoFaEl) {
        const wrapperWidth = twoFaEl.offsetWidth;
        setTwoFaButtonWidthPx(Math.max(50, Math.floor((wrapperWidth - 12) * 0.5) - 5));
      }
      const otpEl = otpButtonWrapperRef.current;
      if (otpEl) {
        const wrapperWidth = otpEl.offsetWidth;
        setOtpButtonWidthPx(Math.max(50, Math.floor(wrapperWidth - 12)));
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [step]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9]([a-zA-Z0-9.]*[a-zA-Z0-9])?@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,}$/,
        "Please enter a valid email address"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Please enter at least 8 characters")
      .matches(/[a-z]/, "Please enter at least a lowercase")
      .matches(/[A-Z]/, "Please enter at least an uppercase")
      .matches(/[0-9]/, "Please enter at least a number")
      .matches(/[^A-Za-z0-9]/, "Please enter a special character")
      .required("Password is required"),
  });

  const formik = useFormik<{ email: string; password: string }>({
    initialValues: { email: "", password: "" },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (submitting) return;
      loginUser(
        { email: values.email, password: values.password },
        {
          onSuccess: (data) => {
            if (data.two_factor_enabled) {
              setFullName(data.full_name);
              setOtpDigits(["", "", "", ""]);
              setResendSent(false);
              setOtpInitializing(true);
              setStep("otp");
              resendVerificationLink(
                { email: values.email, full_name: data.full_name },
                {
                  onSettled: () => setOtpInitializing(false),
                  onError: (error) => onError?.(error.message),
                }
              );
            } else {
              setStep("ask_2fa");
            }
          },
          onError: (error) => {
            onError?.(error.message);
          }
        }
      );
    }
  });

  const showFieldError = (field: "email" | "password"): boolean =>
    !!formik.errors[field] &&
    (formik.submitCount > 0 || !!formik.touched[field] || !!formik.values[field]);

  const emailHelper = showFieldError("email") ? formik.errors.email : undefined;
  const passwordHelper = showFieldError("password") ? formik.errors.password : undefined;

  const getIconState = (field: "email" | "password"): "error" | "success" | undefined => {
    if (showFieldError(field)) return "error";
    if (!formik.values[field]) return undefined;
    return "success";
  };

  const handleEnable2fa = () => {
    if (updating2fa) return;
    update2fa(
      { two_factor_enabled: true },
      {
        onSuccess: () => setStep("done"),
        onError: (error) => onError?.(error.message)
      }
    );
  };

  const handleSkip2fa = () => {
    if (updating2fa) return;
    setStep("done");
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
        onSuccess: () => setStep("done"),
        onError: (error) => onError?.(error.message),
      }
    );
  };

  const handleResendLink = () => {
    if (resendingLink) return;
    setResendSent(false);
    resendVerificationLink(
      { email: formik.values.email, full_name: fullName },
      {
        onSuccess: () => {
          setResendSent(true);
          window.setTimeout(() => setResendSent(false), 2000);
        },
        onError: (error) => onError?.(error.message),
      }
    );
  };

  if (step === "otp") {
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
              Sending verification code
            </div>
            <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
              Hang on while we email your code...
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
                Verify it&apos;s you
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
            <div ref={otpButtonWrapperRef} className={styles.actionsLogin}>
              <ButtonGroup activeIndex={0} buttonWidth={otpButtonWidthPx}>
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

  if (step === "ask_2fa") {
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
            Enable two-factor authentication?
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
            Add an extra layer of security to your account. You'll be asked for a code sent to your email each time you login.
          </div>
        </div>
        <div ref={twoFaButtonWrapperRef} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <ButtonGroup activeIndex={1} buttonWidth={twoFaButtonWidthPx}>
            <button
              type="button"
              onClick={handleSkip2fa}
              disabled={updating2fa}
            >
              Not now
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

  if (step === "done") {
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
            You're all set
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)" }}>
            You are now signed in.
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
        <Input
          required
          name="email"
          width="100%"
          label="Email"
          id="login-email"
          inputType="email"
          ariaLabel="Email"
          placeholder="your@mail.com"
          helperText={emailHelper}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          onChange={formik.handleChange}
          iconState={getIconState("email")}
          leftIconSize={14}
          leftIcon={<FaEnvelope />}
        />
        <Input
          required
          width="100%"
          name="password"
          label="Password"
          id="login-password"
          ariaLabel="Password"
          placeholder="Pass@123"
          inputType={showPassword ? "text" : "password"}
          onBlur={formik.handleBlur}
          helperText={passwordHelper}
          value={formik.values.password}
          onChange={formik.handleChange}
          iconState={getIconState("password")}
          leftIconSize={14}
          rightIconSize={16}
          leftIcon={<FaLock />}
          onRightIconClick={() => setShowPassword((s) => !s)}
          rightIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
        />
      </div>
      <button
        type="button"
        className={styles.linkButton}
        onClick={() => {}}
      >
        Forgot password?
      </button>
      <div ref={loginButtonWrapperRef} className={styles.actionsLogin}>
        <ButtonGroup activeIndex={0} buttonWidth={loginButtonWidthPx}>
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </ButtonGroup>
      </div>
      <div className={styles.separator}>
        <div className={styles.separatorLine} />
        <span>OR</span>
        <div className={styles.separatorLine} />
      </div>
      <div className={styles.secondaryActions}>
        <span>Don't have an account?</span>
        <ButtonGroup buttonWidth={100}>
          <button
            type="button"
            data-flip
          >
            Sign up
          </button>
        </ButtonGroup>
      </div>
    </form>
  );
}
