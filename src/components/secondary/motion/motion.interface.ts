import { ReactNode } from "react";
import { HTMLMotionProps } from "framer-motion";

export type MotionElementType = "div" | "h1" | "h2" | "p" | "section";

export interface MotionElementProps extends Omit<HTMLMotionProps<MotionElementType>, "as"> {
  as?: MotionElementType;
  children?: ReactNode;
  reverse?: boolean;
}