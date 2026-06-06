import type { gender } from "@/constants/enums";

export interface UserSession {
  dob?: string;
  email: string;
  gender?: gender;
  full_name: string;
  two_factor_enabled?: boolean;
}