import { api } from "@/apis/api";
import { ENDPOINTS } from "@/constants/endpoints";
import type { UserMeResponse } from "@/interfaces/user";

export function getMe(): Promise<UserMeResponse> {
  return api.get<UserMeResponse>(ENDPOINTS.USERS.ME);
}