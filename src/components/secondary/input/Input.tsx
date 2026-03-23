"use client";

import styles from "./input.module.css";
import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

type InputProps = {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  placeholder: string;
  inputType?: "email" | "tel" | "text";
  value?: string;
  defaultValue?: string;
  ariaLabel: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  widthVariant?: "default" | "waitlist";
  width?: string | number;
  showInfoIcon?: boolean;
  iconState?: "error" | "success";
};

export default function Input({
  id,
  name,
  label,
  required = false,
  helperText,
  placeholder,
  inputType = "email",
  value,
  defaultValue,
  ariaLabel,
  onChange,
  onBlur,
  widthVariant = "default",
  width,
  showInfoIcon = false,
  iconState,
}: InputProps) {
  const autoComplete: InputHTMLAttributes<HTMLInputElement>["autoComplete"] =
    inputType === "email" ? "email" : inputType === "tel" ? "tel" : "off";
  const inputMode: InputHTMLAttributes<HTMLInputElement>["inputMode"] =
    inputType === "email" ? "email" : inputType === "tel" ? "tel" : undefined;

  const valueProps = value !== undefined ? { value, onChange } : { defaultValue };
  const widthStyle = width !== undefined ? { width } : undefined;
  const wrappedInputStyle = width !== undefined ? { width: "100%" } : undefined;
  const shouldShowIcon = showInfoIcon || !!iconState;
  const resolvedIconState = iconState ?? (showInfoIcon ? "error" : undefined);
  const baseInputClassName =
    widthVariant === "waitlist" ? `${styles.input} ${styles.waitlistWidth}` : styles.input;
  const inputWithIconClassName = shouldShowIcon
    ? `${baseInputClassName} ${styles.inputWithRightIcon}`
    : baseInputClassName;
  const inputStateClassName =
    resolvedIconState === "error"
      ? `${inputWithIconClassName} ${styles.inputErrorState}`
      : inputWithIconClassName;

  if (!label && !helperText) {
    return (
      <div className={styles.inputWrapper} style={widthStyle}>
        <input
          type={inputType}
          name={name}
          id={id}
          required={required}
          placeholder={placeholder}
          className={inputStateClassName}
          style={wrappedInputStyle}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-label={ariaLabel}
          {...valueProps}
          onBlur={onBlur}
        />
        {resolvedIconState === "error" ? (
          <AiOutlineCloseCircle className={`${styles.rightIcon} ${styles.rightIconError}`} aria-hidden="true" />
        ) : resolvedIconState === "success" ? (
          <AiOutlineCheckCircle className={`${styles.rightIcon} ${styles.rightIconSuccess}`} aria-hidden="true" />
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.field} style={widthStyle}>
      <div className={styles.topRow}>
        {label ? (
          <label htmlFor={id} className={styles.label}>
            {label}
            {required ? <span className={styles.requiredMark}>*</span> : null}
          </label>
        ) : (
          <span aria-hidden="true" />
        )}
        {helperText ? (
          <span
            className={
              resolvedIconState === "error"
                ? `${styles.helperText} ${styles.helperTextError}`
                : styles.helperText
            }
          >
            {helperText}
          </span>
        ) : null}
      </div>
      <div className={styles.inputWrapper}>
        <input
          type={inputType}
          name={name}
          id={id}
          required={required}
          placeholder={placeholder}
          className={inputStateClassName}
          style={wrappedInputStyle}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-label={ariaLabel}
          {...valueProps}
          onBlur={onBlur}
        />
        {resolvedIconState === "error" ? (
          <AiOutlineCloseCircle className={`${styles.rightIcon} ${styles.rightIconError}`} aria-hidden="true" />
        ) : resolvedIconState === "success" ? (
          <AiOutlineCheckCircle className={`${styles.rightIcon} ${styles.rightIconSuccess}`} aria-hidden="true" />
        ) : null}
      </div>
    </div>
  );
}
