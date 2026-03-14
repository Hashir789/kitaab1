"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import styles from "./waitlist.module.css";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import Toast from "../../secondary/toast/Toast";
import Skeleton from "../../secondary/skeleton/Skeleton";

export default function WaitList() {
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const isBelow880 = useAppSelector((state) => state.ui.isBelow880);
  const isBelow710 = useAppSelector((state) => state.ui.isBelow710);
  const [helperMessage, setHelperMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/waitlist");
        if (response.ok) {
          const data = await response.json();
          if (data.count !== undefined) {
            setCount(data.count);
          }
        }
      } catch (error) {

      } finally {
        setIsLoadingCount(false);
      }
    };
    fetchCount();
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9]([a-zA-Z0-9.]*[a-zA-Z0-9])?@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,}$/,
        "Please enter a valid email address"
      )
      .required("Email is required"),
  });

  const formik = useFormik<{ email: string }>({
    initialValues: {
      email: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setFieldError, resetForm }) => {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error === "This email is already registered") {
            
            resetForm();
            if (data.count !== undefined) {
              setCount(data.count);
            }
            setShowToast(true);
          } else {
            setFieldError("email", data.error || "Something went wrong");
            if (data.count !== undefined) {
              setCount(data.count);
            }
          }
          setIsSubmitting(false);
          return;
        }

        resetForm();
        if (data.count !== undefined) {
          setCount(data.count);
        }
        setShowToast(true);
      } catch (error) {
        setFieldError("email", "Failed to submit. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      
      if (formik.values.email && formik.errors.email) {
        setHelperMessage(formik.errors.email);
      } else {
        setHelperMessage(null);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formik.values.email, formik.errors.email]);

  const isButtonDisabled = 
    isSubmitting || 
    !formik.values.email || 
    !!formik.errors.email ||
    !formik.isValid;

  return (
    <div
      className={styles.waitlistContainer}
          aria-label="Join the Islamic Deed Tracker email waitlist"
      itemScope
      itemType="https://schema.org/SubscribeAction"
    >
      <meta
        itemProp="name"
        content="Join the Islamic Deed Tracker waitlist"
      />
      <meta
        itemProp="description"
        content="Sign up with your email to join the Islamic Deed Tracker waitlist and be notified when the Islamic self‑accountability app for tracking Hasanaat and Sayyi'at is ready."
      />
      <form
        onSubmit={formik.handleSubmit}
        className={styles.waitlist}
        aria-describedby="waitlist-helper"
      >
        <input
          type="email"
          name="email"
          id="waitlist-email"
          placeholder="your@email.com"
          className={styles.input}
          autoComplete="email"
          inputMode="email"
          aria-label="Email address to join the Islamic Deed Tracker waitlist"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={isButtonDisabled}
        >
          {isSubmitting
            ? "Joining..."
            : isBelow710
            ? "Join the Waitlist"
            : isBelow880
            ? "Join"
            : "Join the Waitlist"}
        </button>
      </form>
      {helperMessage ? (
        <p
          id="waitlist-helper"
          className={styles.helper}
          aria-live="polite"
        >
          {helperMessage}
        </p>
      ) : (
        <>
          {isLoadingCount ? (
            <Skeleton
              variant="text"
              width={!isBelow880 || isBelow710 ? 210 : 150}
              height={20}
              style={{ margin: "4px 0px 0px 1rem" }}
            />
          ) : count != null && count > 0 ? (
            <p
              id="waitlist-helper"
              className={styles.helper}
              aria-live="polite"
            >
              {isBelow710 || !isBelow880
                ? `${count} people have joined the waitlist so far`
                : `${count} people have joined`}
            </p>
          ) : (
            <p
              id="waitlist-helper"
              className={styles.helper}
              aria-live="polite"
            >
              {isBelow710 || !isBelow880
                ? "A few people have joined the waitlist so far"
                : "A few people have joined"}
            </p>
          )}
        </>
      )}
      <Toast
        show={showToast}
        type="success"
        title="You're on the waitlist."
        message="We'll notify you when the app is ready."
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}