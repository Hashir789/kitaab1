"use client";

import { logout } from "@/utils/session";
import styles from "./accountscreen.module.css";
import type { UserSession } from "@/interfaces/user";
import type { AccountScreenProps } from "./accountscreen.interface";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import { accountButtonLabel, accountLabel, accountStatus } from "@/constants/placeholders";

function formatGender(gender: UserSession["gender"]): string | undefined {
  if (!gender) return undefined;
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

function formatTwoFactor(enabled: boolean | undefined): string | undefined {
  if (enabled === undefined) return undefined;
  return enabled ? accountStatus.ENABLED : accountStatus.DISABLED;
}

export default function AccountScreen({ user, minHeight }: AccountScreenProps) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Full name", value: user.full_name },
    { label: "Email", value: user.email },
  ];

  const gender = formatGender(user.gender);
  if (gender) rows.push({ label: accountLabel.GENDER, value: gender });

  if (user.dob) rows.push({ label: accountLabel.DATE_OF_BIRTH, value: user.dob });

  const twoFactor = formatTwoFactor(user.two_factor_enabled);
  if (twoFactor) rows.push({ label: accountLabel.TWO_FACTOR_AUTH, value: twoFactor });

  return (
    <div
      style={{
        gap: 16,
        display: "flex",
        flexDirection: "column",
        ...(minHeight !== undefined ? { minHeight } : {}),
      }}
    >
      <div
        style={{
          flex: 1,
          gap: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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
            {accountButtonLabel.LOG_OUT}
          </button>
        </ButtonGroup>
      </div>
    </div>
  );
}