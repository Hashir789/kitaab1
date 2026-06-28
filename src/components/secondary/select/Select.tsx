"use client";

import { useEffect, useRef, useState } from "react";
import { IoCaretDownOutline } from "react-icons/io5";
import { iconState as IconState } from "@/constants/enums";
import styles from "./select.module.css";
import type { SelectProps } from "./select.interface";

export default function Select({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
  ariaLabel,
  required = false,
  helperText,
  iconState,
  width = "100%",
  dropdownVariant = "default",
}: SelectProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const hasError = iconState === IconState.ERROR;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!shellRef.current) return;
      if (shellRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div className={styles.field} style={{ width }}>
      <div className={styles.topRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {required ? <span className={styles.requiredMark}>*</span> : null}
        </label>
        {helperText ? (
          <span className={hasError ? `${styles.helperText} ${styles.helperTextError}` : styles.helperText}>
            {helperText}
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>

      <div className={styles.shell} ref={shellRef}>
        <button
          id={id}
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`${styles.trigger} ${hasError ? styles.triggerError : ""}`}
          onClick={() => setOpen((current) => !current)}
        >
          <span className={selectedOption ? undefined : styles.placeholder}>
            {selectedOption?.label ?? placeholder}
          </span>
          <IoCaretDownOutline
            size={12}
            aria-hidden="true"
            className={`${styles.caretIcon} ${open ? styles.caretIconRotated : ""}`}
          />
        </button>

        {open ? (
          <div
            className={`${styles.dropdown} ${dropdownVariant === "white" ? styles.dropdownWhite : ""}`.trim()}
            role="listbox"
            aria-label={ariaLabel}
          >
            {options.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={`${styles.dropdownItem} ${dropdownVariant === "white" ? styles.dropdownItemWhite : ""}`.trim()}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
