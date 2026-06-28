"use client";

import { useMe } from "@/hooks/user";
import userStyles from "../../userpage.module.css";
import { useEffect, useState } from "react";
import { mapMeToUserSession } from "@/utils/user";
import type { UserSession } from "@/interfaces/user";
import { useParams, usePathname, useRouter } from "next/navigation";
import Loader from "@/components/secondary/loader/Loader";
import { accountMessage } from "@/constants/placeholders";
import Sidebar from "@/components/primary/sidebar/Sidebar";
import Breadcrumbs from "@/components/secondary/breadcrumbs/Breadcrumbs";
import deedsStyles from "../deedspage.module.css";
import DeedDetail from "./DeedDetail";
import ScaleDetail from "./scale/ScaleDetail";
import { useScaleItems } from "@/hooks/scales";
import {
  clearPendingPassword,
  getPendingPassword,
  getUserIdFromToken,
  isAuthenticated,
} from "@/utils/session";

export default function DeedItemLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id: string; deedItemId: string }>();
  const [user, setUser] = useState<UserSession | null>(null);
  const tokenUserId = getUserIdFromToken();
  const [ready, setReady] = useState(false);
  const canFetch = isAuthenticated() && tokenUserId === params.id;
  const { data, isLoading, isError } = useMe(canFetch);
  const isScaleStep = pathname.endsWith(`/deeds/${params.deedItemId}/scale`);
  const { data: scaleItems = [], isLoading: scalesLoading } = useScaleItems(
    params.deedItemId,
    canFetch
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/auth");
      return;
    }

    if (tokenUserId && tokenUserId !== params.id) {
      router.replace(
        isScaleStep
          ? `/user/${tokenUserId}/deeds/${params.deedItemId}/scale`
          : `/user/${tokenUserId}/deeds/${params.deedItemId}`
      );
    }
  }, [isScaleStep, params.deedItemId, params.id, router, tokenUserId]);

  useEffect(() => {
    if (!isScaleStep || scalesLoading) {
      return;
    }

    if (scaleItems.length === 0) {
      router.replace(`/user/${params.id}/deeds/${params.deedItemId}`);
    }
  }, [isScaleStep, params.deedItemId, params.id, router, scaleItems.length, scalesLoading]);

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
      <Loader className={userStyles.loaderWrapper} helperText={accountMessage.FETCHING_DATA} />
    );
  }

  return (
    <div className={userStyles.screen}>
      <Sidebar user={user} userId={params.id} />
      <div className={deedsStyles.main}>
        <Breadcrumbs className={deedsStyles.breadcrumbs} />
        <div className={deedsStyles.content}>
          <div hidden={isScaleStep}>
            <DeedDetail />
          </div>
          <div hidden={!isScaleStep}>
            <ScaleDetail />
          </div>
        </div>
      </div>
    </div>
  );
}
