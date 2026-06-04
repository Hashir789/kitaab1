"use client";

import Image from "next/image";
import { logout } from "@/utils/session";
import styles from "./loginform.module.css";
import type { UserSession } from "@/interfaces/user";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

interface AccountScreenProps {
  user: UserSession;
  minHeight?: number;
}

function formatGender(gender: UserSession["gender"]): string | undefined {
  if (!gender) return undefined;
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

function formatTwoFactor(enabled: boolean | undefined): string | undefined {
  if (enabled === undefined) return undefined;
  return enabled ? "Enabled" : "Disabled";
}

export default function AccountScreen({ user, minHeight }: AccountScreenProps) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Full name", value: user.full_name },
    { label: "Email", value: user.email },
  ];

  const gender = formatGender(user.gender);
  if (gender) rows.push({ label: "Gender", value: gender });

  if (user.dob) rows.push({ label: "Date of birth", value: user.dob });

  const twoFactor = formatTwoFactor(user.two_factor_enabled);
  if (twoFactor) rows.push({ label: "Two-factor auth", value: twoFactor });

  return (
    <div className={styles.form} style={minHeight !== undefined ? { minHeight } : undefined}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <Image
          priority
          width={75}
          height={75}
          alt="Kitaab logo"
          src="/kitaab-logo.png"
        />
      </div>
      <div
        style={{
          flex: 1,
          gap: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "rgb(80, 80, 80)" }}>
          Your account
        </div>
        <div className={styles.accountInfo}>
          {rows.map((row) => (
            <div key={row.label} className={styles.accountRow}>
              <span className={styles.accountLabel}>{row.label}</span>
              <span className={styles.accountValue}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.actionsLogin}>
        <ButtonGroup activeIndex={0} buttonWidth={150}>
          <button type="button" onClick={logout}>
            Log out
          </button>
        </ButtonGroup>
      </div>
    </div>
  );
}