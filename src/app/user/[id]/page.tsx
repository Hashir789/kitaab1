"use client";

import { useMe } from "@/hooks/user";
import styles from "./userpage.module.css";
import { useEffect, useState } from "react";
import { mapMeToUserSession } from "@/utils/user";
import type { UserSession } from "@/interfaces/user";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/secondary/loader/Loader";
import { accountMessage } from "@/constants/placeholders";
import AccountScreen from "@/app/user/AccountScreen/AccountScreen";
import { clearPendingPassword, getPendingPassword, getUserIdFromToken, isAuthenticated } from "@/utils/session";

export default function UserPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<UserSession | null>(null);
  const [ready, setReady] = useState(false);
  const tokenUserId = getUserIdFromToken();
  const canFetch = isAuthenticated() && tokenUserId === params.id;
  const { data, isLoading, isError } = useMe(canFetch);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/auth");
      return;
    }

    if (tokenUserId && tokenUserId !== params.id) {
      router.replace(`/user/${tokenUserId}`);
    }
  }, [params.id, router, tokenUserId]);

  useEffect(() => {
    if (!canFetch || !data) return;

    let cancelled = false;
    const password = getPendingPassword();

    mapMeToUserSession(data, password)
      .then((mappedUser) => {
        if (cancelled) return;
        setUser(mappedUser);
        setReady(true);
        clearPendingPassword();
      })
      .catch(() => {
        if (!cancelled) router.replace("/auth");
      });

    return () => {
      cancelled = true;
    };
  }, [canFetch, data, router]);

  useEffect(() => {
    if (isError) router.replace("/auth");
  }, [isError, router]);

  if (!canFetch || isLoading || !ready || !user) {
    return (
      <Loader className={styles.loaderWrapper} helperText={accountMessage.FETCHING_DATA} />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 380, maxWidth: "100%" }}>
        <AccountScreen user={user} />
      </div>
    </div>
  );
}
