import { ReactNode } from "react";

export interface TooltipProps {
  text: string;
  children: ReactNode;
  className?: string;
  floating?: boolean;
  position?: "top" | "bottom" | "left" | "right" | "auto";
}