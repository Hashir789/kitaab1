import { api } from "@/apis/api";
import { ENDPOINTS } from "@/constants/endpoints";
import type { CreateHasanaatItemPayload, CreateHasanaatItemResponse } from "@/interfaces/deeds";

export function createHasanaatItem(payload: CreateHasanaatItemPayload) {
  return api.post<CreateHasanaatItemResponse, CreateHasanaatItemPayload>(
    ENDPOINTS.DEEDS.HASANAAT_ITEMS,
    payload
  );
}