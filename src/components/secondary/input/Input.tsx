"use client";

import styles from "./input.module.css";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import type { ChangeEvent, FocusEvent, InputHTMLAttributes, ReactNode } from "react";

type InputProps = {
  id: string;
  name: string;
  label?: string;
  value?: string;
  ariaLabel: string;
  required?: boolean;
  helperText?: string;
  placeholder: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  defaultValue?: string;
  showInfoIcon?: boolean;
  width?: string | number;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  leftIconSize?: number | string;
  rightIconSize?: number | string;
  iconState?: "error" | "success";
  widthVariant?: "default" | "waitlist";
  inputType?: "email" | "tel" | "text" | "password";
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  id,
  name,
  label,
  value,
  width,
  onBlur,
  onChange,
  ariaLabel,
  iconState,
  helperText,
  placeholder,
  defaultValue,
  required = false,
  inputType = "email",
  showInfoIcon = false,
  leftIcon,
  rightIcon,
  leftIconSize,
  rightIconSize,
  onLeftIconClick,
  onRightIconClick,
  widthVariant = "default",
}: InputProps) {
  const toSize = (size?: number | string): string | undefined => {
    if (size === undefined) return undefined;
    return typeof size === "number" ? `${size}px` : size;
  };

  const autoComplete: InputHTMLAttributes<HTMLInputElement>["autoComplete"] =
    inputType === "email"
      ? "email"
      : inputType === "tel"
      ? "tel"
      : inputType === "password"
      ? "current-password"
      : "off";
  const inputMode: InputHTMLAttributes<HTMLInputElement>["inputMode"] =
    inputType === "email" ? "email" : inputType === "tel" ? "tel" : undefined;

  const valueProps = value !== undefined ? { value, onChange } : { defaultValue };
  const widthStyle = width !== undefined ? { width } : undefined;
  const wrappedInputStyle = width !== undefined ? { width: "100%" } : undefined;
  const hasLeftAdornment = !!leftIcon;
  const hasCustomRightIcon = !!rightIcon;
  const hasValidationRightIcon = !!iconState || showInfoIcon;
  const hasRightAdornment = hasCustomRightIcon || hasValidationRightIcon;
  const hasTwoRightIcons = hasCustomRightIcon && hasValidationRightIcon;
  const resolvedIconState = iconState ?? (showInfoIcon ? "error" : undefined);
  const baseInputClassName =
    widthVariant === "waitlist" ? `${styles.input} ${styles.waitlistWidth}` : styles.input;
  const inputWithIconClassName = [
    baseInputClassName,
    hasLeftAdornment ? styles.inputWithLeftIcon : undefined,
    hasRightAdornment ? styles.inputWithRightIcon : undefined,
    hasTwoRightIcons ? styles.inputWithTwoRightIcons : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  const inputStateClassName =
    resolvedIconState === "error"
      ? `${inputWithIconClassName} ${styles.inputErrorState}`
      : inputWithIconClassName;

  if (!label && !helperText) {
    return (
      <div className={styles.inputWrapper} style={widthStyle}>
        {leftIcon ? (
          <button
            type="button"
            className={onLeftIconClick ? styles.leftIconButton : styles.leftIcon}
            aria-label="left icon"
            onClick={onLeftIconClick}
            tabIndex={onLeftIconClick ? 0 : -1}
            style={{
              width: toSize(leftIconSize),
              height: toSize(leftIconSize),
              fontSize: toSize(leftIconSize),
            }}
          >
            {leftIcon}
          </button>
        ) : null}
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
        {rightIcon ? (
          <button
            type="button"
            className={onRightIconClick ? styles.rightIconButton : styles.rightIcon}
            aria-label="right icon"
            onClick={onRightIconClick}
            tabIndex={onRightIconClick ? 0 : -1}
            style={{
              width: toSize(rightIconSize),
              height: toSize(rightIconSize),
              fontSize: toSize(rightIconSize),
            }}
          >
            {rightIcon}
          </button>
        ) : null}
        {resolvedIconState === "error" ? (
          <AiOutlineCloseCircle className={`${styles.rightIcon} ${styles.rightIconError} ${hasCustomRightIcon ? styles.rightIconShifted : ""}`} aria-hidden="true" />
        ) : resolvedIconState === "success" ? (
          <AiOutlineCheckCircle className={`${styles.rightIcon} ${styles.rightIconSuccess} ${hasCustomRightIcon ? styles.rightIconShifted : ""}`} aria-hidden="true" />
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
        {leftIcon ? (
          <button
            type="button"
            className={onLeftIconClick ? styles.leftIconButton : styles.leftIcon}
            aria-label="left icon"
            onClick={onLeftIconClick}
            tabIndex={onLeftIconClick ? 0 : -1}
            style={{
              width: toSize(leftIconSize),
              height: toSize(leftIconSize),
              fontSize: toSize(leftIconSize),
            }}
          >
            {leftIcon}
          </button>
        ) : null}
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
        {rightIcon ? (
          <button
            type="button"
            className={onRightIconClick ? styles.rightIconButton : styles.rightIcon}
            aria-label="right icon"
            onClick={onRightIconClick}
            tabIndex={onRightIconClick ? 0 : -1}
            style={{
              width: toSize(rightIconSize),
              height: toSize(rightIconSize),
              fontSize: toSize(rightIconSize),
            }}
          >
            {rightIcon}
          </button>
        ) : null}
        {resolvedIconState === "error" ? (
          <AiOutlineCloseCircle className={`${styles.rightIcon} ${styles.rightIconError} ${hasCustomRightIcon ? styles.rightIconShifted : ""}`} aria-hidden="true" />
        ) : resolvedIconState === "success" ? (
          <AiOutlineCheckCircle className={`${styles.rightIcon} ${styles.rightIconSuccess} ${hasCustomRightIcon ? styles.rightIconShifted : ""}`} aria-hidden="true" />
        ) : null}
      </div>
    </div>
  );
}
