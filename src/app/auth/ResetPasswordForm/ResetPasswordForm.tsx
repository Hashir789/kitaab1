"use client";

import * as Yup from "yup";
import Image from "next/image";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useResetPassword } from "@/hooks/auth";
import { useState, type ChangeEvent } from "react";
import styles from "./resetpasswordform.module.css";
import Input from "@/components/secondary/input/Input";
import Loader from "@/components/secondary/loader/Loader";
import { FaKey, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import type { ResetPasswordFormProps } from "./resetpasswordform.interface";
import { iconState as IconState, resetPasswordField } from "@/constants/enums";
import { authAria, authButtonLabel, authDescription, authHeading, authLabel, authPlaceholder, authValidation } from "@/constants/placeholders";

export default function ResetPasswordForm({ token, onError }: ResetPasswordFormProps) {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: resetUserPassword, isPending: submitting } = useResetPassword();

  const validationSchema = Yup.object({
    [resetPasswordField.RECOVERY_KEY]: Yup.string()
      .trim()
      .matches(
        /^[A-Z2-7]{4}(-[A-Z2-7]{4}){12}$/,
        authValidation.RECOVERY_KEY_INVALID
      )
      .required(authValidation.RECOVERY_KEY_REQUIRED),
    [resetPasswordField.NEW_PASSWORD]: Yup.string()
      .min(8, authValidation.PASSWORD_MIN_8)
      .matches(/[a-z]/, authValidation.PASSWORD_LOWERCASE)
      .matches(/[A-Z]/, authValidation.PASSWORD_UPPERCASE)
      .matches(/[0-9]/, authValidation.PASSWORD_NUMBER)
      .matches(/[^A-Za-z0-9]/, authValidation.PASSWORD_SPECIAL)
      .required(authValidation.PASSWORD_REQUIRED),
  });

  const formik = useFormik<Record<resetPasswordField, string>>({
    initialValues: {
      [resetPasswordField.RECOVERY_KEY]: "",
      [resetPasswordField.NEW_PASSWORD]: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (submitting || redirecting) return;
      resetUserPassword(
        {
          token,
          recovery_key: values[resetPasswordField.RECOVERY_KEY].trim().toUpperCase(),
          new_password: values[resetPasswordField.NEW_PASSWORD],
        },
        {
          onSuccess: () => {
            setRedirecting(true);
            window.setTimeout(() => router.replace("/auth"), 1000);
          },
          onError: (error) => onError?.(error.message)
        }
      );
    },
  });

  const formatRecoveryKey = (raw: string): string => {
    const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 52);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join("-") : "";
  };

  const handleRecoveryKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(resetPasswordField.RECOVERY_KEY, formatRecoveryKey(e.target.value));
  };

  const showFieldError = (field: resetPasswordField): boolean =>
    !!formik.errors[field] &&
    (formik.submitCount > 0 || !!formik.touched[field] || !!formik.values[field]);

  const recoveryKeyHelper = showFieldError(resetPasswordField.RECOVERY_KEY)
    ? formik.errors[resetPasswordField.RECOVERY_KEY]
    : undefined;
  const newPasswordHelper = showFieldError(resetPasswordField.NEW_PASSWORD)
    ? formik.errors[resetPasswordField.NEW_PASSWORD]
    : undefined;

  const getIconState = (field: resetPasswordField): IconState | undefined => {
    if (showFieldError(field)) return IconState.ERROR;
    if (!formik.values[field]) return undefined;
    return IconState.SUCCESS;
  };

  if (redirecting) {
    return (
      <div className={styles.form} style={{ minHeight: 457.8 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Image
            priority
            width={75}
            height={75}
            src="/kitaab-logo.png"
            alt={authAria.KITAAB_LOGO}
          />
        </div>
        <Loader className={styles.loader} helperText={authDescription.RESET_REDIRECTING} />
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={formik.handleSubmit}
      style={{ minHeight: 457.8 }}
      noValidate
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
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "rgb(80, 80, 80)" }}>
          {authHeading.RESET_PASSWORD}
        </div>
        <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
          {authDescription.RESET_PASSWORD}
        </div>
        <div className={styles.fullWidthStack}>
          <Input
            required
            width="100%"
            inputType="text"
            leftIconSize={14}
            leftIcon={<FaKey />}
            id="reset-recovery-key"
            onBlur={formik.handleBlur}
            label={authLabel.RECOVERY_KEY}
            helperText={recoveryKeyHelper}
            ariaLabel={authAria.RECOVERY_KEY}
            onChange={handleRecoveryKeyChange}
            name={resetPasswordField.RECOVERY_KEY}
            placeholder={authPlaceholder.RECOVERY_KEY}
            value={formik.values[resetPasswordField.RECOVERY_KEY]}
            iconState={getIconState(resetPasswordField.RECOVERY_KEY)}
          />
          <Input
            required
            width="100%"
            leftIconSize={14}
            rightIconSize={16}
            leftIcon={<FaLock />}
            id="reset-new-password"
            onBlur={formik.handleBlur}
            label={authLabel.NEW_PASSWORD}
            onChange={formik.handleChange}
            helperText={newPasswordHelper}
            ariaLabel={authAria.NEW_PASSWORD}
            placeholder={authPlaceholder.PASSWORD}
            name={resetPasswordField.NEW_PASSWORD}
            inputType={showPassword ? "text" : "password"}
            onRightIconClick={() => setShowPassword((s) => !s)}
            rightIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
            value={formik.values[resetPasswordField.NEW_PASSWORD]}
            iconState={getIconState(resetPasswordField.NEW_PASSWORD)}
          />
        </div>
      </div>
      <div className={styles.actionsLogin}>
        <ButtonGroup activeIndex={0} buttonWidth={150}>
          <button
            type="submit"
            disabled={submitting || redirecting}
            aria-busy={submitting || redirecting}
          >
            {submitting ? authButtonLabel.UPDATING : authButtonLabel.UPDATE_PASSWORD}
          </button>
        </ButtonGroup>
      </div>
    </form>
  );
}