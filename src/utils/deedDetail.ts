import type { DecryptedDeedItem, DeedFormPath, UpdateDeedItemsDisplayOrderPayload } from "@/interfaces/deeds";
import { deedVisibility } from "@/constants/enums";

function cloneDeedDetailItem(item: DecryptedDeedItem): DecryptedDeedItem {
  return {
    ...item,
    children: item.children?.map(cloneDeedDetailItem),
  };
}

export function cloneDeedDetailTree(item: DecryptedDeedItem): DecryptedDeedItem {
  return cloneDeedDetailItem(item);
}

export function findDeedDetailItemById(
  root: DecryptedDeedItem,
  deedItemId: string
): DecryptedDeedItem | undefined {
  if (root.deed_item_id === deedItemId) {
    return root;
  }

  for (const child of root.children ?? []) {
    const match = findDeedDetailItemById(child, deedItemId);
    if (match) {
      return match;
    }
  }

  return undefined;
}

function normalizeDeedDetailDescription(value?: string): string {
  return (value ?? "").trim();
}

export function isDeedDetailContentChanged(
  current: DecryptedDeedItem,
  saved: DecryptedDeedItem
): boolean {
  return (
    current.name !== saved.name ||
    normalizeDeedDetailDescription(current.description) !==
      normalizeDeedDetailDescription(saved.description) ||
    current.hide_type !== saved.hide_type
  );
}

export function isDeedDetailItemChanged(
  current: DecryptedDeedItem,
  saved: DecryptedDeedItem
): boolean {
  return (
    current.name !== saved.name ||
    normalizeDeedDetailDescription(current.description) !==
      normalizeDeedDetailDescription(saved.description) ||
    current.hide_type !== saved.hide_type ||
    current.display_order !== saved.display_order
  );
}

export function isDeedDetailTreeDirty(
  current: DecryptedDeedItem,
  saved: DecryptedDeedItem
): boolean {
  if (isUnsavedDeedDetailItem(current.deed_item_id)) {
    return true;
  }

  if (isDeedDetailItemChanged(current, saved)) {
    return true;
  }

  const currentChildren = current.children ?? [];
  const savedChildren = saved.children ?? [];

  if (currentChildren.length !== savedChildren.length) {
    return true;
  }

  for (const currentChild of currentChildren) {
    if (isUnsavedDeedDetailItem(currentChild.deed_item_id)) {
      return true;
    }

    const savedChild = savedChildren.find(
      (child) => child.deed_item_id === currentChild.deed_item_id
    );

    if (!savedChild) {
      return true;
    }

    if (isDeedDetailTreeDirty(currentChild, savedChild)) {
      return true;
    }
  }

  return false;
}

export function collectDeedDetailDisplayOrderUpdates(
  current: DecryptedDeedItem,
  saved: DecryptedDeedItem
): UpdateDeedItemsDisplayOrderPayload[] {
  const updates: UpdateDeedItemsDisplayOrderPayload[] = [];

  function walk(
    currentNode: DecryptedDeedItem,
    savedNode: DecryptedDeedItem | undefined
  ): void {
    const currentChildren = currentNode.children ?? [];
    const savedChildren = savedNode?.children ?? [];

    if (currentChildren.length > 0) {
      const currentIds = currentChildren.map((child) => child.deed_item_id);
      const savedIds = savedChildren.map((child) => child.deed_item_id);
      const orderChanged =
        currentIds.length !== savedIds.length ||
        currentIds.some((id, index) => id !== savedIds[index]);

      if (orderChanged) {
        const display_order = currentChildren
          .filter((child) => !isUnsavedDeedDetailItem(child.deed_item_id))
          .map((child) => Number(child.deed_item_id));

        if (display_order.length > 0) {
          updates.push({
            display_order,
            parent_deed_item_id: Number(currentNode.deed_item_id),
          });
        }
      }
    }

    for (const currentChild of currentChildren) {
      const savedChild = savedChildren.find(
        (child) => child.deed_item_id === currentChild.deed_item_id
      );
      walk(currentChild, savedChild);
    }
  }

  walk(current, saved);
  return updates;
}

