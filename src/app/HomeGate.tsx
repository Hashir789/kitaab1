"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserIdFromToken, isAuthenticated } from "@/utils/session";

export default function HomeGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      const userId = getUserIdFromToken();
      if (userId) router.replace(`/user/${userId}`);
    }
  }, [router]);

  return <>{children}</>;
}