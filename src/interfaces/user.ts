import type { gender } from "@/constants/enums";

export interface UserMeResponse {
  id: string;
  dob: string;
  email: string;
  gender: gender;
  key_iv: string;
  key_salt: string;
  full_name: string;
  created_at: string;
  encrypted_master_key: string;
}

export interface UserSession {
  id?: string;
  dob?: string;
  email?: string;
  gender?: gender;
  full_name?: string;
}