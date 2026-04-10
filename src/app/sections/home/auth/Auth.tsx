"use client";

import styles from "./auth.module.css";
import { setMode } from "@/store/uiSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

export default function Auth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [fullWidth, setFullWidth] = useState(100);
  const rightButtonGroupRef = useRef<HTMLDivElement>(null);
  const isBelow710 = useAppSelector((state) => state.ui.isBelow710);

  useEffect(() => {
    const handleResize = () => {
      if (isBelow710 && rightButtonGroupRef.current) {
        const groupWidth = rightButtonGroupRef.current.offsetWidth;
        const computed = (groupWidth - 24) / 2;
        setFullWidth(computed);
      } else {
        setFullWidth(100);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isBelow710]);

  return (
    <div className={styles.container}>
      <div ref={rightButtonGroupRef} className={styles.rightButtonGroup}>
        <ButtonGroup
          buttonWidth={isBelow710 ? fullWidth : 100}
          buttonHeight={35}
          activeIndex={1}
        >
          <button onClick={() => { 
            dispatch(setMode("login"));
            router.push("/auth"); 
          }}>
            Login
          </button>
          <button onClick={() => { 
            dispatch(setMode("signup"));
            router.push("/auth"); 
          }}>
            Signup
          </button>
        </ButtonGroup>
      </div>
    </div>
  );
}