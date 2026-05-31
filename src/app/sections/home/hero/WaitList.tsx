"use client";

import * as Yup from "yup";
import { useState } from "react";
import { useFormik } from "formik";
import styles from "./waitlist.module.css";
import Toast from "@/components/secondary/toast/Toast";
import Input from "@/components/secondary/input/Input";
import { useSubmitVisitorEmail } from "@/hooks/visitors";

export default function WaitList() {
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");
  const { mutate: submitVisitorEmail, isPending } = useSubmitVisitorEmail();

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
    onSubmit: (values, { resetForm }) => {
      submitVisitorEmail(
        { email: values.email },
        {
          onSuccess: () => {
            resetForm();
            setShowToast(true);
          },
          onError: (error) => {
            setErrorToastMessage(error.message);
            setShowErrorToast(true);
          }
        }
      );
    }
  });

  const helperMessage = formik.values.email && formik.errors.email ? formik.errors.email : null;

  const isButtonDisabled = isPending || !formik.values.email || !!formik.errors.email || !formik.isValid;

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
          {isPending ? "Joining..." : "Join the Waitlist"}
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
        <p
          id="waitlist-helper"
          className={styles.helper}
          aria-live="polite"
        >
          Be among the people getting new updates!
        </p>
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