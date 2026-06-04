"use client";

import Link from "next/link";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import styles from "./auth.module.css";
import { useEffect, useState } from "react";
import AccountScreen from "./AccountScreen";
import { useAppSelector } from "@/store/hooks";
import { getUserSession } from "@/utils/session";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "./ResetPasswordForm";
import type { UserSession } from "@/interfaces/user";
import Toast from "@/components/secondary/toast/Toast";
import FlipCard from "@/components/secondary/flipper/FlipCard";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

export default function Auth() {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token") ?? "";
  const isReset = Boolean(resetToken);
  const mode = useAppSelector((state) => state.ui.mode);
  const isBelow710 = useAppSelector((state) => state.ui.isBelow710);
  const viewportWidth = useAppSelector((state) => state.ui.viewportWidth);
  const computedButtonWidth = Math.max(100, viewportWidth - 52);
  const [mounted, setMounted] = useState(false);
  const [sessionUser, setSessionUser] = useState<UserSession | null>(null);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!isReset) {
      setSessionUser(getUserSession());
    }
  }, [isReset]);

  const returnButtonWidth = mounted && isBelow710 ? computedButtonWidth : 150;

  const handleAuthError = (message: string) => {
    const parts = message.split(":");
    setErrorToastMessage(parts.length > 1 ? parts[1] : message);
    setShowErrorToast(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.return}>
        <ButtonGroup buttonWidth={returnButtonWidth}>
          <Link href="/">Return to Home</Link>
        </ButtonGroup>
      </div>
      <FlipCard
        width={380}
        flipped={isReset ? false : mode === "signup"}
        initialFlipped={isReset ? false : mode === "signup"}
        front={
          isReset ? (
            <ResetPasswordForm token={resetToken} onError={handleAuthError} />
          ) : mounted && sessionUser ? (
            <AccountScreen user={sessionUser} />
          ) : (
            <LoginForm onError={handleAuthError} />
          )
        }
        back={
          isReset ? null : <SignupForm onError={handleAuthError} />
        }
      />
      <Toast
        show={showErrorToast}
        type="error"
        title={isReset ? "Password reset failed" : "Authentication failed"}
        message={errorToastMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </div>
  );
}
