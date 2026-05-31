export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface RequestOptions {
  signal?: AbortSignal;
  headers?: Record<string, string>;
}