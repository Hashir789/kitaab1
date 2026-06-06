import { ENDPOINTS } from "@/constants/endpoints";
import { localStorageKeys } from "@/constants/enums";
import type { HttpMethod, RequestOptions } from "./interfaces";

const PUBLIC_PATHS: string[] = [
  ENDPOINTS.AUTH.LOGIN,
  ENDPOINTS.AUTH.SIGNUP,
  ENDPOINTS.VISITORS.TRACK,
  ENDPOINTS.VISITORS.EMAIL,
  ENDPOINTS.AUTH.OTP_VERIFY,
  ENDPOINTS.VISITORS.MESSAGE,
  ENDPOINTS.AUTH.RESEND_LINK,
  ENDPOINTS.AUTH.EMAIL_VERIFY,
  ENDPOINTS.AUTH.RESET_PASSWORD,
  ENDPOINTS.AUTH.FORGOT_PASSWORD
];

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(localStorageKeys.ACCESS_TOKEN_STORAGE_KEY);
}

async function request<TResponse, TBody = unknown>(
  method: HttpMethod,
  path: string,
  body?: TBody,
  options: RequestOptions = {},
): Promise<TResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (!PUBLIC_PATHS.some((p) => path.split("?")[0] === p)) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: options.signal,
    credentials: "include",
  });

  if (!response.ok) {    
    const data = await response.json();
    let message = `${path}:${data.message} (${response.status})`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as TResponse;
  }
  return (await response.text()) as unknown as TResponse;
}

export const api = {
  get: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>("GET", path, undefined, options),
  post: <TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions) =>
    request<TResponse, TBody>("POST", path, body, options),
  patch: <TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions) =>
    request<TResponse, TBody>("PATCH", path, body, options),
  delete: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>("DELETE", path, undefined, options),
};