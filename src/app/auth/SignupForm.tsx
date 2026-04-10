"use client";

import * as Yup from "yup";
import Image from "next/image";
import { useFormik } from "formik";
import styles from "./loginform.module.css";
import { useEffect, useRef, useState } from "react";
import { IoCaretDownOutline } from "react-icons/io5";
import Input from "@/components/secondary/input/Input";
import DatePicker from "@/components/secondary/datepicker/DatePicker";
import { FaUser, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

export default function SignupForm() {
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signupButtonWrapperRef = useRef<HTMLDivElement>(null);
  const [signupButtonWidthPx, setSignupButtonWidthPx] = useState<number>(150);
  const genderShellRef = useRef<HTMLDivElement | null>(null);
  const [isGenderOpen, setIsGenderOpen] = useState(false);

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
  }, []);

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
      setSubmitting(true);
      try {
        console.log("Submitting signup", { ...values });
        await new Promise((r) => setTimeout(r, 600));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const showFieldError = (field: keyof typeof formik.values): boolean =>
    !!formik.errors[field] &&
    (formik.submitCount > 0 || !!formik.touched[field] || !!(formik.values as any)[field]);

  const fullNameHelper = showFieldError("fullName") ? (formik.errors.fullName as string) : undefined;
  const emailHelper = showFieldError("email") ? formik.errors.email : undefined;
  const passwordHelper = showFieldError("password") ? (formik.errors.password as string) : undefined;
  const confirmHelper = showFieldError("confirmPassword") ? (formik.errors.confirmPassword as string) : undefined;
  const genderHelper = showFieldError("gender") ? (formik.errors.gender as string) : undefined;
  const dobHelper = showFieldError("dob") ? (formik.errors.dob as string) : undefined;

  const getIconState = (
    field: "fullName" | "email" | "password" | "confirmPassword" | "gender" | "dob"
  ): "error" | "success" | undefined => {
    if (showFieldError(field)) return "error";
    if (!(formik.values as any)[field]) return undefined;
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
              onBlur={formik.handleBlur}
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
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? "Signing up..." : step < 2 ? "Next" : "Sign up"}
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