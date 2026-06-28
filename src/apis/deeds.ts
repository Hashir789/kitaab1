import { api } from "@/apis/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { deedType } from "@/constants/enums";
import type {
  CreateDeedItemPayload,
  CreateDeedItemResponse,
  DeedItem,
  GetDeedItemsResponse,
  UpdateDeedItemPayload,
  UpdateDeedItemsDisplayOrderPayload,
} from "@/interfaces/deeds";

type RawDeedItem = Partial<DeedItem> & { createdAt?: string; measurement_type?: string; children?: RawDeedItem[] };

export function mapDeedItem(raw: RawDeedItem): DeedItem {
  const item: DeedItem = {
    deed_item_id: String(raw.deed_item_id ?? ""),
    deed_id: String(raw.deed_id ?? ""),
    parent_deed_item_id: raw.parent_deed_item_id ?? null,
    name: String(raw.name ?? ""),
    description: raw.description ?? null,
    display_order: Number(raw.display_order ?? 0),
    hide_type: String(raw.hide_type ?? ""),
    created_at: String(raw.created_at ?? raw.createdAt ?? ""),
    ...(raw.measurement_type ? { measurement_type: String(raw.measurement_type) } : {}),
  };

  if (raw.children?.length) {
    item.children = raw.children.map((child) => mapDeedItem(child));
  }

  return item;
}

export function normalizeDeedItems(response: GetDeedItemsResponse): DeedItem[] {
  const items = Array.isArray(response) ? response : response.items ?? [];
  return items.map((item) => mapDeedItem(item));
}

export function getDeedItems(type: deedType) {
  const path =
    type === deedType.HASANAAT
      ? ENDPOINTS.DEEDS.HASANAAT_ITEMS
      : ENDPOINTS.DEEDS.SAIYYIAAT_ITEMS;

  return api.get<GetDeedItemsResponse>(path);
}

export function createDeedItem(type: deedType, payload: CreateDeedItemPayload) {
  const path =
    type === deedType.HASANAAT
      ? ENDPOINTS.DEEDS.HASANAAT_ITEMS
      : ENDPOINTS.DEEDS.SAIYYIAAT_ITEMS;

  return api.post<CreateDeedItemResponse | undefined, CreateDeedItemPayload>(path, payload);
}

export function createHasanaatItem(payload: CreateDeedItemPayload) {
  return createDeedItem(deedType.HASANAAT, payload);
}

function getDeedItemsDisplayOrderPath(type: deedType) {
  return type === deedType.HASANAAT
    ? ENDPOINTS.DEEDS.HASANAAT_ITEMS_DISPLAY_ORDER
    : ENDPOINTS.DEEDS.SAIYYIAAT_ITEMS_DISPLAY_ORDER;
}

export function updateDeedItemsDisplayOrder(
  type: deedType,
  payload: UpdateDeedItemsDisplayOrderPayload
) {
  return api.patch<void, UpdateDeedItemsDisplayOrderPayload>(
    getDeedItemsDisplayOrderPath(type),
    payload
  );
}

function getDeedItemBasePath(type: deedType) {
  return type === deedType.HASANAAT
    ? ENDPOINTS.DEEDS.HASANAAT_ITEMS
    : ENDPOINTS.DEEDS.SAIYYIAAT_ITEMS;
}

export function deleteDeedItem(type: deedType, deedItemId: string) {
  return api.delete<void>(`${getDeedItemBasePath(type)}/${deedItemId}`);
}

export function updateDeedItem(
  type: deedType,
  deedItemId: string,
  payload: UpdateDeedItemPayload
) {
  return api.patch<void, UpdateDeedItemPayload>(
    `${getDeedItemBasePath(type)}/${deedItemId}`,
    payload
  );
}
