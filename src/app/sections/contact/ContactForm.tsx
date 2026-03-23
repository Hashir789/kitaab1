"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import styles from "./contactform.module.css";
import { useState, type FormEvent } from "react";
import Input from "@/components/secondary/input/Input";
import TextArea from "@/components/secondary/textarea/TextArea";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import Toast from "@/components/secondary/toast/Toast";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FieldConfig = {
  name: keyof ContactFormValues;
  label: string;
  placeholder: string;
  type: "text" | "tel" | "textarea";
  required?: boolean;
};

const fieldConfig: FieldConfig[] = [
  { name: "name", label: "Name", placeholder: "Your name", type: "text", required: true },
  { name: "email", label: "Email", placeholder: "your@email.com", type: "text", required: true },
  { name: "phone", label: "Phone", placeholder: "Your phone number", type: "tel" },
  { name: "subject", label: "Subject", placeholder: "Subject", type: "text", required: true },
  { name: "message", label: "Message", placeholder: "Write your message", type: "textarea", required: true },
];

export default function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("Please check your input.");

  const validationSchema = Yup.object({
    name: Yup.string().trim().min(2, "Name must be at least 2 characters").required("Name is required"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9]([a-zA-Z0-9.]*[a-zA-Z0-9])?@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,}$/,
        "Please enter a valid email address"
      )
      .required("Email is required"),
    phone: Yup.string().test(
      "phone-format",
      "Please enter a valid phone number",
      (value) => !value || /^[0-9+\-\s()]{7,20}$/.test(value)
    ),
    subject: Yup.string().trim().min(3, "Subject must be at least 3 characters").required("Subject is required"),
    message: Yup.string().trim().min(10, "Message must be at least 10 characters").required("Message is required"),
  });

  const formik = useFormik<ContactFormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      if (status === "submitting") {
        return;
      }
      setStatus("submitting");

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          setStatus("error");
          setErrorToastMessage(data?.error ?? "Failed to send message.");
          setShowErrorToast(true);
          return;
        }

        setStatus("success");
        setShowSuccessToast(true);
        resetForm();
      } catch {
        setStatus("error");
        setErrorToastMessage("Failed to send message.");
        setShowErrorToast(true);
      }
    },
  });

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = await formik.validateForm();
    const firstErrorField = fieldConfig.find((field) => !!errors[field.name]);

    if (firstErrorField) {
      const touchedState = fieldConfig.reduce((acc, field) => {
        acc[field.name] = true;
        return acc;
      }, {} as Record<keyof ContactFormValues, boolean>);
      formik.setTouched(touchedState, true);
      setStatus("error");
      const rawMessage = (errors[firstErrorField.name] as string) || "Invalid value";
      const normalizedMessage = rawMessage.charAt(0).toUpperCase() + rawMessage.slice(1);
      setErrorToastMessage(`${firstErrorField.label} in contact form: ${normalizedMessage}`);
      setShowErrorToast(true);
      return;
    }

    await formik.submitForm();
  };

  const showFieldError = (field: keyof ContactFormValues): boolean =>
    !!formik.errors[field] &&
    (formik.submitCount > 0 || !!formik.touched[field] || !!formik.values[field]);

  const helperMessages: Partial<Record<keyof ContactFormValues, string>> =
    Object.keys(formik.values).reduce((acc, key) => {
      const field = key as keyof ContactFormValues;
      acc[field] = showFieldError(field) ? formik.errors[field] : undefined;
      return acc;
    }, {} as Partial<Record<keyof ContactFormValues, string>>);

  const getIconState = (field: keyof ContactFormValues): "error" | "success" | undefined => {
    if (showFieldError(field)) return "error";
    if (!formik.values[field]) return undefined;
    return "success";
  };

  const renderField = (field: FieldConfig) => {
    const commonProps = {
      name: field.name,
      id: `contact-${field.name}`,
      required: field.required,
      placeholder: field.placeholder,
      ariaLabel: field.label,
      label: field.label,
      helperText: helperMessages[field.name],
      value: formik.values[field.name],
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      width: "100%" as const,
      iconState: getIconState(field.name),
    };

    if (field.type === "textarea") {
      return <TextArea key={field.name} {...commonProps} rows={5} />;
    }

    return <Input key={field.name} {...commonProps} inputType={field.type} />;
  };

  return (
    <form className={styles.form} onSubmit={handleFormSubmit} noValidate>
      <div className={styles.nameEmailRow}>
        {fieldConfig.slice(0, 2).map((field) => renderField(field))}
      </div>

      <div className={styles.fullWidthStack}>
        {fieldConfig.slice(2).map((field) => renderField(field))}
      </div>

      <div className={styles.actions}>
        <ButtonGroup activeIndex={0} buttonWidth={150}>
          <button
            type="submit"
            disabled={status === "submitting"}
            aria-busy={status === "submitting"}
          >
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>
        </ButtonGroup>
      </div>
      <Toast
        show={showErrorToast}
        type="error"
        title="Invalid data"
        message={errorToastMessage}
        onClose={() => setShowErrorToast(false)}
      />
      <Toast
        show={showSuccessToast}
        type="success"
        title="Message sent"
        message="Your message has been sent successfully."
        onClose={() => setShowSuccessToast(false)}
      />
    </form>
  );
}
