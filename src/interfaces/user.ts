export interface UserSession {
  dob?: string;
  email: string;
  full_name: string;
  two_factor_enabled?: boolean;
  gender?: "male" | "female" | "other";
}