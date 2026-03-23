"use client";

import styles from "./textarea.module.css";
import { useEffect, useRef } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

type TextAreaProps = {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  placeholder: string;
  value?: string;
  defaultValue?: string;
  ariaLabel: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  width?: string | number;
  showInfoIcon?: boolean;
  iconState?: "error" | "success";
  rows?: number;
};

export default function TextArea({
  id,
  name,
  label,
  required = false,
  helperText,
  placeholder,
  value,
  defaultValue,
  ariaLabel,
  onChange,
  onBlur,
  width,
  showInfoIcon = false,
  iconState,
  rows = 5,
}: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleAutoResize = (e: FormEvent<HTMLTextAreaElement>) => {
    adjustHeight(e.currentTarget);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      adjustHeight(textAreaRef.current);
    }
  }, [value, defaultValue]);

  const valueProps = value !== undefined ? { value, onChange } : { defaultValue };
  const widthStyle = width !== undefined ? { width } : undefined;
  const wrappedInputStyle = width !== undefined ? { width: "100%" } : undefined;

  const resolvedIconState = iconState ?? (showInfoIcon ? "error" : undefined);
  const textareaWithIconClassName = showInfoIcon
    ? `${styles.textarea} ${styles.textareaWithRightIcon}`
    : styles.textarea;
  const textareaStateClassName =
    resolvedIconState === "error"
      ? `${textareaWithIconClassName} ${styles.textareaErrorState}`
      : textareaWithIconClassName;

  if (!label && !helperText) {
    return (
      <div className={styles.inputWrapper} style={widthStyle}>
        <textarea
          ref={textAreaRef}
          name={name}
          id={id}
          required={required}
          placeholder={placeholder}
          className={textareaStateClassName}
          style={wrappedInputStyle}
          aria-label={ariaLabel}
          rows={rows}
          {...valueProps}
          onInput={handleAutoResize}
          onBlur={onBlur}
        />
        {resolvedIconState === "error" ? (
          <AiOutlineCloseCircle
            className={`${styles.rightIconTextarea} ${styles.rightIconError}`}
            aria-hidden="true"
          />
        ) : resolvedIconState === "success" ? (
          <AiOutlineCheckCircle
            className={`${styles.rightIconTextarea} ${styles.rightIconSuccess}`}
            aria-hidden="true"
          />
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
        <textarea
          ref={textAreaRef}
          name={name}
          id={id}
          required={required}
          placeholder={placeholder}
          className={textareaStateClassName}
          style={wrappedInputStyle}
          aria-label={ariaLabel}
          rows={rows}
          {...valueProps}
          onInput={handleAutoResize}
          onBlur={onBlur}
        />
        {resolvedIconState === "error" ? (
          <AiOutlineCloseCircle
            className={`${styles.rightIconTextarea} ${styles.rightIconError}`}
            aria-hidden="true"
          />
        ) : resolvedIconState === "success" ? (
          <AiOutlineCheckCircle
            className={`${styles.rightIconTextarea} ${styles.rightIconSuccess}`}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  );
}
