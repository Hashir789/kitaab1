"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import styles from "./waitlist.module.css";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import Toast from "@/components/secondary/toast/Toast";
import Input from "@/components/secondary/input/Input";
import Skeleton from "@/components/secondary/skeleton/Skeleton";

export default function WaitList() {
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  
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
            setErrorToastMessage(data.error || "Something went wrong");
            setShowErrorToast(true);
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
        setErrorToastMessage("Connectivity issue detected. Please check your internet connection and try again.");
        setShowErrorToast(true);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const helperMessage = formik.values.email && formik.errors.email
    ? formik.errors.email
    : null;

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
        <Input
          name="email"
          id="waitlist-email"
          placeholder="your@email.com"
          ariaLabel="Email address to join the Islamic Deed Tracker waitlist"
          value={formik.values.email}
          widthVariant="waitlist"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={isButtonDisabled}
        >
          {isSubmitting ? "Joining..." : "Join the Waitlist"}
        </button>
      </form>
      {helperMessage ? (
        <p
          id="waitlist-helper"
          className={`${styles.helper} ${styles.helperError}`}
          aria-live="polite"
        >
          {helperMessage}
        </p>
      ) : (
        <>
          {isLoadingCount ? (
            <Skeleton
              variant="text"
              width={245}
              height={20}
              style={{ margin: "4px 0px 0px 1rem" }}
            />
          ) : (
            <p
              id="waitlist-helper"
              className={styles.helper}
              aria-live="polite"
            >
              {(() => {
                const apiSuccess = count != null && count >= 0;
                const text = apiSuccess
                  ? `Be among the ${count} people getting new updates!`
                  : `Be among the people getting new updates!`;
                return text;
              })()}
            </p>
          )}
        </>
      )}
      <Toast
        type="success"
        show={showToast}
        title="You're on the waitlist."
        onClose={() => setShowToast(false)}
        message="We'll notify you when the app is ready."
      />
      <Toast
        type="error"
        show={showErrorToast}
        title="Connectivity issue"
        message={errorToastMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </div>
  );
}