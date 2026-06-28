"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import DeedItemsTableSkeleton from "@/components/secondary/deeditemstable/DeedItemsTableSkeleton";
import ConfirmModal from "@/components/secondary/confirmmodal/ConfirmModal";
import Toast from "@/components/secondary/toast/Toast";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import { useDeedItem, useDeedItems, useDeleteDeedItem } from "@/hooks/deeds";
import { useScaleItems } from "@/hooks/scales";
import type { DecryptedDeedItem, DeedFormPath } from "@/interfaces/deeds";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getMasterKey } from "@/utils/session";
import { decryptDeedItem, decryptDeedItems, formatDeedMeasurementType, resolveDeedMeasurementType } from "@/utils/deeds";
import { useAppSelector } from "@/store/hooks";
import { toastType } from "@/constants/enums";
import {
  deedsFormMessage,
  deedsButtonLabel,
  deedsMessage,
  deedsToast,
} from "@/constants/placeholders";
import { pathToFieldKey, remapPathKeyAfterSiblingSwap } from "@/utils/deedForm";
import { validateDeedDetailTree } from "@/utils/deedFormValidation";
import { submitDeedDetailTree } from "@/utils/deedSubmit";
import {
  addChildDeedDetailAtPath,
  cloneDeedDetailTree,
  getDeedDetailItemAtPath,
  isDeedDetailTreeDirty,
  isUnsavedDeedDetailItem,
  moveDeedDetailAtPath,
  removeDeedDetailAtPath,
  sortDeedDetailTree,
  updateDeedDetailTree,
} from "@/utils/deedDetail";
import DeedDetailSection from "./DeedDetailSection";
import styles from "./deeddetail.module.css";

