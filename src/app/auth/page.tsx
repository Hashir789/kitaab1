 "use client";
 
 import Link from "next/link";
 import { useState } from "react";
 import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
 import styles from "./auth.module.css"
 import { useAppSelector } from "@/store/hooks";
 import Toast from "@/components/secondary/toast/Toast";
 import FlipCard from "@/components/secondary/flipper/FlipCard";
 import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

export default function Auth() {
  const mode = useAppSelector((state) => state.ui.mode);
  const isBelow710 = useAppSelector((state) => state.ui.isBelow710);
  const viewportWidth = useAppSelector((state) => state.ui.viewportWidth);
  const computedButtonWidth = Math.max(100, viewportWidth - 52);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");

  const handleLoginError = (message: string) => {
    setErrorToastMessage(message.split(":")[1]);
    setShowErrorToast(true);
  };

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
          <LoginForm onError={handleLoginError} />
        }
        back={
          <SignupForm />
          
        }
      />
      <Toast
        show={showErrorToast}
        type="error"
        title="Login failed"
        message={errorToastMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </div>
  );
}