export const QUERY_KEYS = {
  AUTH: {
    EMAIL_VERIFY: (email: string) => ["auth", "email-verify", email] as const
  },
  USERS: {
    ME: ["users", "me"] as const
  }
} as const;