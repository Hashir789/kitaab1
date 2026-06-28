"use client";

import { useEffect, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import styles from "./confirmmodal.module.css";
import type { ConfirmModalProps } from "./confirmmodal.interface";

const overlayMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const dialogMotion = {
  initial: { opacity: 0, y: -48 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -48 },
};

export default function ConfirmModal({
  open,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  isConfirming = false,
  ariaLabel = "Confirmation dialog",
}: ConfirmModalProps) {
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="confirm-modal-overlay"
          className={styles.overlay}
          onClick={onCancel}
          {...overlayMotion}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            aria-labelledby={titleId}
            aria-describedby={messageId}
            className={styles.dialog}
            onClick={(event) => event.stopPropagation()}
            {...dialogMotion}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              <ButtonGroup
                className={styles.closeButtonGroup}
                ariaLabel="Close dialog"
                buttonWidth={32}
                buttonHeight={32}
                gap={0}
                padding={4}
                activeIndex={-1}
              >
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isConfirming}
                  aria-label="Close dialog"
                >
                  <IoClose aria-hidden="true" />
                </button>
              </ButtonGroup>
            </div>

            <p id={messageId} className={styles.message}>
              {message}
            </p>

            <div className={styles.actions}>
              <ButtonGroup activeIndex={1} ariaLabel="Dialog actions" buttonWidth={132}>
                <button type="button" onClick={onCancel} disabled={isConfirming}>
                  {cancelLabel}
                </button>
                <button type="button" onClick={onConfirm} disabled={isConfirming}>
                  {confirmLabel}
                </button>
              </ButtonGroup>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
