import type { iconState } from "@/constants/enums";
import type { ChangeEvent, FocusEvent, ReactNode } from "react";

export type InputProps = {
  id: string;
  name: string;
  label?: string;
  value?: string;
  ariaLabel: string;
  required?: boolean;
  helperText?: string;
  placeholder: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  defaultValue?: string;
  iconState?: iconState;
  showInfoIcon?: boolean;
  width?: string | number;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  leftIconSize?: number | string;
  rightIconSize?: number | string;
  widthVariant?: "default" | "waitlist";
  inputType?: "email" | "tel" | "text" | "password";
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};