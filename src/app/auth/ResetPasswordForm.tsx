"use client";

import * as Yup from "yup";
import Image from "next/image";
import { useState } from "react";
import { useFormik } from "formik";
import styles from "./loginform.module.css";
import AccountScreen from "./AccountScreen";
import { useResetPassword } from "@/hooks/auth";
import type { UserSession } from "@/interfaces/user";
import Input from "@/components/secondary/input/Input";
import { getUserSession, setUserSession } from "@/utils/session";
import { FaKey, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

interface ResetPasswordFormProps {
  token: string;
  onError?: (message: string) => void;
}

type Phase = "form" | "done";

export default function ResetPasswordForm({ token, onError }: ResetPasswordFormProps) {
  const [phase, setPhase] = useState<Phase>("form");
  const [showPassword, setShowPassword] = useState(false);
  const [accountUser, setAccountUser] = useState<UserSession | null>(null);
  const { mutate: resetUserPassword, isPending: submitting } = useResetPassword();

  const validationSchema = Yup.object({
    recovery_key: Yup.string()
      .trim()
      .matches(
        /^[A-Z2-7]{4}(-[A-Z2-7]{4}){12}$/,
        "Please enter the full recovery key in the original format"
      )
      .required("Recovery key is required"),
    new_password: Yup.string()
      .min(8, "Please enter at least 8 characters")
      .matches(/[a-z]/, "Please enter at least a lowercase")
      .matches(/[A-Z]/, "Please enter at least an uppercase")
      .matches(/[0-9]/, "Please enter at least a number")
      .matches(/[^A-Za-z0-9]/, "Please enter a special character")
      .required("Password is required"),
  });

  const formik = useFormik<{ recovery_key: string; new_password: string }>({
    initialValues: { recovery_key: "", new_password: "" },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (submitting) return;
      resetUserPassword(
        {
          token,
          recovery_key: values.recovery_key.trim().toUpperCase(),
          new_password: values.new_password,
        },
        {
          onSuccess: (data) => {
            if (data.full_name && data.email) {
              const user: UserSession = {
                full_name: data.full_name,
                email: data.email,
                gender: data.gender,
                dob: data.dob,
                two_factor_enabled: data.two_factor_enabled,
              };
              setUserSession(user);
              setAccountUser(user);
            }
            setPhase("done");
          },
          onError: (error) => onError?.(error.message),
        }
      );
    },
  });

  const showFieldError = (field: "recovery_key" | "new_password"): boolean =>
    !!formik.errors[field] &&
    (formik.submitCount > 0 || !!formik.touched[field] || !!formik.values[field]);

  const recoveryKeyHelper = showFieldError("recovery_key") ? formik.errors.recovery_key : undefined;
  const newPasswordHelper = showFieldError("new_password") ? formik.errors.new_password : undefined;

  const getIconState = (field: "recovery_key" | "new_password"): "error" | "success" | undefined => {
    if (showFieldError(field)) return "error";
    if (!formik.values[field]) return undefined;
    return "success";
  };

  if (phase === "done") {
    const user = accountUser ?? getUserSession();
    if (!user) return null;
    return <AccountScreen user={user} minHeight={457.8} />;
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
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "rgb(80, 80, 80)" }}>
          Reset your password
        </div>
        <div style={{ textAlign: "center", fontSize: 13, color: "rgb(140, 140, 140)", lineHeight: 1.4 }}>
          Enter the recovery key you saved during signup and choose a new password.
        </div>
        <div className={styles.fullWidthStack}>
          <Input
            required
            width="100%"
            inputType="text"
            name="recovery_key"
            label="Recovery key"
            id="reset-recovery-key"
            ariaLabel="Recovery key"
            placeholder="XXXX-XXXX-XXXX-..."
            leftIconSize={14}
            leftIcon={<FaKey />}
            helperText={recoveryKeyHelper}
            onBlur={formik.handleBlur}
            value={formik.values.recovery_key}
            onChange={formik.handleChange}
            iconState={getIconState("recovery_key")}
          />
          <Input
            required
            width="100%"
            name="new_password"
            label="New password"
            id="reset-new-password"
            ariaLabel="New password"
            placeholder="Pass@123"
            inputType={showPassword ? "text" : "password"}
            leftIconSize={14}
            rightIconSize={16}
            leftIcon={<FaLock />}
            helperText={newPasswordHelper}
            onBlur={formik.handleBlur}
            value={formik.values.new_password}
            onChange={formik.handleChange}
            iconState={getIconState("new_password")}
            onRightIconClick={() => setShowPassword((s) => !s)}
            rightIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
          />
        </div>
      </div>
      <div className={styles.actionsLogin}>
        <ButtonGroup activeIndex={0} buttonWidth={150}>
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? "Updating..." : "Update password"}
          </button>
        </ButtonGroup>
      </div>
    </form>
  );
}
