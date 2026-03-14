"use client";

import { motion, HTMLMotionProps, ForwardRefComponent } from "framer-motion";
import { ReactNode } from "react";

type MotionElementType = "div" | "h1" | "h2" | "p" | "section";

interface MotionElementProps extends Omit<HTMLMotionProps<MotionElementType>, "as"> {
  as?: MotionElementType;
  children?: ReactNode;
}

export default function Motion({
  as = "div",
  initial,
  whileInView,
  viewport,
  transition,
  children,
  ...props
}: MotionElementProps) {
  const MotionComponent = motion[as] as ForwardRefComponent<HTMLElement, HTMLMotionProps<MotionElementType>>;

  if (!props.variants) {
    return (
      <MotionComponent
        initial={initial ?? { opacity: 0, x: -40 }}
        whileInView={whileInView ?? { opacity: 1, x: 0 }}
        viewport={viewport ?? { once: true, amount: 0.8 }}
        transition={transition ?? { duration: 0.6, ease: "easeOut" }}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      {...(initial !== undefined && { initial })}
      {...(whileInView !== undefined && { whileInView })}
      {...(viewport !== undefined && { viewport })}
      {...(transition !== undefined && { transition })}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}