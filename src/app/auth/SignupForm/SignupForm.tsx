"use client";

import * as Yup from "yup";
import Image from "next/image";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import styles from "./signupform.module.css";
import { IoCaretDownOutline } from "react-icons/io5";
import { generateRecoveryKey } from "@/utils/recovery";
import Input from "@/components/secondary/input/Input";
import Loader from "@/components/secondary/loader/Loader";
import { FiDownload, FiAlertCircle } from "react-icons/fi";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import type { SignupFormProps } from "./signupform.interface";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DatePicker from "@/components/secondary/datepicker/DatePicker";
import { FaUser, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { getUserIdFromToken, setPendingPassword } from "@/utils/session";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import { useSignup, useOtpVerify, useEmailVerify, useResendLink, useUpdate2fa } from "@/hooks/auth";
import { phase as Phase, gender, signupField, iconState as IconState, emailVerifyState as EmailVerifyState, signupFormStep as SignupFormStep } from "@/constants/enums";
import { authAria, authAriaDigit, authButtonLabel, authDescription, authHeading, authLabel, authMisc, authPlaceholder, authValidation } from "@/constants/placeholders";

export default function SignupForm({ onError }: SignupFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<SignupFormStep>(SignupFormStep.DETAILS);
  const [phase, setPhase] = useState<Phase>(Phase.FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [keyDownloaded, setKeyDownloaded] = useState(false);
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
  const [emailVerifyState, setEmailVerifyState] = useState<EmailVerifyState>(EmailVerifyState.IDLE);
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");
  const [otpInitializing, setOtpInitializing] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useLayoutEffect(() => {
    if (phase === Phase.FORM && formRef.current) {
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

  const schemas: Record<SignupFormStep, Yup.ObjectSchema<any>> = {
    [SignupFormStep.DETAILS]: Yup.object({
      [signupField.FULL_NAME]: Yup.string()
        .min(3, authValidation.FULL_NAME_MIN_3)
        .max(60, authValidation.FULL_NAME_MAX_60)
        .matches(/^[a-zA-Z][a-zA-Z\s.'-]*$/, authValidation.FULL_NAME_INVALID)
        .required(authValidation.FULL_NAME_REQUIRED),
      [signupField.EMAIL]: Yup.string()
        .matches(
          /^[a-zA-Z0-9]([a-zA-Z0-9.]*[a-zA-Z0-9])?@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,}$/,
          authValidation.EMAIL_INVALID
        )
        .required(authValidation.EMAIL_REQUIRED),
    }),
    [SignupFormStep.PASSWORD]: Yup.object({
      [signupField.PASSWORD]: Yup.string()
        .min(8, authValidation.PASSWORD_MIN_8)
        .matches(/[a-z]/, authValidation.PASSWORD_LOWERCASE)
        .matches(/[A-Z]/, authValidation.PASSWORD_UPPERCASE)
        .matches(/[0-9]/, authValidation.PASSWORD_NUMBER)
        .matches(/[^A-Za-z0-9]/, authValidation.PASSWORD_SPECIAL)
        .required(authValidation.PASSWORD_REQUIRED),
      [signupField.CONFIRM_PASSWORD]: Yup.string()
        .test("match-if-filled", authValidation.PASSWORDS_MUST_MATCH, function (value) {
          if (!value) return true;
          return value === this.parent[signupField.PASSWORD];
        }),
    }),
    [SignupFormStep.PROFILE]: Yup.object({
      [signupField.GENDER]: Yup.string()
        .oneOf(Object.values(gender), authValidation.GENDER_SELECT)
        .required(authValidation.GENDER_REQUIRED),
      [signupField.DOB]: Yup.string()
        .required(authValidation.DOB_REQUIRED)
        .matches(/^\d{2}-\d{2}-\d{4}$/, authValidation.DOB_FORMAT)
        .test("not-future", authValidation.DOB_NOT_FUTURE, (val) => {
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
    [signupField.FULL_NAME]: string;
    [signupField.EMAIL]: string;
    [signupField.PASSWORD]: string;
    [signupField.CONFIRM_PASSWORD]: string;
    [signupField.GENDER]: "" | gender;
    [signupField.DOB]: string;
  }>({
    initialValues: {
      [signupField.FULL_NAME]: "",
      [signupField.EMAIL]: "",
      [signupField.PASSWORD]: "",
      [signupField.CONFIRM_PASSWORD]: "",
      [signupField.GENDER]: "",
      [signupField.DOB]: "",
    },
    validationSchema: schemas[step],
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (step < SignupFormStep.PROFILE) {
        if (step === SignupFormStep.DETAILS) {
          try {
            await schemas[SignupFormStep.DETAILS].validate(values, { abortEarly: false });
          } catch {
            return;
          }

          let state = verifiedEmail === values[signupField.EMAIL] ? emailVerifyState : EmailVerifyState.IDLE;
          if (state === EmailVerifyState.IDLE) {
            try {
              const result = await runEmailVerify(values[signupField.EMAIL]);
              if (formik.values[signupField.EMAIL] !== values[signupField.EMAIL]) return;
              state = result.verified === true ? EmailVerifyState.EXISTS: result.verified === false ? EmailVerifyState.UNVERIFIED: EmailVerifyState.AVAILABLE;
              setEmailVerifyState(state);
              setVerifiedEmail(values[signupField.EMAIL]);
            } catch {
              state = EmailVerifyState.AVAILABLE;
            }
          }

          if (state === EmailVerifyState.EXISTS) return;
          if (state === EmailVerifyState.UNVERIFIED) {
            setOtpInitializing(true);
            resendVerificationLink(
              { email: values[signupField.EMAIL] },
              { onSettled: () => setOtpInitializing(false) }
            );
            setPhase(Phase.OTP);
            return;
          }
          setStep(SignupFormStep.PASSWORD);
          return;
        }

        if (step === SignupFormStep.PASSWORD && !values[signupField.CONFIRM_PASSWORD]) {
          formik.setFieldTouched(signupField.CONFIRM_PASSWORD, true, false);
          formik.setFieldError(signupField.CONFIRM_PASSWORD, authValidation.CONFIRM_PASSWORD);
          return;
        }
        try {
          await schemas[step].validate(values, { abortEarly: false });
          setStep((s) => (s + 1) as SignupFormStep);
        } catch {

        }
        return;
      }

      if (submitting) return;
      if (!values[signupField.GENDER]) return;

      const key = generateRecoveryKey();
      signupUser(
        {
          full_name: values[signupField.FULL_NAME],
          email: values[signupField.EMAIL],
          password: values[signupField.PASSWORD],
          gender: values[signupField.GENDER],
          dob: dobToIso(values[signupField.DOB]),
          recovery_key: key,
        },
        {
          onSuccess: () => {
            setRecoveryKey(key);
            setPhase(Phase.RECOVERY_KEY);
          },
          onError: (error) => onError?.(error.message),
        }
      );
    },
  });

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      formik.handleBlur(e);
      const email = formik.values[signupField.EMAIL];
      if (!email) return;
      await schemas[SignupFormStep.DETAILS].validateAt(signupField.EMAIL, { [signupField.EMAIL]: email });
      if (email === verifiedEmail) return;
      const result = await runEmailVerify(email);
      if (formik.values[signupField.EMAIL] !== email) return;
      const next = result.verified === true ? EmailVerifyState.EXISTS: result.verified === false ? EmailVerifyState.UNVERIFIED: EmailVerifyState.AVAILABLE;
      setEmailVerifyState(next);
      setVerifiedEmail(email);
    } catch {

    }
  };

  const emailIsExisting = verifiedEmail === formik.values[signupField.EMAIL] && emailVerifyState === EmailVerifyState.EXISTS;

  const showFieldError = (field: signupField): boolean =>
    !!formik.errors[field] &&
    (formik.submitCount > 0 || !!formik.touched[field] || !!formik.values[field]);

  const fullNameHelper = showFieldError(signupField.FULL_NAME)
    ? (formik.errors[signupField.FULL_NAME] as string)
    : undefined;
  const emailHelper = showFieldError(signupField.EMAIL)
    ? formik.errors[signupField.EMAIL]
    : emailIsExisting
      ? authValidation.EMAIL_EXISTS
      : undefined;
  const passwordHelper = showFieldError(signupField.PASSWORD)
    ? (formik.errors[signupField.PASSWORD] as string)
    : undefined;
  const confirmHelper = showFieldError(signupField.CONFIRM_PASSWORD)
    ? (formik.errors[signupField.CONFIRM_PASSWORD] as string)
    : undefined;
  const genderHelper = showFieldError(signupField.GENDER)
    ? (formik.errors[signupField.GENDER] as string)
    : undefined;
  const dobHelper = showFieldError(signupField.DOB)
    ? (formik.errors[signupField.DOB] as string)
    : undefined;

  const getIconState = (field: signupField): IconState | undefined => {
    if (field === signupField.EMAIL && emailIsExisting) return IconState.ERROR;
    if (showFieldError(field)) return IconState.ERROR;
    if (!formik.values[field]) return undefined;
    return IconState.SUCCESS;
  };

  const handleDownloadRecoveryKey = () => {
    if (!recoveryKey) return;
    const safeName =
      formik.values[signupField.FULL_NAME]
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
    setKeyDownloaded(true);
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
      { email: formik.values[signupField.EMAIL], otp },
      {
        onSuccess: () => setPhase(Phase.TWO_FACTOR),
        onError: (error) => onError?.(error.message),
      }
    );
  };

  const handleEnable2fa = () => {
    if (updating2fa) return;
    setTwoFactor(
      { two_factor_enabled: true },
      {
        onSuccess: () => finishSignup(),
        onError: (error) => onError?.(error.message),
      }
    );
  };

  const finishSignup = () => {
    setPendingPassword(formik.values[signupField.PASSWORD]);
    const userId = getUserIdFromToken();
    if (userId) router.replace(`/user/${userId}`);
  };

  const handleSkip2fa = () => {
    if (updating2fa) return;
    finishSignup();
  };

  const handleResendLink = () => {
    if (resendingLink) return;
    setResendSent(false);
    resendVerificationLink(
      { email: formik.values[signupField.EMAIL] },
      {
        onSuccess: () => {
          setResendSent(true);
          window.setTimeout(() => setResendSent(false), 2000);
        },
        onError: (error) => onError?.(error.message),
      }
    );
  };

  if (phase === Phase.RECOVERY_KEY) {
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
            src="/kitaab-logo.png"
            alt={authAria.KITAAB_LOGO}
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
            {authHeading.ACCOUNT_CREATED}
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
            {authDescription.RECOVERY_KEY_SAVE}
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
            <Tooltip
              text={recoveryKey ?? ""}
              position="top"
              className={styles.recoveryKeyTooltip}
            >
              <code
                style={{
                  fontSize: 12,
                  display: "block",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  color: "rgb(80, 80, 80)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                {recoveryKey}
              </code>
            </Tooltip>
            <Tooltip text={authAria.DOWNLOAD_RECOVERY_KEY} position="top">
              <button
                type="button"
                onClick={handleDownloadRecoveryKey}
                aria-label={authAria.DOWNLOAD_RECOVERY_KEY}
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
            </Tooltip>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                gap: 6,
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                color: "rgb(170, 60, 60)",
                background: "rgb(253, 237, 237)",
                border: "1px solid rgb(240, 200, 200)",
              }}
            >
              <FiAlertCircle size={12} />
              {authDescription.RECOVERY_KEY_NOT_SHOWN_AGAIN}
            </div>
          </div>
        </div>
        <div ref={signupButtonWrapperRef} className={styles.actionsLogin}>
          {!keyDownloaded ? (
            <Tooltip text={authDescription.DOWNLOAD_RECOVERY_KEY_TO_CONTINUE} position="top">
              <ButtonGroup activeIndex={0} buttonWidth={(signupButtonWidthPx / 2) - 12}>
                <button type="button" disabled>
                  {authButtonLabel.NEXT}
                </button>
              </ButtonGroup>
            </Tooltip>
          ) : (
            <ButtonGroup activeIndex={0} buttonWidth={(signupButtonWidthPx / 2) - 12}>
              <button type="button" onClick={() => setPhase(Phase.OTP)}>
                {authButtonLabel.NEXT}
              </button>
            </ButtonGroup>
          )}
        </div>
      </div>
    );
  }

  if (phase === Phase.OTP) {
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
            src="/kitaab-logo.png"
            alt={authAria.KITAAB_LOGO}
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
            <Loader />
            <div style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "rgb(80, 80, 80)" }}>
              {authHeading.RECORD_EXISTS}
            </div>
            <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
              {authDescription.OTP_REDIRECTING}
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
                {authHeading.VERIFY_YOUR_EMAIL}
              </div>
              <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
                {authDescription.OTP_CODE_PREFIX}<strong style={{ color: "rgb(90, 90, 90)" }}>{formik.values[signupField.EMAIL]}</strong>{authDescription.OTP_CODE_SUFFIX}
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
                    aria-label={authAriaDigit(index)}
                    className={styles.otpInput}
                  />
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)" }}>
                {authDescription.RESEND_CODE_PROMPT}{" "}
                <button
                  type="button"
                  className={styles.resendLink}
                  onClick={handleResendLink}
                  disabled={resendingLink || verifyingOtp}
                  aria-busy={resendingLink}
                >
                  {resendingLink ? authButtonLabel.SENDING : resendSent ? authButtonLabel.SENT : authButtonLabel.RESEND_LINK}
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
                  {verifyingOtp ? authButtonLabel.VERIFYING : authButtonLabel.VERIFY}
                </button>
              </ButtonGroup>
            </div>
          </>
        )}
      </div>
    );
  }

  if (phase === Phase.TWO_FACTOR) {
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
            src="/kitaab-logo.png"
            alt={authAria.KITAAB_LOGO}
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
            {authHeading.ENABLE_TWO_FACTOR}
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
            {authDescription.SIGNUP_TWO_FACTOR}
          </div>
        </div>
        <div ref={signupButtonWrapperRef} className={styles.actionsSignup} style={{ marginTop: 19 }}>
          <ButtonGroup activeIndex={1} buttonWidth={(signupButtonWidthPx / 2) - 12}>
            <button
              type="button"
              onClick={handleSkip2fa}
              disabled={updating2fa}
            >
              {authButtonLabel.SKIP}
            </button>
            <button
              type="button"
              onClick={handleEnable2fa}
              disabled={updating2fa}
              aria-busy={updating2fa}
            >
              {updating2fa ? authButtonLabel.ENABLING : authButtonLabel.ENABLE}
            </button>
          </ButtonGroup>
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
          src="/kitaab-logo.png"
          alt={authAria.KITAAB_LOGO}
        />
      </div>
      <div className={styles.fullWidthStack}>
        {step === SignupFormStep.DETAILS ? (
          <>
            <Input
              required
              width="100%"
              name={signupField.FULL_NAME}
              inputType="text"
              label={authLabel.FULL_NAME}
              id="signup-full-name"
              ariaLabel={authAria.FULL_NAME}
              placeholder={authPlaceholder.FULL_NAME}
              onBlur={formik.handleBlur}
              helperText={fullNameHelper}
              onChange={formik.handleChange}
              value={formik.values[signupField.FULL_NAME]}
              iconState={getIconState(signupField.FULL_NAME)}
              leftIcon={<FaUser />}
              leftIconSize={14}
            />
            <Input
              required
              width="100%"
              name={signupField.EMAIL}
              label={authLabel.EMAIL}
              id="signup-email"
              inputType="email"
              ariaLabel={authAria.EMAIL}
              placeholder={authPlaceholder.EMAIL}
              helperText={emailHelper}
              onBlur={handleEmailBlur}
              value={formik.values[signupField.EMAIL]}
              onChange={formik.handleChange}
              iconState={getIconState(signupField.EMAIL)}
              leftIconSize={14}
              leftIcon={<FaEnvelope />}
            />
          </>
        ) : null}

        {step === SignupFormStep.PASSWORD ? (
          <>
            <Input
              required
              width="100%"
              name={signupField.PASSWORD}
              label={authLabel.PASSWORD}
              id="signup-password"
              ariaLabel={authAria.PASSWORD}
              placeholder={authPlaceholder.PASSWORD}
              rightIconSize={16}
              onBlur={formik.handleBlur}
              helperText={passwordHelper}
              value={formik.values[signupField.PASSWORD]}
              onChange={formik.handleChange}
              iconState={getIconState(signupField.PASSWORD)}
              inputType={showPassword ? "text" : "password"}
              onRightIconClick={() => setShowPassword((s) => !s)}
              rightIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
            />
            <Input
              required
              width="100%"
              name={signupField.CONFIRM_PASSWORD}
              placeholder={authPlaceholder.PASSWORD}
              label={authLabel.CONFIRM_PASSWORD}
              id="signup-confirm-password"
              ariaLabel={authAria.CONFIRM_PASSWORD}
              helperText={confirmHelper}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values[signupField.CONFIRM_PASSWORD]}
              iconState={getIconState(signupField.CONFIRM_PASSWORD)}
              inputType={showConfirmPassword ? "text" : "password"}
              onRightIconClick={() => setShowConfirmPassword((s) => !s)}
              rightIcon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              rightIconSize={16}
            />
          </>
        ) : null}

        {step === SignupFormStep.PROFILE ? (
          <>
            <DatePicker
              required
              id="signup-dob"
              label={authLabel.DATE_OF_BIRTH}
              placeholder={authPlaceholder.DATE_OF_BIRTH}
              ariaLabel={authAria.DATE_OF_BIRTH}
              maxDate={new Date()}
              helperText={dobHelper}
              value={formik.values[signupField.DOB]}
              isError={getIconState(signupField.DOB) === IconState.ERROR}
              onChange={(v) => formik.setFieldValue(signupField.DOB, v)}
            />
            <div style={{ position: "relative" }} ref={genderShellRef}>
              <div className={styles.topRow}>
                <label className={styles.label}>
                  {authLabel.GENDER}
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
                <span style={{ color: formik.values[signupField.GENDER] ? "rgb(90, 90, 90)" : "rgb(180, 180, 180)" }}>
                  {formik.values[signupField.GENDER]
                    ? formik.values[signupField.GENDER].charAt(0).toUpperCase() + formik.values[signupField.GENDER].slice(1)
                    : authPlaceholder.SELECT_GENDER}
                </span>
                <IoCaretDownOutline
                  size={12}
                  className={`${styles.caretIcon} ${isGenderOpen ? styles.caretIconRotated : ""}`}
                />
              </button>
              {isGenderOpen ? (
                <div className={styles.selectDropdown} role="listbox" aria-label={authAria.SELECT_GENDER}>
                  {Object.values(gender).map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={styles.selectDropdownItem}
                      onClick={() => {
                        formik.setFieldValue(signupField.GENDER, g);
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
            onClick={() =>
              setStep((s) => (s > SignupFormStep.DETAILS ? ((s - 1) as SignupFormStep) : s))
            }
            disabled={step === SignupFormStep.DETAILS}
          >
            {authButtonLabel.BACK}
          </button>
          <button
            type="submit"
            aria-busy={submitting || (step === SignupFormStep.DETAILS && emailChecking)}
            disabled={submitting || (step === SignupFormStep.DETAILS && (emailChecking || emailIsExisting))}
          >
            {submitting
              ? authButtonLabel.SIGNING_UP
              : step === SignupFormStep.DETAILS && emailChecking
                ? authButtonLabel.CHECKING
                : step < SignupFormStep.PROFILE
                  ? authButtonLabel.NEXT
                  : authButtonLabel.SIGN_UP}
          </button>
        </ButtonGroup>
      </div>
      <div className={styles.separator}>
        <div className={styles.separatorLine} />
        <span>{authMisc.OR}</span>
        <div className={styles.separatorLine} />
      </div>
      <div className={styles.secondaryActions}>
        <span>{authMisc.HAS_ACCOUNT}</span>
        <ButtonGroup buttonWidth={100}>
          <button
            type="button"
            data-flip
          >
            {authButtonLabel.LOGIN}
          </button>
        </ButtonGroup>
      </div>
    </form>
  );
}