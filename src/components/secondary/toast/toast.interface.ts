import type { toastType } from "@/constants/enums";

export interface ToastProps {
  show: boolean;
  title: string;
  message: string;
  type: toastType;
  onClose: () => void;
}