"use client";

import * as Yup from "yup";
import Image from "next/image";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import styles from "./loginform.module.css";
import Input from "@/components/secondary/input/Input";
import type { LoginFormProps } from "./loginform.interface";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import { getUserIdFromToken, setPendingPassword } from "@/utils/session";
import { FaLock, FaEye, FaEyeSlash, FaEnvelope, FaUser } from "react-icons/fa";
import { useForgotPassword, useLogin, useOtpVerify, useResendLink, useUpdate2fa } from "@/hooks/auth";
import { step as LoginStep, loginField, iconState as IconState, forgotPasswordField } from "@/constants/enums";
import { authAria, authAriaDigit, authButtonLabel, authDescription, authHeading, authLabel, authLink, authMisc, authPlaceholder, authValidation } from "@/constants/placeholders";

export default function LoginForm({ onError }: LoginFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>(LoginStep.LOGIN);
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [otpInitializing, setOtpInitializing] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const loginButtonWrapperRef = useRef<HTMLDivElement>(null);
  const twoFaButtonWrapperRef = useRef<HTMLDivElement>(null);
  const otpButtonWrapperRef = useRef<HTMLDivElement>(null);
  const forgotButtonWrapperRef = useRef<HTMLDivElement>(null);
  const { mutate: loginUser, isPending: submitting } = useLogin();
  const { mutate: update2fa, isPending: updating2fa } = useUpdate2fa();
  const { mutate: verifyOtp, isPending: verifyingOtp } = useOtpVerify();
  const { mutate: resendVerificationLink, isPending: resendingLink } = useResendLink();
  const { mutate: sendForgotPassword, isPending: sendingForgotPassword } = useForgotPassword();
  const [loginButtonWidthPx, setLoginButtonWidthPx] = useState<number>(150);
  const [twoFaButtonWidthPx, setTwoFaButtonWidthPx] = useState<number>(120);
  const [otpButtonWidthPx, setOtpButtonWidthPx] = useState<number>(150);
  const [forgotButtonWidthPx, setForgotButtonWidthPx] = useState<number>(150);
  const [lockedHeightPx, setLockedHeightPx] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (step === LoginStep.LOGIN && formRef.current) {
      setLockedHeightPx(formRef.current.offsetHeight);
    }
  }, [step]);

  useEffect(() => {
    const updateWidth = () => {
      const loginEl = loginButtonWrapperRef.current;
      if (loginEl) {
        const wrapperWidth = loginEl.offsetWidth;
        setLoginButtonWidthPx(Math.max(50, Math.floor((wrapperWidth - 24) * 0.5)));
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
      const forgotEl = forgotButtonWrapperRef.current;
      if (forgotEl) {
        const wrapperWidth = forgotEl.offsetWidth;
        setForgotButtonWidthPx(Math.max(50, Math.floor((wrapperWidth / 2) - 12)));
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [step]);

  const validationSchema = Yup.object({
    [loginField.EMAIL]: Yup.string()
      .matches(
        /^[a-zA-Z0-9]([a-zA-Z0-9.]*[a-zA-Z0-9])?@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,}$/,
        authValidation.EMAIL_INVALID
      )
      .required(authValidation.EMAIL_REQUIRED),
    [loginField.PASSWORD]: Yup.string()
      .min(8, authValidation.PASSWORD_MIN_8)
      .matches(/[a-z]/, authValidation.PASSWORD_LOWERCASE)
      .matches(/[A-Z]/, authValidation.PASSWORD_UPPERCASE)
      .matches(/[0-9]/, authValidation.PASSWORD_NUMBER)
      .matches(/[^A-Za-z0-9]/, authValidation.PASSWORD_SPECIAL)
      .required(authValidation.PASSWORD_REQUIRED),
  });

  const performLogin = (email: string, password: string) => {
    if (submitting) return;
    loginUser(
      { email, password },
      {
        onSuccess: (data) => {
          setPendingPassword(password);
          if (data.two_factor_enabled) {
            setOtpDigits(["", "", "", ""]);
            setResendSent(false);
            setOtpInitializing(true);
            setStep(LoginStep.OTP);
            resendVerificationLink(
              { email, full_name: "" },
              {
                onSettled: () => setOtpInitializing(false),
                onError: (error) => onError?.(error.message),
              }
            );
          } else {
            setStep(LoginStep.ASK_2FA);
          }
        },
        onError: (error) => {
          onError?.(error.message);
        }
      }
    );
  };

  const formik = useFormik<Record<loginField, string>>({
    initialValues: { [loginField.EMAIL]: "", [loginField.PASSWORD]: "" },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      performLogin(values[loginField.EMAIL], values[loginField.PASSWORD]);
    }
  });

  const forgotValidationSchema = Yup.object({
    [forgotPasswordField.FULL_NAME]: Yup.string()
      .trim()
      .min(2, authValidation.FULL_NAME_MIN_2)
      .required(authValidation.FULL_NAME_REQUIRED),
    [forgotPasswordField.EMAIL]: Yup.string()
      .matches(
        /^[a-zA-Z0-9]([a-zA-Z0-9.]*[a-zA-Z0-9])?@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,}$/,
        authValidation.EMAIL_INVALID
      )
      .required(authValidation.EMAIL_REQUIRED),
  });

  const forgotFormik = useFormik<Record<forgotPasswordField, string>>({
    initialValues: { [forgotPasswordField.FULL_NAME]: "", [forgotPasswordField.EMAIL]: "" },
    validationSchema: forgotValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (sendingForgotPassword) return;
      sendForgotPassword(
        {
          full_name: values[forgotPasswordField.FULL_NAME].trim(),
          email: values[forgotPasswordField.EMAIL],
        },
        {
          onSuccess: () => setStep(LoginStep.FORGOT_PASSWORD_SENT),
          onError: (error) => onError?.(error.message),
        }
      );
    },
  });

  const showForgotFieldError = (field: forgotPasswordField): boolean =>
    !!forgotFormik.errors[field] &&
    (forgotFormik.submitCount > 0 || !!forgotFormik.touched[field] || !!forgotFormik.values[field]);

  const forgotFullNameHelper = showForgotFieldError(forgotPasswordField.FULL_NAME)
    ? forgotFormik.errors[forgotPasswordField.FULL_NAME]
    : undefined;
  const forgotEmailHelper = showForgotFieldError(forgotPasswordField.EMAIL)
    ? forgotFormik.errors[forgotPasswordField.EMAIL]
    : undefined;

  const getForgotIconState = (field: forgotPasswordField): IconState | undefined => {
    if (showForgotFieldError(field)) return IconState.ERROR;
    if (!forgotFormik.values[field]) return undefined;
    return IconState.SUCCESS;
  };

  const handleDemoLogin = () => {
    const email = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "";
    const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "";
    formik.setValues({ [loginField.EMAIL]: email, [loginField.PASSWORD]: password });
    performLogin(email, password);
  };

  const showFieldError = (field: loginField): boolean =>
    !!formik.errors[field] &&
    (formik.submitCount > 0 || !!formik.touched[field] || !!formik.values[field]);

  const emailHelper = showFieldError(loginField.EMAIL) ? formik.errors[loginField.EMAIL] : undefined;
  const passwordHelper = showFieldError(loginField.PASSWORD) ? formik.errors[loginField.PASSWORD] : undefined;

  const getIconState = (field: loginField): IconState | undefined => {
    if (showFieldError(field)) return IconState.ERROR;
    if (!formik.values[field]) return undefined;
    return IconState.SUCCESS;
  };

  const finishLogin = () => {
    setPendingPassword(formik.values[loginField.PASSWORD]);
    const userId = getUserIdFromToken();
    if (userId) router.replace(`/user/${userId}`);
  };

  const handleEnable2fa = () => {
    if (updating2fa) return;
    update2fa(
      { two_factor_enabled: true },
      {
        onSuccess: () => finishLogin(),
        onError: (error) => onError?.(error.message)
      }
    );
  };

  const handleSkip2fa = () => {
    if (updating2fa) return;
    finishLogin();
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
      { email: formik.values[loginField.EMAIL], otp },
      {
        onSuccess: () => finishLogin(),
        onError: (error) => onError?.(error.message),
      }
    );
  };

  const handleResendLink = () => {
    if (resendingLink) return;
    setResendSent(false);
    resendVerificationLink(
      { email: formik.values[loginField.EMAIL], full_name: "" },
      {
        onSuccess: () => {
          setResendSent(true);
          window.setTimeout(() => setResendSent(false), 2000);
        },
        onError: (error) => onError?.(error.message),
      }
    );
  };

  if (step === LoginStep.OTP) {
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
            <div className={styles.spinner} aria-hidden="true" />
            <div style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "rgb(80, 80, 80)" }}>
              {authHeading.SENDING_VERIFICATION_CODE}
            </div>
            <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
              {authDescription.OTP_SENDING}
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
                {authHeading.VERIFY_ITS_YOU}
              </div>
              <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
                {authDescription.OTP_CODE_PREFIX}<strong style={{ color: "rgb(90, 90, 90)" }}>{formik.values[loginField.EMAIL]}</strong>{authDescription.OTP_CODE_SUFFIX}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    inputMode="numeric"
                    disabled={verifyingOtp}
                    onPaste={handleOtpPaste}
                    className={styles.otpInput}
                    autoComplete="one-time-code"
                    aria-label={authAriaDigit(index)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    ref={(el) => { otpInputRefs.current[index] = el; }}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
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
            <div ref={otpButtonWrapperRef} className={styles.actionsLogin}>
              <ButtonGroup activeIndex={0} buttonWidth={otpButtonWidthPx}>
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

  if (step === LoginStep.ASK_2FA) {
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
            alt={authAria.KITAAB_LOGO}
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
            {authHeading.ENABLE_TWO_FACTOR_QUESTION}
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
            {authDescription.LOGIN_TWO_FACTOR}
          </div>
        </div>
        <div ref={twoFaButtonWrapperRef} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <ButtonGroup activeIndex={1} buttonWidth={twoFaButtonWidthPx}>
            <button
              type="button"
              onClick={handleSkip2fa}
              disabled={updating2fa}
            >
              {authButtonLabel.NOT_NOW}
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

  if (step === LoginStep.FORGOT_PASSWORD) {
    return (
      <form
        className={styles.form}
        onSubmit={forgotFormik.handleSubmit}
        style={{ minHeight: lockedHeightPx }}
        noValidate
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Image
            priority
            width={75}
            height={75}
            alt={authAria.KITAAB_LOGO}
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
            {authHeading.RESET_PASSWORD}
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
            {authDescription.FORGOT_PASSWORD}
          </div>
          <div className={styles.fullWidthStack}>
            <Input
              required
              width="100%"
              inputType="text"
              id="forgot-full-name"
              leftIconSize={14}
              leftIcon={<FaUser />}
              label={authLabel.FULL_NAME}
              ariaLabel={authAria.FULL_NAME}
              onBlur={forgotFormik.handleBlur}
              helperText={forgotFullNameHelper}
              name={forgotPasswordField.FULL_NAME}
              onChange={forgotFormik.handleChange}
              placeholder={authPlaceholder.FULL_NAME}
              value={forgotFormik.values[forgotPasswordField.FULL_NAME]}
              iconState={getForgotIconState(forgotPasswordField.FULL_NAME)}
            />
            <Input
              required
              width="100%"
              inputType="email"
              id="forgot-email"
              leftIconSize={14}
              label={authLabel.EMAIL}
              leftIcon={<FaEnvelope />}
              ariaLabel={authAria.EMAIL}
              helperText={forgotEmailHelper}
              onBlur={forgotFormik.handleBlur}
              name={forgotPasswordField.EMAIL}
              placeholder={authPlaceholder.EMAIL}
              onChange={forgotFormik.handleChange}
              value={forgotFormik.values[forgotPasswordField.EMAIL]}
              iconState={getForgotIconState(forgotPasswordField.EMAIL)}
            />
          </div>
        </div>
        <div ref={forgotButtonWrapperRef} className={styles.actionsLogin}>
          <ButtonGroup activeIndex={1} buttonWidth={forgotButtonWidthPx}>
            <button
              type="button"
              onClick={() => setStep(LoginStep.LOGIN)}
              disabled={sendingForgotPassword}
            >
              {authButtonLabel.BACK}
            </button>
            <button
              type="submit"
              disabled={sendingForgotPassword}
              aria-busy={sendingForgotPassword}
            >
              {sendingForgotPassword ? authButtonLabel.SENDING : authButtonLabel.SEND_LINK}
            </button>
          </ButtonGroup>
        </div>
      </form>
    );
  }

  if (step === LoginStep.FORGOT_PASSWORD_SENT) {
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
            {authHeading.CHECK_EMAIL}
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
            {authDescription.FORGOT_LINK_SENT_PREFIX}<strong style={{ color: "rgb(90, 90, 90)" }}>{forgotFormik.values[forgotPasswordField.EMAIL]}</strong>{authDescription.FORGOT_LINK_SENT_SUFFIX}
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
          src="/kitaab-logo.png"
          alt={authAria.KITAAB_LOGO}
        />
      </div>
      <div className={styles.fullWidthStack}>
        <Input
          required
          width="100%"
          id="login-email"
          inputType="email"
          leftIconSize={14}
          name={loginField.EMAIL}
          label={authLabel.EMAIL}
          helperText={emailHelper}
          leftIcon={<FaEnvelope />}
          ariaLabel={authAria.EMAIL}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder={authPlaceholder.EMAIL}
          value={formik.values[loginField.EMAIL]}
          iconState={getIconState(loginField.EMAIL)}
        />
        <Input
          required
          width="100%"
          id="login-password"
          leftIconSize={14}
          rightIconSize={16}
          leftIcon={<FaLock />}
          label={authLabel.PASSWORD}
          name={loginField.PASSWORD}
          onBlur={formik.handleBlur}
          helperText={passwordHelper}
          ariaLabel={authAria.PASSWORD}
          onChange={formik.handleChange}
          placeholder={authPlaceholder.PASSWORD}
          value={formik.values[loginField.PASSWORD]}
          iconState={getIconState(loginField.PASSWORD)}
          inputType={showPassword ? "text" : "password"}
          onRightIconClick={() => setShowPassword((s) => !s)}
          rightIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
        />
      </div>
      <button
        type="button"
        className={styles.linkButton}
        onClick={() => {
          forgotFormik.resetForm();
          setStep(LoginStep.FORGOT_PASSWORD);
        }}
      >
        {authLink.FORGOT_PASSWORD}
      </button>
      <div ref={loginButtonWrapperRef} className={styles.actionsLogin}>
        <ButtonGroup activeIndex={1} buttonWidth={loginButtonWidthPx}>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={submitting}
          >
            {authButtonLabel.DEMO_ACCOUNT}
          </button>
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? authButtonLabel.LOGGING_IN : authButtonLabel.LOGIN}
          </button>
        </ButtonGroup>
      </div>
      <div className={styles.separator}>
        <div className={styles.separatorLine} />
        <span>{authMisc.OR}</span>
        <div className={styles.separatorLine} />
      </div>
      <div className={styles.secondaryActions}>
        <span>{authMisc.NO_ACCOUNT}</span>
        <ButtonGroup buttonWidth={100}>
          <button
            type="button"
            data-flip
          >
            {authButtonLabel.SIGN_UP}
          </button>
        </ButtonGroup>
      </div>
    </form>
  );
}