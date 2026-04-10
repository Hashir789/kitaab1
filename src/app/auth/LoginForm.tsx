"use client";

import * as Yup from "yup";
import Image from "next/image";
import { useFormik } from "formik";
import styles from "./loginform.module.css";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useRef, useState } from "react";
import Input from "@/components/secondary/input/Input";
import { FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

export default function LoginForm() {
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const loginButtonWrapperRef = useRef<HTMLDivElement>(null);
  const [loginButtonWidthPx, setLoginButtonWidthPx] = useState<number>(150);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const updateWidth = () => {
      const el = loginButtonWrapperRef.current;
      if (!el) return;
      const wrapperWidth = el.offsetWidth;
      
      const computed = Math.max(50, Math.floor(wrapperWidth * 0.5));
      setLoginButtonWidthPx(computed);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

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
    onSubmit: async (values) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        console.log("Submitting login", { email: values.email, password: values.password });
        await new Promise((r) => setTimeout(r, 600));
      } finally {
        console.log("Login submit finished");
        setSubmitting(false);
      }
    },
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

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
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