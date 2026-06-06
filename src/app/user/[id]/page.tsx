"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserSession } from "@/interfaces/user";
import { getUserSession, isAuthenticated } from "@/utils/session";
import AccountScreen from "@/app/user/AccountScreen/AccountScreen";

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getUserSession();
    if (!isAuthenticated() || !session) {
      router.replace("/auth");
      return;
    }
    setUser(session);
    setReady(true);
  }, [router]);

  if (!ready || !user) return null;

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
