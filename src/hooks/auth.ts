import { login, update2fa } from "@/apis/auth";
import { useMutation } from "@tanstack/react-query";
import { localStorageKeys } from "@/constants/enums";
import { getOrCreateAnonymousId } from "@/utils/visitor";
import type { LoginPayload, LoginResponse, Update2faPayload, Update2faResponse } from "@/interfaces/auth";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) =>
      login({
        ...payload,
        anonymous_id: getOrCreateAnonymousId()
      }),
    onSuccess: (data) => {
      if (data?.access_token)
        window.localStorage.setItem(localStorageKeys.ACCESS_TOKEN_STORAGE_KEY, data.access_token);
    }
  });
}

export function useUpdate2fa() {
  return useMutation<Update2faResponse, Error, Update2faPayload>({
    mutationFn: (payload) => update2fa(payload)
  });
}