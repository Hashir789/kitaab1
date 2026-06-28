"use client";

import { useMe } from "@/hooks/user";
import styles from "../userpage.module.css";
import { useEffect, useState } from "react";
import { mapMeToUserSession } from "@/utils/user";
import type { UserSession } from "@/interfaces/user";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/secondary/loader/Loader";
import Toast from "@/components/secondary/toast/Toast";
import { accountMessage, deedsFormMessage } from "@/constants/placeholders";
import { toastType } from "@/constants/enums";
import Sidebar from "@/components/primary/sidebar/Sidebar";
import Breadcrumbs from "@/components/secondary/breadcrumbs/Breadcrumbs";
import DeedItems from "./DeedItems";
import DeedAddFab from "@/components/secondary/deedaddfab/DeedAddFab";
import deedsStyles from "./deedspage.module.css";
import {
  clearPendingPassword,
  consumeDeedCreateSuccessPending,
  getPendingPassword,
  getUserIdFromToken,
  isAuthenticated,
} from "@/utils/session";

export default function DeedsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<UserSession | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);  const tokenUserId = getUserIdFromToken();
  const [ready, setReady] = useState(false);
  const canFetch = isAuthenticated() && tokenUserId === params.id;
  const { data, isLoading, isError } = useMe(canFetch);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/auth");
      return;
    }

    if (tokenUserId && tokenUserId !== params.id) {
      router.replace(`/user/${tokenUserId}/deeds`);
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

  useEffect(() => {
    if (!ready) return;

    if (consumeDeedCreateSuccessPending()) {
      setShowSuccessToast(true);
    }
  }, [ready]);

  if (!canFetch || isLoading || !ready || !user) {
    return (
      <Loader className={styles.loaderWrapper} helperText={accountMessage.FETCHING_DATA} />
    );
  }

  return (
    <div className={styles.screen}>
      <Sidebar user={user} userId={params.id} />
      <div className={deedsStyles.main}>
        <Breadcrumbs className={deedsStyles.breadcrumbs} />
        <div className={deedsStyles.content}>
          <DeedItems />
        </div>
        <DeedAddFab userId={params.id} />
      </div>

      <Toast
        show={showSuccessToast}
        type={toastType.SUCCESS}
        title="Deed added"
        message={deedsFormMessage.CREATE_SUCCESS}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
}
