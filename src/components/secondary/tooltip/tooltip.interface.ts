import { ReactNode } from "react";

export interface TooltipProps {
  text: string;
  children: ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}