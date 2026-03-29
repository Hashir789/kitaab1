"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import Image from "next/image";
import Input from "@/components/secondary/input/Input";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import styles from "./loginform.module.css";
import { useAppDispatch } from "@/store/hooks";
import { setMode } from "@/store/uiSlice";

export default function LoginForm() {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();

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
        console.log("Submitting login", { email: values.email });
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
          src="/kitaab-logo.png"
          alt="Kitaab logo"
          width={75}
          height={75}
          priority
        />
      </div>
      <div className={styles.fullWidthStack}>
        <Input
          id="login-email"
          name="email"
          label="Email"
          required
          placeholder="you@example.com"
          inputType="email"
          ariaLabel="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          width="100%"
          helperText={emailHelper}
          iconState={getIconState("email")}
        />
        <Input
          id="login-password"
          name="password"
          label="Password"
          required
          placeholder="Your password"
          inputType="password"
          ariaLabel="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          width="100%"
          helperText={passwordHelper}
          iconState={getIconState("password")}
        />
      </div>
      <button
        type="button"
        className={styles.linkButton}
        onClick={() => {}}
      >
        Forgot password?
      </button>
      <div className={styles.actions}>
        <ButtonGroup activeIndex={0} buttonWidth={150}>
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

