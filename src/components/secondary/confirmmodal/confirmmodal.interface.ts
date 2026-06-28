export interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
  ariaLabel?: string;
}
