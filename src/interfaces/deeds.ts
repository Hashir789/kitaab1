import type { deedMeasurementType, deedType, deedVisibility } from "@/constants/enums";

export interface CreateDeedItemPayload {
  name: string;
  display_order: number;
  description?: string;
  hide_type?: deedVisibility;
  parent_deed_item_id?: string;
  children?: CreateDeedItemPayload[];
}

export type CreateDeedItemResponse = {
  deed_item_id: string;
  deed_id?: string;
};

export type CreateHasanaatItemPayload = CreateDeedItemPayload;
export type CreateHasanaatItemResponse = CreateDeedItemResponse;

export interface DeedItem {
  deed_item_id: string;
  deed_id: string;
  parent_deed_item_id: string | null;
  name: string;
  description: string | null;
  display_order: number;
  hide_type: string;
  created_at: string;
  measurement_type?: deedMeasurementType | string;
  children?: DeedItem[];
}

export type GetDeedItemsResponse = DeedItem[] | { items: DeedItem[] };

export interface UpdateDeedItemsDisplayOrderPayload {
  display_order: number[];
  parent_deed_item_id?: number;
}

export interface UpdateDeedItemPayload {
  name: string;
  description?: string;
  hide_type?: deedVisibility;
}

export interface DecryptedDeedItem {
  deed_item_id: string;
  deed_id: string;
  parent_deed_item_id: string | null;
  name: string;
  description?: string;
  display_order: number;
  hide_type: string;
  created_at: string;
  measurement_type?: deedMeasurementType | string;
  children?: DecryptedDeedItem[];
}

export interface DeedFormItem {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  visibility: deedVisibility;
  categoryType: deedType;
  measurementType: deedMeasurementType;
  children: DeedFormItem[];
}

export type DeedFormPath = number[];
