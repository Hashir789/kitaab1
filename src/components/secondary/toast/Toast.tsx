"use client";

import styles from "./Toast.module.css";
import { useState, useEffect, useRef, useId } from "react";

type ToastType = "success" | "error";

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ show, type, title, message, onClose }: ToastProps) {
  const toastId = useId();
  const titleId = `${toastId}-title`;
  const messageId = `${toastId}-message`;
  const [isFadingOut, setIsFadingOut] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeOutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = () => {
    setIsFadingOut(true);
    if (fadeOutTimeoutRef.current) {
      clearTimeout(fadeOutTimeoutRef.current);
    }
    fadeOutTimeoutRef.current = setTimeout(() => {
      setIsFadingOut(false);
      onClose();
      fadeOutTimeoutRef.current = null;
    }, 300);
  };

  useEffect(() => {
    if (show) {
      setIsFadingOut(false);
      
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      
      toastTimeoutRef.current = setTimeout(() => {
        handleClose();
        toastTimeoutRef.current = null;
      }, 3000);
    }

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      if (fadeOutTimeoutRef.current) {
        clearTimeout(fadeOutTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleMouseEnter = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (show && !isFadingOut) {
      toastTimeoutRef.current = setTimeout(() => {
        handleClose();
        toastTimeoutRef.current = null;
      }, 3000);
    }
  };

  if (!show && !isFadingOut) return null;

  return (
    <div
      id={toastId}
      className={`${styles.toast} ${isFadingOut ? styles.toastFadeOut : ""} ${
        type === "success" ? styles.toastSuccess : ""
      }`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      data-toast-type={type}
      data-component="toast-notification"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.toastContent}>
        <div id={titleId} className={styles.toastTitle}>{title}</div>
        <div id={messageId} className={styles.toastMessage}>{message}</div>
      </div>
    </div>
  );
}
