"use client";

import { useMe } from "@/hooks/user";
import styles from "./userpage.module.css";
import { useEffect, useState } from "react";
import { mapMeToUserSession } from "@/utils/user";
import type { UserSession } from "@/interfaces/user";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/secondary/loader/Loader";
import { accountMessage } from "@/constants/placeholders";
import Sidebar from "@/components/primary/sidebar/Sidebar";
import Breadcrumbs from "@/components/secondary/breadcrumbs/Breadcrumbs";
import { clearPendingPassword, getPendingPassword, getUserIdFromToken, isAuthenticated } from "@/utils/session";


export default function UserPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<UserSession | null>(null);
  const tokenUserId = getUserIdFromToken();
  const [ready, setReady] = useState(false);
  const canFetch = isAuthenticated() && tokenUserId === params.id;
  const { data, isLoading, isError } = useMe(canFetch);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/auth");
      return;
    }

    if (tokenUserId && tokenUserId !== params.id) {
      router.replace(`/user/${tokenUserId}`);
      return;
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
    <div className={styles.screen}>
      <Sidebar user={user} userId={params.id} />
      <Breadcrumbs count={6} buttonWidth={130} />
    </div>
  );
}