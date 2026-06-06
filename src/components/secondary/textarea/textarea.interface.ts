import type { ChangeEvent, FocusEvent } from "react";
import { iconState as IconState } from "@/constants/enums";

export type TextAreaProps = {
  id: string;
  name: string;
  rows?: number;
  label?: string;
  value?: string;
  ariaLabel: string;
  required?: boolean;
  helperText?: string;
  placeholder: string;
  defaultValue?: string;
  iconState?: IconState;
  showInfoIcon?: boolean;
  width?: string | number;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};