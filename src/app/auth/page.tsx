 "use client";
 
 import Link from "next/link";
 import LoginForm from "./LoginForm";
 import styles from "./auth.module.css"
 import { useAppDispatch, useAppSelector } from "@/store/hooks";
 import FlipCard from "@/components/secondary/flipper/FlipCard";
 import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

export default function Auth() {
  const mode = useAppSelector((state) => state.ui.mode);
  const isBelow710 = useAppSelector((state) => state.ui.isBelow710);
  const viewportWidth = useAppSelector((state) => state.ui.viewportWidth);
  const computedButtonWidth = Math.max(100, viewportWidth - 52);

  return (
    <div className={styles.container}>
      <ButtonGroup buttonWidth={isBelow710 ? computedButtonWidth : 150} className={styles.return}>
        <Link href="/">Return to Home</Link>
      </ButtonGroup>
      <FlipCard
        width={380}
        flipped={mode === "signup"}
        initialFlipped={mode === "signup"}
        front={
          <LoginForm />
        }
        back={
          <LoginForm />
        }
      />
    </div>
  );
}