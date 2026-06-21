import type { UserSession } from "@/interfaces/user";

export interface SidebarProps {
  userId: string;
  user: UserSession;
}