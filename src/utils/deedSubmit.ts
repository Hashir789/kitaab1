import { createDeedItem, getDeedItems, normalizeDeedItems, updateDeedItem, updateDeedItemsDisplayOrder } from "@/apis/deeds";
import { deedType, deedVisibility } from "@/constants/enums";
import type {
  CreateDeedItemPayload,
  CreateDeedItemResponse,
  DecryptedDeedItem,
  DeedFormItem,
  UpdateDeedItemPayload,
} from "@/interfaces/deeds";
import { encryptText } from "@/utils/crypto";
import { decryptDeedItem, findDeedItemById } from "@/utils/deeds";
import type { PendingScaleDeed } from "@/utils/session";
import {
  collectDeedDetailDisplayOrderUpdates,
  findDeedDetailItemById,
  isDeedDetailContentChanged,
  isUnsavedDeedDetailItem,
} from "@/utils/deedDetail";

async function buildDeedItemPayload(
  item: DeedFormItem,
  masterKey: string
): Promise<CreateDeedItemPayload> {
  const description = item.description.trim();
  const payload: CreateDeedItemPayload = {
    name: await encryptText(masterKey, item.name.trim()),
    display_order: item.displayOrder,
    hide_type: item.visibility,
  };

  if (description) {
    payload.description = await encryptText(masterKey, description);
  }

  if (item.children.length > 0) {
    payload.children = await Promise.all(
      item.children.map((child) => buildDeedItemPayload(child, masterKey))
    );
  }

  return payload;
}

export async function submitDeedFormTree(
  type: deedType,
  root: DeedFormItem,
  masterKey: string
): Promise<CreateDeedItemResponse | undefined> {
  const payload = await buildDeedItemPayload(root, masterKey);
  return createDeedItem(type, payload);
}

export async function resolveCreatedDeedIds(
  type: deedType,
  root: DeedFormItem,
  response: CreateDeedItemResponse | undefined
): Promise<PendingScaleDeed> {
  if (response?.deed_item_id) {
    return {
      deedItemId: response.deed_item_id,
      categoryType: type,
      displayOrder: root.displayOrder,
      ...(response.deed_id ? { deedId: response.deed_id } : {}),
    };
  }

  const items = normalizeDeedItems(await getDeedItems(type));
  const rootMatch = items.find((item) => item.display_order === root.displayOrder);

  if (rootMatch?.deed_item_id) {
    return {
      deedItemId: rootMatch.deed_item_id,
      categoryType: type,
      displayOrder: root.displayOrder,
      ...(rootMatch.deed_id ? { deedId: rootMatch.deed_id } : {}),
    };
  }

  return {
    categoryType: type,
    displayOrder: root.displayOrder,
  };
}

export async function resolveScaleDeedItemId(pending: PendingScaleDeed): Promise<string> {
  if (pending.deedItemId) {
    return pending.deedItemId;
  }

  const items = normalizeDeedItems(await getDeedItems(pending.categoryType));
  const rootMatch = items.find((item) => item.display_order === pending.displayOrder);

  if (rootMatch?.deed_item_id) {
    return rootMatch.deed_item_id;
  }

  throw new Error("Could not find deed item for scale setup.");
}

async function buildEncryptedDeedItemUpdatePayload(
  item: DecryptedDeedItem,
  masterKey: string
): Promise<UpdateDeedItemPayload> {
  const description = (item.description ?? "").trim();

  return {
    name: await encryptText(masterKey, item.name.trim()),
    description: await encryptText(masterKey, description),
    hide_type: item.hide_type as deedVisibility,
  };
}

async function buildEncryptedDeedItemCreatePayload(
  item: DecryptedDeedItem,
  masterKey: string
): Promise<CreateDeedItemPayload> {
  const description = (item.description ?? "").trim();
  const payload: CreateDeedItemPayload = {
    name: await encryptText(masterKey, item.name.trim()),
    display_order: item.display_order,
    hide_type: item.hide_type as deedVisibility,
  };

  if (description) {
    payload.description = await encryptText(masterKey, description);
  }

  return payload;
}

export async function submitDeedDetailItemUpdate(
  type: deedType,
  item: DecryptedDeedItem,
  masterKey: string
): Promise<void> {
  const payload = await buildEncryptedDeedItemUpdatePayload(item, masterKey);
  await updateDeedItem(type, item.deed_item_id, payload);
}

