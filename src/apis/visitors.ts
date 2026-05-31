import { api } from "@/apis/api";
import { ENDPOINTS } from "@/constants/endpoints";
import type { TrackVisitorPayload, VisitorEmailRequest, VisitorMessageRequest } from "@/interfaces/visitors";

export function trackVisitor(payload: TrackVisitorPayload): Promise<void> {
  return api.post<void, TrackVisitorPayload>(ENDPOINTS.VISITORS.TRACK, payload);
}

export function submitVisitorEmail(payload: VisitorEmailRequest): Promise<void> {
  return api.post<void, VisitorEmailRequest>(ENDPOINTS.VISITORS.EMAIL, payload);
}

export function submitVisitorMessage(payload: VisitorMessageRequest): Promise<void> {
  return api.post<void, VisitorMessageRequest>(ENDPOINTS.VISITORS.MESSAGE, payload);
}