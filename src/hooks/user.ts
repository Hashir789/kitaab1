import { getMe } from "@/apis/user";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { UserMeResponse } from "@/interfaces/user";
import { useQuery } from "@tanstack/react-query";

export function useMe(enabled = true) {
  return useQuery<UserMeResponse, Error>({
    queryKey: QUERY_KEYS.USERS.ME,
    queryFn: getMe,
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}