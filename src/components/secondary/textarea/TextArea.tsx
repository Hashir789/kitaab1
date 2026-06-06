"use client";

import type { FormEvent } from "react";
import { useEffect, useRef } from "react";
import styles from "./textarea.module.css";
import type { TextAreaProps } from "./textarea.interface";
import { iconState as IconState } from "@/constants/enums";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

export default function TextArea({
  id,
  name,
  label,
  value,
  width,
  onBlur,
  onChange,
  rows = 5,
  ariaLabel,
  iconState,
  helperText,
  placeholder,
  defaultValue,
  required = false,
  showInfoIcon = false
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

  const resolvedIconState = iconState ?? (showInfoIcon ? IconState.ERROR : undefined);
  const textareaWithIconClassName = showInfoIcon
    ? `${styles.textarea} ${styles.textareaWithRightIcon}`
    : styles.textarea;
  const textareaStateClassName = resolvedIconState === IconState.ERROR ? `${textareaWithIconClassName} ${styles.textareaErrorState}`: textareaWithIconClassName;

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
        {resolvedIconState === IconState.ERROR ? (
          <AiOutlineCloseCircle
            className={`${styles.rightIconTextarea} ${styles.rightIconError}`}
            aria-hidden="true"
          />
        ) : resolvedIconState === IconState.SUCCESS ? (
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
          <span className={resolvedIconState === IconState.ERROR ? `${styles.helperText} ${styles.helperTextError}`: styles.helperText}
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
        {resolvedIconState === IconState.ERROR ? (
          <AiOutlineCloseCircle
            className={`${styles.rightIconTextarea} ${styles.rightIconError}`}
            aria-hidden="true"
          />
        ) : resolvedIconState === IconState.SUCCESS ? (
          <AiOutlineCheckCircle
            className={`${styles.rightIconTextarea} ${styles.rightIconSuccess}`}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  );
}
