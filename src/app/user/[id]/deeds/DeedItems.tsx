"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./deeditems.module.css";
import { useDeedItems, useDeleteDeedItem, useUpdateDeedItemsDisplayOrder } from "@/hooks/deeds";
import { toastType } from "@/constants/enums";
import { getMasterKey } from "@/utils/session";
import {
  decryptDeedItems,
  getDeedItemOrderIds,
  hasDeedOrderChanged,
  swapDeedItemsAtIndex,
  toDeedItemsDisplayOrderPayload,
} from "@/utils/deeds";
import { useAppSelector } from "@/store/hooks";
import DeedItemsTable from "@/components/secondary/deeditemstable/DeedItemsTable";
import DeedItemsTableSkeleton from "@/components/secondary/deeditemstable/DeedItemsTableSkeleton";
import ConfirmModal from "@/components/secondary/confirmmodal/ConfirmModal";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import Toast from "@/components/secondary/toast/Toast";
import type { DecryptedDeedItem } from "@/interfaces/deeds";
import { deedsButtonLabel, deedsMessage, deedsToast } from "@/constants/placeholders";

export default function DeedItems() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const activeDeedType = useAppSelector((state) => state.ui.deedType);
  const { data, isLoading, isError } = useDeedItems(activeDeedType);
  const { mutate: saveDisplayOrder, isPending: isSaving } =
    useUpdateDeedItemsDisplayOrder(activeDeedType);
  const { mutate: deleteDeed, isPending: isDeleting } = useDeleteDeedItem(activeDeedType);
  const [items, setItems] = useState<DecryptedDeedItem[]>([]);
  const [savedOrderIds, setSavedOrderIds] = useState<string[]>([]);
  const [deedToDelete, setDeedToDelete] = useState<DecryptedDeedItem | null>(null);
  const [decrypting, setDecrypting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!data) {
      setItems([]);
      setSavedOrderIds([]);
      return;
    }

    let cancelled = false;
    setDecrypting(true);

    decryptDeedItems(data, getMasterKey())
      .then((decrypted) => {
        if (cancelled) return;
        const sorted = [...decrypted].sort((a, b) => a.display_order - b.display_order);
        setItems(sorted);
        setSavedOrderIds(getDeedItemOrderIds(sorted));
      })
      .finally(() => {
        if (!cancelled) setDecrypting(false);
      });

    return () => {
      cancelled = true;
    };
  }, [data]);

  const handleMove = (index: number, direction: "up" | "down") => {
    setItems((current) => swapDeedItemsAtIndex(current, index, direction));
  };

  const isOrderDirty = hasDeedOrderChanged(items, savedOrderIds);

  const handleSaveOrder = () => {
    saveDisplayOrder(
      { display_order: toDeedItemsDisplayOrderPayload(items) },
      {
        onSuccess: () => {
          setSavedOrderIds(getDeedItemOrderIds(items));
          setSuccessTitle(deedsToast.ORDER_SAVED_TITLE);
          setSuccessMessage(deedsToast.ORDER_SAVED_MESSAGE);
          setShowSuccessToast(true);
        },
        onError: () => {
          setErrorTitle(deedsToast.ORDER_SAVE_FAILED_TITLE);
          setErrorMessage(deedsToast.ORDER_SAVE_FAILED_MESSAGE);
          setShowErrorToast(true);
        },
      }
    );
  };

  const handleEdit = (item: DecryptedDeedItem) => {
    router.push(`/user/${params.id}/deeds/${item.deed_item_id}`);
  };

  const handleDeleteRequest = (item: DecryptedDeedItem) => {
    setDeedToDelete(item);
  };

  const handleDeleteCancel = () => {
    setDeedToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (!deedToDelete) return;

    deleteDeed(deedToDelete.deed_item_id, {
      onSuccess: () => {
        setItems((current) =>
          current.filter((entry) => entry.deed_item_id !== deedToDelete.deed_item_id)
        );
        setSavedOrderIds((current) =>
          current.filter((id) => id !== deedToDelete.deed_item_id)
        );
        setDeedToDelete(null);
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

  if (isLoading || decrypting) {
    return <DeedItemsTableSkeleton />;
  }

  if (isError) {
    return <p className={styles.message}>{deedsMessage.FETCH_FAILED}</p>;
  }

  return (
    <>
      <DeedItemsTable
        items={items}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onMoveUp={(_, index) => handleMove(index, "up")}
        onMoveDown={(_, index) => handleMove(index, "down")}
      />

      {isOrderDirty && (
        <div className={styles.saveBar}>
          <ButtonGroup ariaLabel="Display order actions" buttonWidth={130}>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSaveOrder}
              disabled={isSaving}
            >
              {isSaving ? deedsButtonLabel.SAVING : deedsButtonLabel.SAVE}
            </button>
          </ButtonGroup>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deedToDelete)}
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
