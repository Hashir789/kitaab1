"use client";

import { useAppSelector } from "@/store/hooks";
import { MotionElementProps, MotionElementType } from "./motion.interface";
import { motion, HTMLMotionProps, ForwardRefComponent } from "framer-motion";

export default function Motion({
  as = "div",
  initial,
  whileInView,
  viewport,
  transition,
  children,
  reverse = false,
  ...props
}: MotionElementProps) {
  const isBelow1124 = useAppSelector((state) => state.ui.isBelow1124);

  const MotionComponent = motion[as] as ForwardRefComponent<HTMLElement, HTMLMotionProps<MotionElementType>>;

  const getInitial = () => {
    if (reverse && isBelow1124) {
      if (initial && typeof initial === "object" && "x" in initial) {
        return { ...initial, x: 40 };
      }
      return { opacity: 0, x: 40 };
    }
    
    if (initial) {
      return initial;
    }
    return { opacity: 0, x: -40 };
  };

  if (!props.variants) {
    return (
      <MotionComponent
        initial={getInitial()}
        whileInView={whileInView ?? { opacity: 1, x: 0 }}
        viewport={viewport ?? { amount: 0.8 }}
        transition={transition ?? { duration: 0.6, ease: "easeOut" }}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }

  const finalInitial = reverse && isBelow1124 && initial && typeof initial === "object" && "x" in initial
    ? { ...initial, x: 40 }
    : initial;

  return (
    <MotionComponent
      {...(finalInitial !== undefined && { initial: finalInitial })}
      {...(whileInView !== undefined && { whileInView })}
      {...(viewport !== undefined && { viewport })}
      {...(transition !== undefined && { transition })}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}