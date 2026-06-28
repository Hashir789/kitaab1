export interface ScaleFormItem {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export interface ScaleItem {
  scale_item_id: string;
  name: string;
  description?: string | null;
  display_order: number;
}

export interface DecryptedScaleItem {
  scale_item_id: string;
  name: string;
  description?: string;
  display_order: number;
}

export type GetScaleItemsResponse = ScaleItem[] | { items: ScaleItem[] };

export interface CreateScaleItemPayload {
  name: string;
  description?: string;
  display_order: number;
}

export interface CreateScaleItemsPayload {
  items: CreateScaleItemPayload[];
}
