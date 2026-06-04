import { useCallback, useState } from "react";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { localStorageKeys } from "@/constants/enums";
import { getOrCreateAnonymousId } from "@/utils/visitor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, signup, otpVerify, emailVerify, update2fa, resendLink, forgotPassword, resetPassword } from "@/apis/auth";
import type { LoginPayload, LoginResponse, SignupPayload, SignupResponse, Update2faPayload, OtpVerifyPayload, Update2faResponse, OtpVerifyResponse, EmailVerifyResponse, ResendLinkPayload, ResendLinkResponse, ForgotPasswordPayload, ForgotPasswordResponse, ResetPasswordPayload, ResetPasswordResponse } from "@/interfaces/auth";

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

export function useSignup() {
  return useMutation<SignupResponse, Error, SignupPayload>({
    mutationFn: (payload) =>
      signup({
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

export function useOtpVerify() {
  return useMutation<OtpVerifyResponse, Error, OtpVerifyPayload>({
    mutationFn: (payload) => otpVerify(payload),
    onSuccess: (data) => {
      if (data?.access_token)
        window.localStorage.setItem(localStorageKeys.ACCESS_TOKEN_STORAGE_KEY, data.access_token);
    }
  });
}

export function useResendLink() {
  return useMutation<ResendLinkResponse, Error, ResendLinkPayload>({
    mutationFn: (payload) => resendLink(payload)
  });
}

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: (payload) => forgotPassword(payload)
  });
}

export function useResetPassword() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: (payload) => resetPassword(payload),
    onSuccess: (data) => {
      if (data?.access_token) {
        window.localStorage.setItem(localStorageKeys.ACCESS_TOKEN_STORAGE_KEY, data.access_token);
      }
    }
  });
}

export function useEmailVerify() {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const fetch = useCallback(
    async (email: string): Promise<EmailVerifyResponse> => {
      setIsPending(true);
      try {
        return await queryClient.fetchQuery({
          queryKey: QUERY_KEYS.AUTH.EMAIL_VERIFY(email),
          queryFn: () => emailVerify(email),
          staleTime: 60_000
        });
      } finally {
        setIsPending(false);
      }
    },
    [queryClient]
  );

  return { fetch, isPending };
}