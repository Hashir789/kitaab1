export const QUERY_KEYS = {
  AUTH: {
    EMAIL_VERIFY: (email: string) => ["auth", "email-verify", email] as const
  },
  USERS: {
    ME: ["users", "me"] as const
  },
  DEEDS: {
    ITEMS: (type: string) => ["deeds", "items", type] as const
  },
  SCALES: {
    ITEMS: (deedItemId: string) => ["scales", "items", deedItemId] as const
  }
} as const;