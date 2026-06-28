"use client";

import { useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import Toast from "@/components/secondary/toast/Toast";
import DeedCircleAddButton from "@/components/secondary/deedaddfab/DeedCircleAddButton";
import { createScaleItems } from "@/apis/scales";
import { toastType } from "@/constants/enums";
import { deedsButtonLabel, deedsFormMessage, scaleLabel } from "@/constants/placeholders";
import type { ScaleFormItem } from "@/interfaces/scales";
import {
  buildEncryptedScaleItemsPayload,
  createEmptyScaleFormItem,
  validateScaleFormItems,
} from "@/utils/scaleForm";
import { resolveScaleDeedItemId } from "@/utils/deedSubmit";
import {
  clearPendingScaleDeed,
  getMasterKey,
  getPendingScaleDeed,
  setDeedCreateSuccessPending,
} from "@/utils/session";
import ScaleItemFormSection from "./ScaleItemFormSection";
import styles from "../newdeedform.module.css";

export default function NewScaleForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const pendingScaleDeed = getPendingScaleDeed();
  const [items, setItems] = useState<ScaleFormItem[]>(() => [createEmptyScaleFormItem(1)]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!pendingScaleDeed) {
    return null;
  }

  const handleChange = (index: number, updater: (current: ScaleFormItem) => ScaleFormItem) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? updater(item) : item)));
    setErrors((current) => {
      const nameKey = `${index}-name`;
      const descriptionKey = `${index}-description`;

      if (!current[nameKey] && !current[descriptionKey]) {
        return current;
      }

      const next = { ...current };
      delete next[nameKey];
      delete next[descriptionKey];
      return next;
    });
  };

  const handleAddItem = () => {
    setItems((current) => [...current, createEmptyScaleFormItem(current.length + 1)]);
    setExpandedIndex(items.length);
  };

  const handleEdit = (index: number) => {
    setExpandedIndex(index);
  };

  const handleDelete = (index: number) => {
    setItems((current) => {
      if (current.length <= 1) {
        return current;
      }

      return current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({ ...item, displayOrder: itemIndex + 1 }));
    });

    setExpandedIndex((current) => {
      if (current === index) {
        return Math.max(0, index - 1);
      }

      if (current > index) {
        return current - 1;
      }

      return current;
    });
  };

  const handleMinimize = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(-1);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors = validateScaleFormItems(items);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const masterKey = getMasterKey();
    if (!masterKey) {
      setErrorMessage(deedsFormMessage.MASTER_KEY_MISSING);
      setShowErrorToast(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const deedItemId = await resolveScaleDeedItemId(pendingScaleDeed);
      await createScaleItems(deedItemId, {
        items: await buildEncryptedScaleItemsPayload(items, masterKey),
      });
      clearPendingScaleDeed();
      setDeedCreateSuccessPending();
      router.push(`/user/${params.id}/deeds`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : deedsFormMessage.SCALE_CREATE_FAILED
      );
      setShowErrorToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {items.map((item, index) => (
          <ScaleItemFormSection
            key={item.id}
            item={item}
            index={index}
            itemCount={items.length}
            siblings={items}
            expandedIndex={expandedIndex}
            errors={errors}
            onChange={handleChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMinimize={handleMinimize}
          />
        ))}

        <div className={styles.addSubDeedRow}>
          <span className={styles.fieldLabel}>{scaleLabel.ADD_SCALE_ITEM_QUESTION}</span>
          <DeedCircleAddButton
            ariaLabel={scaleLabel.ADD_SCALE_ITEM_QUESTION}
            tooltip={scaleLabel.ADD_SCALE_ITEM_QUESTION}
            onClick={handleAddItem}
          />
        </div>

        <div className={styles.actions}>
          <ButtonGroup ariaLabel="Scale form actions" buttonWidth={130}>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? deedsButtonLabel.SUBMITTING : deedsButtonLabel.SUBMIT}
            </button>
          </ButtonGroup>
        </div>
      </form>

      <Toast
        show={showErrorToast}
        type={toastType.ERROR}
        title="Could not add scale items"
        message={errorMessage || deedsFormMessage.SCALE_CREATE_FAILED}
        onClose={() => setShowErrorToast(false)}
      />
    </>
  );
}
