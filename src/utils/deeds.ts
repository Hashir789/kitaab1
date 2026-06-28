import { decryptText } from "@/utils/crypto";
import { deedMeasurementType, deedType, deedVisibility } from "@/constants/enums";
import {
  deedsFormCategoryType,
  deedsFormMeasurementType,
  deedsFormVisibility,
  deedsPlaceholder,
} from "@/constants/placeholders";
import type { DecryptedDeedItem, DeedItem } from "@/interfaces/deeds";

export const deedVisibilityOptions = [
  { value: deedVisibility.GRAPHS_ONLY, label: deedsFormVisibility.GRAPHS_ONLY },
  { value: deedVisibility.RECORDS_ONLY, label: deedsFormVisibility.RECORDS_ONLY },
  { value: deedVisibility.BOTH, label: deedsFormVisibility.BOTH },
] as const;

export const deedCategoryTypeOptions = [
  { value: deedType.HASANAAT, label: deedsFormCategoryType.HASANAAT },
  { value: deedType.SAIYYIAAT, label: deedsFormCategoryType.SAIYYIAAT },
] as const;

export const deedMeasurementTypeOptions = [
  { value: deedMeasurementType.SCALE, label: deedsFormMeasurementType.SCALE },
  { value: deedMeasurementType.COUNT, label: deedsFormMeasurementType.COUNT },
] as const;
async function tryDecryptValue(masterKey: string | null, value: string): Promise<string> {
  if (!masterKey) return value;

  try {
    return await decryptText(masterKey, value);
  } catch {
    return value;
  }
}

export async function decryptDeedItem(
  item: DeedItem,
  masterKey: string | null
): Promise<DecryptedDeedItem> {
  const name = await tryDecryptValue(masterKey, item.name);
  const description = item.description
    ? await tryDecryptValue(masterKey, item.description)
    : undefined;

  const decrypted: DecryptedDeedItem = {
    deed_item_id: item.deed_item_id,
    deed_id: item.deed_id,
    parent_deed_item_id: item.parent_deed_item_id,
    name,
    description,
    display_order: item.display_order,
    hide_type: item.hide_type,
    created_at: item.created_at,
    ...(item.measurement_type ? { measurement_type: item.measurement_type } : {}),
  };

  if (item.children?.length) {
    decrypted.children = await Promise.all(
      item.children.map((child) => decryptDeedItem(child, masterKey))
    );
  }

  return decrypted;
}

export async function decryptDeedItems(
  items: DeedItem[],
  masterKey: string | null
): Promise<DecryptedDeedItem[]> {
  return Promise.all(items.map((item) => decryptDeedItem(item, masterKey)));
}

export function findDeedItemById(items: DeedItem[], deedItemId: string): DeedItem | undefined {
  for (const item of items) {
    if (item.deed_item_id === deedItemId) {
      return item;
    }

    if (item.children?.length) {
      const match = findDeedItemById(item.children, deedItemId);
      if (match) {
        return match;
      }
    }
  }

  return undefined;
}

export function formatDeedHideType(hideType: string): string {
  switch (hideType) {
    case deedVisibility.BOTH:
      return deedsFormVisibility.BOTH;
    case deedVisibility.GRAPHS_ONLY:
      return deedsFormVisibility.GRAPHS_ONLY;
    case deedVisibility.RECORDS_ONLY:
      return deedsFormVisibility.RECORDS_ONLY;
    default:
      return hideType || deedsPlaceholder.EMPTY;
  }
}

export function formatDeedMeasurementType(value?: string): string {
  switch (value) {
    case deedMeasurementType.SCALE:
      return deedsFormMeasurementType.SCALE;
    case deedMeasurementType.COUNT:
      return deedsFormMeasurementType.COUNT;
    default:
      return value || deedsPlaceholder.EMPTY;
  }
}

export function resolveDeedMeasurementType(
  measurementType: string | undefined,
  hasScales: boolean
): deedMeasurementType {
  if (measurementType === deedMeasurementType.SCALE || measurementType === deedMeasurementType.COUNT) {
    return measurementType;
  }

  return hasScales ? deedMeasurementType.SCALE : deedMeasurementType.COUNT;
}

export function formatDeedCreatedAt(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return formatDeedFormCreatedAt(date);
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatDeedFormCreatedAt(date: Date = new Date()): string {
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const meridiem = hours24 >= 12 ? "P.M." : "A.M.";
  const hours12 = String(hours24 % 12 || 12).padStart(2, "0");

  return `${month} ${day}${getOrdinalSuffix(day)}, ${year} - ${hours12}:${minutes} ${meridiem}`;
}

export function canMoveDeedItemUp(index: number): boolean {
  return index > 0;
}

export function canMoveDeedItemDown(index: number, itemCount: number): boolean {
  return index < itemCount - 1;
}

export function swapDeedItemsAtIndex(
  items: DecryptedDeedItem[],
  index: number,
  direction: "up" | "down"
): DecryptedDeedItem[] {
  const swapIndex = direction === "up" ? index - 1 : index + 1;

  if (swapIndex < 0 || swapIndex >= items.length) {
    return items;
  }

  const next = [...items];
  [next[index], next[swapIndex]] = [next[swapIndex], next[index]];

  return next;
}

export function getDeedItemOrderIds(items: DecryptedDeedItem[]): string[] {
  return items.map((item) => item.deed_item_id);
}

export function hasDeedOrderChanged(
  items: DecryptedDeedItem[],
  savedOrderIds: string[]
): boolean {
  if (items.length !== savedOrderIds.length) return true;
  return items.some((item, index) => item.deed_item_id !== savedOrderIds[index]);
}

export function toDeedItemsDisplayOrderPayload(
  items: DecryptedDeedItem[]
): number[] {
  return items.map((item) => Number(item.deed_item_id));
}