export function sortDeedDetailTree(item: DecryptedDeedItem): DecryptedDeedItem {
  const children = item.children
    ?.map(sortDeedDetailTree)
    .sort((a, b) => a.display_order - b.display_order);

  return {
    ...item,
    children: children?.length ? children : undefined,
  };
}

export function getDeedDetailItemAtPath(
  root: DecryptedDeedItem,
  path: DeedFormPath
): DecryptedDeedItem {
  return path.reduce<DecryptedDeedItem>((current, index) => {
    const children = current.children ?? [];
    return children[index];
  }, root);
}

function updateItemAtPath(
  item: DecryptedDeedItem,
  path: DeedFormPath,
  updater: (current: DecryptedDeedItem) => DecryptedDeedItem
): DecryptedDeedItem {
  if (path.length === 0) {
    return updater(item);
  }

  const [index, ...rest] = path;
  const children = item.children ?? [];

  return {
    ...item,
    children: children.map((child, childIndex) =>
      childIndex === index ? updateItemAtPath(child, rest, updater) : child
    ),
  };
}

export function updateDeedDetailTree(
  root: DecryptedDeedItem,
  path: DeedFormPath,
  updater: (current: DecryptedDeedItem) => DecryptedDeedItem
): DecryptedDeedItem {
  return updateItemAtPath(cloneDeedDetailItem(root), path, updater);
}

function reindexChildrenDisplayOrder(children: DecryptedDeedItem[]): DecryptedDeedItem[] {
  return children.map((child, index) => ({
    ...child,
    display_order: index + 1,
  }));
}

export function removeDeedDetailAtPath(
  root: DecryptedDeedItem,
  path: DeedFormPath
): DecryptedDeedItem {
  if (path.length === 0) {
    return root;
  }

  const parentPath = path.slice(0, -1);
  const childIndex = path[path.length - 1];

  return updateDeedDetailTree(root, parentPath, (current) => {
    const children = current.children ?? [];
    const nextChildren = reindexChildrenDisplayOrder(
      children.filter((_, index) => index !== childIndex)
    );

    return {
      ...current,
      children: nextChildren.length ? nextChildren : undefined,
    };
  });
}

export function moveDeedDetailAtPath(
  root: DecryptedDeedItem,
  path: DeedFormPath,
  direction: "up" | "down"
): DecryptedDeedItem {
  if (path.length === 0) {
    return root;
  }

  const childIndex = path[path.length - 1];
  const parentPath = path.slice(0, -1);
  const parent = getDeedDetailItemAtPath(root, parentPath);
  const children = parent.children ?? [];
  const swapIndex = direction === "up" ? childIndex - 1 : childIndex + 1;

  if (swapIndex < 0 || swapIndex >= children.length) {
    return root;
  }

  return updateDeedDetailTree(root, parentPath, (current) => {
    const nextChildren = [...(current.children ?? [])];
    [nextChildren[childIndex], nextChildren[swapIndex]] = [
      nextChildren[swapIndex],
      nextChildren[childIndex],
    ];

    return {
      ...current,
      children: reindexChildrenDisplayOrder(nextChildren),
    };
  });
}

export function createEmptyDeedDetailItem(
  displayOrder: number,
  deedId: string,
  parentDeedItemId: string | null = null
): DecryptedDeedItem {
  return {
    deed_item_id: `new-${crypto.randomUUID()}`,
    deed_id: deedId,
    parent_deed_item_id: parentDeedItemId,
    name: "",
    description: "",
    display_order: displayOrder,
    hide_type: deedVisibility.BOTH,
    created_at: new Date().toISOString(),
  };
}

export function isUnsavedDeedDetailItem(deedItemId: string): boolean {
  return deedItemId.startsWith("new-");
}

export function addChildDeedDetailAtPath(
  root: DecryptedDeedItem,
  path: DeedFormPath
): DecryptedDeedItem {
  return updateDeedDetailTree(root, path, (current) => {
    const children = current.children ?? [];

    return {
      ...current,
      children: [
        ...children,
        createEmptyDeedDetailItem(children.length + 1, current.deed_id, current.deed_item_id),
      ],
    };
  });
}
