import { ReactNode } from "react";

export type ButtonGroupProps = {
  gap?: number;
  padding?: number;
  fontSize?: number;
  className?: string;
  ariaLabel?: string;
  bordered?: boolean;
  children: ReactNode;
  activeIndex?: number;
  buttonWidth?: number;
  buttonHeight?: number;
};