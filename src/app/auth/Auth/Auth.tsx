"use client";

import Link from "next/link";
import styles from "./auth.module.css";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignupForm/SignupForm";
import Toast from "@/components/secondary/toast/Toast";
import { authMode, toastType } from "@/constants/enums";
import { useRouter, useSearchParams } from "next/navigation";
import { authLink, authToast } from "@/constants/placeholders";
import FlipCard from "@/components/secondary/flipper/FlipCard";
import { getUserIdFromToken, isAuthenticated } from "@/utils/session";
import ResetPasswordForm from "../ResetPasswordForm/ResetPasswordForm";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

export default function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token") ?? "";
  const isReset = Boolean(resetToken);
  const mode = useAppSelector((state) => state.ui.mode);
  const isBelow710 = useAppSelector((state) => state.ui.isBelow710);
  const viewportWidth = useAppSelector((state) => state.ui.viewportWidth);
  const computedButtonWidth = Math.max(100, viewportWidth - 52);
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!isReset && isAuthenticated()) {
      setLoggedIn(true);
      const userId = getUserIdFromToken();
      if (userId) router.replace(`/user/${userId}`);
    }
  }, [isReset, router]);

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
          <Link href="/">{authLink.RETURN_HOME}</Link>
        </ButtonGroup>
      </div>
      <FlipCard
        width={380}
        flipped={isReset ? false : mode === authMode.SIGNUP}
        initialFlipped={isReset ? false : mode === authMode.SIGNUP}
        front={
          isReset ? (
            <ResetPasswordForm token={resetToken} onError={handleAuthError} />
          ) : mounted && loggedIn ? null : (
            <LoginForm onError={handleAuthError} />
          )
        }
        back={
          isReset ? null : <SignupForm onError={handleAuthError} />
        }
      />
      <Toast
        show={showErrorToast}
        type={toastType.ERROR}
        message={errorToastMessage}
        onClose={() => setShowErrorToast(false)}
        title={isReset ? authToast.RESET_FAILED : authToast.AUTH_FAILED}
      />
    </div>
  );
}