export default function DeedDetail() {
  const queryClient = useQueryClient();
  const params = useParams<{ deedItemId: string }>();
  const activeDeedType = useAppSelector((state) => state.ui.deedType);
  const { item, isLoading, isError } = useDeedItem(activeDeedType, params.deedItemId);
  const { data: scaleItems = [] } = useScaleItems(params.deedItemId);
  const { data: deedItems = [] } = useDeedItems(activeDeedType);
  const { mutate: deleteDeed, isPending: isDeleting } = useDeleteDeedItem(activeDeedType);
  const [deed, setDeed] = useState<DecryptedDeedItem | null>(null);
  const [savedDeed, setSavedDeed] = useState<DecryptedDeedItem | null>(null);
  const [existingRootSiblingNames, setExistingRootSiblingNames] = useState<string[]>([]);
  const [decrypting, setDecrypting] = useState(false);
  const [expandedPathKey, setExpandedPathKey] = useState("root");
  const [editingPathKey, setEditingPathKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pathToDelete, setPathToDelete] = useState<DeedFormPath | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isDirty = useMemo(
    () => (deed && savedDeed ? isDeedDetailTreeDirty(deed, savedDeed) : false),
    [deed, savedDeed]
  );
  const isParentDeed = deed?.parent_deed_item_id === null;
  const measurementTypeLabel = useMemo(() => {
    if (!deed) {
      return "";
    }

    const resolvedType = resolveDeedMeasurementType(deed.measurement_type, scaleItems.length > 0);
    return formatDeedMeasurementType(resolvedType);
  }, [deed, scaleItems.length]);

  useEffect(() => {
    if (!item) {
      setDeed(null);
      setSavedDeed(null);
      return;
    }

    let cancelled = false;
    setDecrypting(true);

    decryptDeedItem(item, getMasterKey())
      .then((decrypted) => {
        if (!cancelled) {
          const sorted = sortDeedDetailTree(decrypted);
          setDeed(sorted);
          setSavedDeed(cloneDeedDetailTree(sorted));
          setExpandedPathKey("root");
          setEditingPathKey("");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDecrypting(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [item]);

  useEffect(() => {
    let cancelled = false;

    decryptDeedItems(deedItems, getMasterKey()).then((decryptedItems) => {
      if (cancelled) {
        return;
      }

      setExistingRootSiblingNames(
        decryptedItems
          .filter((entry) => entry.deed_item_id !== params.deedItemId)
          .map((entry) => entry.name)
      );
    });

    return () => {
      cancelled = true;
    };
  }, [deedItems, params.deedItemId]);

  const handleEdit = (path: DeedFormPath) => {
    const key = pathToFieldKey(path);
    setExpandedPathKey(key);
    setEditingPathKey(key);
  };

  const handleMinimize = (path: DeedFormPath) => {
    const key = pathToFieldKey(path);

    if (expandedPathKey === key) {
      setExpandedPathKey("");
      setEditingPathKey("");
    }
  };

  const handleSave = async () => {
    if (!deed || !savedDeed || !isDirty || isSaving) {
      return;
    }

    const validationError = validateDeedDetailTree(deed, existingRootSiblingNames);
    if (validationError) {
      setErrorTitle(deedsToast.UPDATE_FAILED_TITLE);
      setErrorMessage(validationError);
      setShowErrorToast(true);
      return;
    }

    const masterKey = getMasterKey();
    if (!masterKey) {
      setErrorTitle(deedsToast.UPDATE_FAILED_TITLE);
      setErrorMessage(deedsFormMessage.MASTER_KEY_MISSING);
      setShowErrorToast(true);
      return;
    }

    setIsSaving(true);

    try {
      const persistedDeed = await submitDeedDetailTree(
        activeDeedType,
        deed,
        savedDeed,
        masterKey
      );
      const sorted = sortDeedDetailTree(persistedDeed);

      setDeed(sorted);
      setSavedDeed(cloneDeedDetailTree(sorted));
      setExpandedPathKey("");
      setEditingPathKey("");
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEEDS.ITEMS(activeDeedType) });
      setSuccessTitle(deedsToast.UPDATE_SUCCESS_TITLE);
      setSuccessMessage(deedsToast.UPDATE_SUCCESS_MESSAGE);
      setShowSuccessToast(true);
    } catch (error) {
      setErrorTitle(deedsToast.UPDATE_FAILED_TITLE);
      setErrorMessage(
        error instanceof Error ? error.message : deedsToast.UPDATE_FAILED_MESSAGE
      );
      setShowErrorToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    path: DeedFormPath,
    updater: (item: DecryptedDeedItem) => DecryptedDeedItem
  ) => {
    setDeed((current) => (current ? updateDeedDetailTree(current, path, updater) : current));
  };

  const removeLocalDeedAtPath = (path: DeedFormPath) => {
    const pathKey = pathToFieldKey(path);

    setDeed((current) => (current ? removeDeedDetailAtPath(current, path) : current));
    setSavedDeed((current) => (current ? removeDeedDetailAtPath(current, path) : current));

    if (expandedPathKey === pathKey || expandedPathKey.startsWith(`${pathKey}-`)) {
      setExpandedPathKey(path.length > 0 ? pathToFieldKey(path.slice(0, -1)) : "root");
      setEditingPathKey("");
    }
  };

  const handleDeleteRequest = (path: DeedFormPath) => {
    if (!deed) return;

    const itemToDelete = getDeedDetailItemAtPath(deed, path);

    if (isUnsavedDeedDetailItem(itemToDelete.deed_item_id)) {
      setDeed((current) => (current ? removeDeedDetailAtPath(current, path) : current));
      if (expandedPathKey === pathToFieldKey(path)) {
        setExpandedPathKey(path.length > 0 ? pathToFieldKey(path.slice(0, -1)) : "root");
        setEditingPathKey("");
      }
      return;
    }

    setPathToDelete(path);
  };

  const handleDeleteCancel = () => {
    setPathToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (!deed || !pathToDelete) return;

    const itemToDelete = getDeedDetailItemAtPath(deed, pathToDelete);

    deleteDeed(itemToDelete.deed_item_id, {
      onSuccess: () => {
        removeLocalDeedAtPath(pathToDelete);
        setPathToDelete(null);
        setSuccessTitle(deedsToast.DELETE_SUCCESS_TITLE);
        setSuccessMessage(deedsToast.DELETE_SUCCESS_MESSAGE);
        setShowSuccessToast(true);
      },
      onError: () => {
        setErrorTitle(deedsToast.DELETE_FAILED_TITLE);
        setErrorMessage(deedsToast.DELETE_FAILED_MESSAGE);
        setShowErrorToast(true);
      },
    });
  };

  const handleMove = (path: DeedFormPath, direction: "up" | "down") => {
    const childIndex = path[path.length - 1];
    const swapIndex = direction === "up" ? childIndex - 1 : childIndex + 1;
    const parentPath = path.slice(0, -1);

    setDeed((current) => (current ? moveDeedDetailAtPath(current, path, direction) : current));
    setExpandedPathKey((current) =>
      remapPathKeyAfterSiblingSwap(current, parentPath, childIndex, swapIndex)
    );
  };

  const handleAddChild = (path: DeedFormPath) => {
    if (!deed) {
      return;
    }

    const parent = getDeedDetailItemAtPath(deed, path);
    const newChildPath = [...path, parent.children?.length ?? 0];

    setDeed(addChildDeedDetailAtPath(deed, path));
    const newKey = pathToFieldKey(newChildPath);
    setExpandedPathKey(newKey);
    setEditingPathKey(newKey);
  };

  if ((isLoading && !item) || (decrypting && !deed)) {
    return <DeedItemsTableSkeleton />;
  }

  if (isError) {
    return <p className={styles.message}>{deedsMessage.FETCH_FAILED}</p>;
  }

  if (!deed) {
    return <p className={styles.message}>{deedsMessage.DEED_NOT_FOUND}</p>;
  }

  return (
    <>
      <div className={styles.page}>
        <DeedDetailSection
          item={deed}
          path={[]}
          siblingCount={1}
          existingRootSiblingNames={existingRootSiblingNames}
          expandedPathKey={expandedPathKey}
          editingPathKey={editingPathKey}
          isSaving={isSaving}
          onEdit={handleEdit}
          onMinimize={handleMinimize}
          onDelete={handleDeleteRequest}
          onAddChild={handleAddChild}
          onChange={handleChange}
          onMoveUp={(path) => handleMove(path, "up")}
          onMoveDown={(path) => handleMove(path, "down")}
          showMeasurementType={isParentDeed}
          measurementTypeLabel={measurementTypeLabel}
        />

        {isDirty && (
          <div className={styles.saveBar}>
            <ButtonGroup ariaLabel="Deed detail save actions" buttonWidth={130}>
              <button
                type="button"
                className={styles.saveButton}
                onClick={() => void handleSave()}
                disabled={isSaving}
              >
                {isSaving ? deedsButtonLabel.SAVING : deedsButtonLabel.SAVE}
              </button>
            </ButtonGroup>
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(pathToDelete)}
        title={deedsMessage.DELETE_CONFIRM_TITLE}
        message={deedsMessage.DELETE_CONFIRM_MESSAGE}
        cancelLabel={deedsButtonLabel.CANCEL}
        confirmLabel={isDeleting ? deedsButtonLabel.DELETING : deedsButtonLabel.CONFIRM}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isConfirming={isDeleting}
        ariaLabel="Delete deed confirmation"
      />

      <Toast
        show={showSuccessToast}
        type={toastType.SUCCESS}
        title={successTitle}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />

      <Toast
        show={showErrorToast}
        type={toastType.ERROR}
        title={errorTitle}
        message={errorMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </>
  );
}
