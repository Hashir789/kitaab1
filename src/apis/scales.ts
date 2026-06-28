import { api } from "@/apis/api";
import { ENDPOINTS } from "@/constants/endpoints";
import type { CreateScaleItemsPayload, GetScaleItemsResponse, ScaleItem } from "@/interfaces/scales";

type RawScaleItem = Partial<ScaleItem>;

export function mapScaleItem(raw: RawScaleItem): ScaleItem {
  return {
    scale_item_id: String(raw.scale_item_id ?? ""),
    name: String(raw.name ?? ""),
    description: raw.description ?? null,
    display_order: Number(raw.display_order ?? 0),
  };
}

export function normalizeScaleItems(response: GetScaleItemsResponse): ScaleItem[] {
  const items = Array.isArray(response) ? response : response.items ?? [];
  return items.map((item) => mapScaleItem(item));
}

export function getScaleItems(deedItemId: string) {
  return api.get<GetScaleItemsResponse>(ENDPOINTS.SCALES.ITEMS(deedItemId));
}

export function createScaleItems(deedItemId: string, payload: CreateScaleItemsPayload) {
  return api.post<void, CreateScaleItemsPayload>(ENDPOINTS.SCALES.ITEMS(deedItemId), payload);
}
