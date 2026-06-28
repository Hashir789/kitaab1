"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import Toast from "@/components/secondary/toast/Toast";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { deedMeasurementType, toastType } from "@/constants/enums";
import { deedsButtonLabel, deedsFormMessage } from "@/constants/placeholders";
import type { DeedFormItem, DeedFormPath } from "@/interfaces/deeds";
import { useDeedItems } from "@/hooks/deeds";
import { useAppSelector } from "@/store/hooks";
import { decryptDeedItems } from "@/utils/deeds";
import {
  addChildDeedFormItem,
  createEmptyDeedFormItem,
  getItemAtPath,
  isDeedFormItemContentEmpty,
  moveDeedAtPath,
  pathToFieldKey,
  remapPathKeyAfterSiblingSwap,
  removeEmptyDeedAtPathKey,
  removeDeedAtPath,
  updateDeedFormTree,
  validateDeedFormTree,
} from "@/utils/deedForm";
import { submitDeedFormTree, resolveCreatedDeedIds } from "@/utils/deedSubmit";
import { getMasterKey, setDeedCreateSuccessPending, setPendingScaleDeed } from "@/utils/session";
import DeedItemFormSection from "./DeedItemFormSection";
import styles from "./newdeedform.module.css";

export default function NewDeedForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const deedTypeValue = useAppSelector((state) => state.ui.deedType);
  const [root, setRoot] = useState<DeedFormItem>(() =>
    createEmptyDeedFormItem(1, { categoryType: deedTypeValue })
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedPathKey, setExpandedPathKey] = useState("root");
  const { data: deedItems = [] } = useDeedItems(root.categoryType);
  const rootDisplayOrderMax = Math.max(1, deedItems.length + 1);
  const [existingRootSiblingNames, setExistingRootSiblingNames] = useState<string[]>([]);

  useEffect(() => {
    setRoot((current) => ({ ...current, categoryType: deedTypeValue }));
  }, [deedTypeValue]);

  useEffect(() => {
    setRoot((current) => ({
      ...current,
      displayOrder: rootDisplayOrderMax,
    }));
  }, [rootDisplayOrderMax]);

  useEffect(() => {
    let cancelled = false;
    const masterKey = getMasterKey();

    decryptDeedItems(deedItems, masterKey).then((decryptedItems) => {
      if (cancelled) {
        return;
      }

      setExistingRootSiblingNames(decryptedItems.map((item) => item.name));
    });

    return () => {
      cancelled = true;
    };
  }, [deedItems]);

  const handleChange = (
    path: DeedFormPath,
    updater: (current: DeedFormItem) => DeedFormItem
  ) => {
    const fieldKey = pathToFieldKey(path);
    setRoot((current) => updateDeedFormTree(current, path, updater));
    setErrors((current) => {
      const nameKey = `${fieldKey}-name`;
      const descriptionKey = `${fieldKey}-description`;

      if (!current[nameKey] && !current[descriptionKey]) {
        return current;
      }

      const next = { ...current };
      delete next[nameKey];
      delete next[descriptionKey];
      return next;
    });
  };

  const handleAddChild = (path: DeedFormPath) => {
    const prunedRoot = expandedPathKey
      ? removeEmptyDeedAtPathKey(root, expandedPathKey)
      : root;
    const parent = getItemAtPath(prunedRoot, path);
    const newChildPath = [...path, parent.children.length];

    setRoot(addChildDeedFormItem(prunedRoot, path));
    setExpandedPathKey(pathToFieldKey(newChildPath));
  };

  const handleEdit = (path: DeedFormPath) => {
    const key = pathToFieldKey(path);

    if (expandedPathKey && expandedPathKey !== key) {
      setRoot((current) => removeEmptyDeedAtPathKey(current, expandedPathKey));
    }

    setExpandedPathKey(key);
  };

  const handleDelete = (path: DeedFormPath) => {
    const key = pathToFieldKey(path);

    setRoot((current) => removeDeedAtPath(current, path));

    if (expandedPathKey === key || expandedPathKey.startsWith(`${key}-`)) {
      setExpandedPathKey(path.length > 0 ? pathToFieldKey(path.slice(0, -1)) : "root");
    }
  };

  const handleMinimize = (path: DeedFormPath) => {
    const key = pathToFieldKey(path);
    const item = getItemAtPath(root, path);

    if (isDeedFormItemContentEmpty(item) && path.length > 0) {
      setRoot((current) => removeDeedAtPath(current, path));
      setExpandedPathKey(pathToFieldKey(path.slice(0, -1)));
      return;
    }

    if (expandedPathKey === key) {
      setExpandedPathKey("");
    }
  };

  const handleMoveDeed = (path: DeedFormPath, direction: "up" | "down") => {
    const childIndex = path[path.length - 1];
    const swapIndex = direction === "up" ? childIndex - 1 : childIndex + 1;
    const parentPath = path.slice(0, -1);

    setRoot((current) => moveDeedAtPath(current, path, direction));
    setExpandedPathKey((current) =>
      remapPathKeyAfterSiblingSwap(current, parentPath, childIndex, swapIndex)
    );
  };

  const isScaleMeasurement = root.measurementType === deedMeasurementType.SCALE;
  const submitButtonWidth = 175;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors = validateDeedFormTree(root, { existingRootSiblingNames });
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
    let navigatedToScale = false;

    try {
      const response = await submitDeedFormTree(root.categoryType, root, masterKey);

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DEEDS.ITEMS(root.categoryType),
      });

      if (isScaleMeasurement) {
        const pendingScaleDeed = await resolveCreatedDeedIds(
          root.categoryType,
          root,
          response
        ).catch(() => ({
          categoryType: root.categoryType,
          displayOrder: root.displayOrder,
          ...(response?.deed_item_id ? { deedItemId: response.deed_item_id } : {}),
        }));

        setPendingScaleDeed(pendingScaleDeed);
        setDeedCreateSuccessPending();
        navigatedToScale = true;
        router.replace(`/user/${params.id}/deeds/new/scale`);
        return;
      }

      setDeedCreateSuccessPending();
      router.push(`/user/${params.id}/deeds`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : deedsFormMessage.CREATE_FAILED
      );
      setShowErrorToast(true);
    } finally {
      if (!navigatedToScale) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <DeedItemFormSection
          item={root}
          path={[]}
          displayOrderMax={rootDisplayOrderMax}
          existingRootSiblingNames={existingRootSiblingNames}
          expandedPathKey={expandedPathKey}
          errors={errors}
          onChange={handleChange}
          onAddChild={handleAddChild}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMinimize={handleMinimize}
          onMoveUp={(path) => handleMoveDeed(path, "up")}
          onMoveDown={(path) => handleMoveDeed(path, "down")}
        />

        <div className={styles.actions}>
          <ButtonGroup ariaLabel="Deed form actions" buttonWidth={submitButtonWidth}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? deedsButtonLabel.SAVING : deedsButtonLabel.SAVE_AND_CONTINUE}
            </button>
          </ButtonGroup>
        </div>
      </form>

      <Toast
        show={showErrorToast}
        type={toastType.ERROR}
        title="Could not add deed"
        message={errorMessage || deedsFormMessage.CREATE_FAILED}
        onClose={() => setShowErrorToast(false)}
      />
    </>
  );
}