export async function submitDeedDetailItemCreate(
  type: deedType,
  item: DecryptedDeedItem,
  parentDeedItemId: string,
  masterKey: string
): Promise<CreateDeedItemResponse | undefined> {
  const payload: CreateDeedItemPayload = {
    ...(await buildEncryptedDeedItemCreatePayload(item, masterKey)),
    parent_deed_item_id: parentDeedItemId,
  };

  return createDeedItem(type, payload);
}

async function resolveCreatedDeedDetailItem(
  type: deedType,
  item: DecryptedDeedItem,
  parentDeedItemId: string,
  savedRoot: DecryptedDeedItem,
  masterKey: string
): Promise<DecryptedDeedItem> {
  const items = normalizeDeedItems(await getDeedItems(type));
  const parentApi = findDeedItemById(items, parentDeedItemId);

  if (!parentApi) {
    throw new Error("Parent deed item not found after create.");
  }

  const savedParent = findDeedDetailItemById(savedRoot, parentDeedItemId);
  const savedChildIds = new Set(
    (savedParent?.children ?? []).map((child) => child.deed_item_id)
  );

  const apiChild = (parentApi.children ?? []).find(
    (child) =>
      !savedChildIds.has(String(child.deed_item_id)) &&
      child.display_order === item.display_order
  );

  if (!apiChild) {
    throw new Error("Created deed item could not be resolved.");
  }

  return decryptDeedItem(apiChild, masterKey);
}

async function persistDeedDetailItem(
  type: deedType,
  item: DecryptedDeedItem,
  savedItem: DecryptedDeedItem | undefined,
  savedRoot: DecryptedDeedItem,
  parentDeedItemId: string | null,
  masterKey: string
): Promise<DecryptedDeedItem> {
  if (isUnsavedDeedDetailItem(item.deed_item_id)) {
    if (!parentDeedItemId) {
      throw new Error("Cannot create deed item without a parent.");
    }

    const response = await submitDeedDetailItemCreate(
      type,
      item,
      parentDeedItemId,
      masterKey
    );

    if (response?.deed_item_id) {
      return {
        ...item,
        deed_item_id: response.deed_item_id,
        parent_deed_item_id: parentDeedItemId,
        ...(response.deed_id ? { deed_id: response.deed_id } : {}),
      };
    }

    return resolveCreatedDeedDetailItem(
      type,
      item,
      parentDeedItemId,
      savedRoot,
      masterKey
    );
  }
  if (savedItem && isDeedDetailContentChanged(item, savedItem)) {
    await submitDeedDetailItemUpdate(type, item, masterKey);
  }

  return item;
}

async function persistDeedDetailTree(
  type: deedType,
  current: DecryptedDeedItem,
  saved: DecryptedDeedItem | undefined,
  savedRoot: DecryptedDeedItem,
  parentDeedItemId: string | null,
  masterKey: string
): Promise<DecryptedDeedItem> {
  const persistedItem = await persistDeedDetailItem(
    type,
    current,
    saved,
    savedRoot,
    parentDeedItemId,
    masterKey
  );
  const savedChildren = saved?.children ?? [];
  const children = current.children ?? [];

  if (!children.length) {
    return {
      ...persistedItem,
      children: undefined,
    };
  }

  const nextChildren = await Promise.all(
    children.map((child) => {
      const savedChild = savedChildren.find(
        (entry) => entry.deed_item_id === child.deed_item_id
      );

      return persistDeedDetailTree(
        type,
        child,
        savedChild,
        savedRoot,
        persistedItem.deed_item_id,
        masterKey
      );
    })
  );

  return {
    ...persistedItem,
    children: nextChildren,
  };
}

export async function submitDeedDetailTree(
  type: deedType,
  current: DecryptedDeedItem,
  saved: DecryptedDeedItem,
  masterKey: string
): Promise<DecryptedDeedItem> {
  const persisted = await persistDeedDetailTree(type, current, saved, saved, null, masterKey);
  const displayOrderUpdates = collectDeedDetailDisplayOrderUpdates(persisted, saved);

  for (const payload of displayOrderUpdates) {
    await updateDeedItemsDisplayOrder(type, payload);
  }

  return persisted;
}