import type { UserSession } from "@/interfaces/user";

export interface AccountScreenProps {
  user: UserSession;
  minHeight?: number;
}