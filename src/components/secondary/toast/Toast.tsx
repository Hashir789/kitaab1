"use client";

import styles from "./toast.module.css";
import { toastType } from "@/constants/enums";
import { ToastProps } from "./toast.interface";
import { useState, useEffect, useRef, useId } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

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
      aria-atomic="true"
      data-toast-type={type}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      data-component="toast-notification"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={type === toastType.ERROR ? "alert" : "status"}
      aria-live={type === toastType.ERROR ? "assertive" : "polite"}
      className={`${styles.toast} ${isFadingOut ? styles.toastFadeOut : ""}`}
    >
      <div className={styles.toastContent}>
        <div className={styles.toastHeader}>
          {type === toastType.SUCCESS ? (
            <AiOutlineCheckCircle className={styles.successIcon} aria-hidden="true" />
          ) : type === toastType.ERROR ? (
            <AiOutlineCloseCircle className={styles.errorIcon} aria-hidden="true" />
          ) : null}
        <div id={titleId} className={styles.toastTitle}>{title}</div>
        </div>
        <div id={messageId} className={styles.toastMessage}>{message}</div>
      </div>
    </div>
  );
}
