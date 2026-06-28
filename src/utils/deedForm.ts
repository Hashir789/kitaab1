import { deedFormLevel, deedMeasurementType, deedType, deedVisibility } from "@/constants/enums";
import type { DeedFormItem, DeedFormPath } from "@/interfaces/deeds";
import {
  validateDeedDescription,
  validateDeedName,
  validateDeedNameUniquenessAmongNames,
  validateDeedNameUniquenessAmongSiblings,
} from "@/utils/deedFormValidation";
export const MAX_DEED_FORM_DEPTH = deedFormLevel.SUB_SUB + 1;

type CreateEmptyDeedFormItemOptions = {
  categoryType?: deedType;
  measurementType?: deedMeasurementType;
};

export function createEmptyDeedFormItem(
  displayOrder = 1,
  options: CreateEmptyDeedFormItemOptions = {}
): DeedFormItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    displayOrder,
    visibility: deedVisibility.BOTH,
    categoryType: options.categoryType ?? deedType.HASANAAT,
    measurementType: options.measurementType ?? deedMeasurementType.COUNT,
    children: [],
  };
}

export function getDisplayOrderOptions(maxOrder: number) {
  const safeMax = Math.max(1, maxOrder);
  return Array.from({ length: safeMax }, (_, index) => {
    const value = index + 1;
    return { value, label: String(value) };
  });
}

export function getDeedFormLevel(path: DeedFormPath): deedFormLevel {
  return path.length as deedFormLevel;
}

export function canAddChildDeed(path: DeedFormPath): boolean {
  return path.length < deedFormLevel.SUB_SUB;
}

function cloneDeedFormItem(item: DeedFormItem): DeedFormItem {
  return {
    ...item,
    children: item.children.map(cloneDeedFormItem),
  };
}

function updateItemAtPath(
  item: DeedFormItem,
  path: DeedFormPath,
  updater: (current: DeedFormItem) => DeedFormItem
): DeedFormItem {
  if (path.length === 0) {
    return updater(item);
  }

  const [index, ...rest] = path;

  return {
    ...item,
    children: item.children.map((child, childIndex) =>
      childIndex === index ? updateItemAtPath(child, rest, updater) : child
    ),
  };
}

export function updateDeedFormTree(
  root: DeedFormItem,
  path: DeedFormPath,
  updater: (current: DeedFormItem) => DeedFormItem
): DeedFormItem {
  return updateItemAtPath(cloneDeedFormItem(root), path, updater);
}

export function addChildDeedFormItem(root: DeedFormItem, path: DeedFormPath): DeedFormItem {
  return updateDeedFormTree(root, path, (current) => ({
    ...current,
    children: [
      ...current.children,
      createEmptyDeedFormItem(Math.max(1, current.children.length + 1), {
        categoryType: current.categoryType,
      }),
    ],
  }));
}

type ValidateDeedFormTreeOptions = {
  existingRootSiblingNames?: string[];
};

export function validateDeedFormTree(
  root: DeedFormItem,
  options: ValidateDeedFormTreeOptions = {}
): Record<string, string> {
  const { existingRootSiblingNames = [] } = options;
  const errors: Record<string, string> = {};

  function walk(
    item: DeedFormItem,
    path: DeedFormPath,
    siblings: DeedFormItem[],
    isRoot: boolean
  ) {
    const key = pathToFieldKey(path);
    const nameError = validateDeedName(item.name);

    if (nameError) {
      errors[`${key}-name`] = nameError;
    } else if (isRoot) {
      const duplicateError = validateDeedNameUniquenessAmongNames(
        item.name,
        existingRootSiblingNames
      );

      if (duplicateError) {
        errors[`${key}-name`] = duplicateError;
      }
    } else {
      const duplicateError = validateDeedNameUniquenessAmongSiblings(
        item.name,
        siblings,
        item.id
      );

      if (duplicateError) {
        errors[`${key}-name`] = duplicateError;
      }
    }

    const descriptionError = validateDeedDescription(item.description);

    if (descriptionError) {
      errors[`${key}-description`] = descriptionError;
    }

    item.children.forEach((child, index) => {
      walk(child, [...path, index], item.children, false);
    });
  }

  walk(root, [], [], true);
  return errors;
}

export function pathToFieldKey(path: DeedFormPath): string {
  return path.join("-") || "root";
}

export function getItemAtPath(root: DeedFormItem, path: DeedFormPath): DeedFormItem {
  return path.reduce<DeedFormItem>((current, index) => current.children[index], root);
}

export function fieldKeyToPath(key: string): DeedFormPath {
  if (!key || key === "root") {
    return [];
  }

  return key.split("-").map(Number);
}

export function isDeedFormItemContentEmpty(item: DeedFormItem): boolean {
  return !item.name.trim() && !item.description.trim();
}

export function removeEmptyDeedAtPathKey(root: DeedFormItem, key: string): DeedFormItem {
  if (!key || key === "root") {
    return root;
  }

  const path = fieldKeyToPath(key);
  const item = getItemAtPath(root, path);

  if (!isDeedFormItemContentEmpty(item) || path.length === 0) {
    return root;
  }

  return removeDeedAtPath(root, path);
}

export function removeDeedAtPath(root: DeedFormItem, path: DeedFormPath): DeedFormItem {
  if (path.length === 0) {
    return root;
  }

  const parentPath = path.slice(0, -1);
  const childIndex = path[path.length - 1];

  return updateDeedFormTree(root, parentPath, (current) => ({
    ...current,
    children: reindexChildrenDisplayOrder(
      current.children.filter((_, index) => index !== childIndex)
    ),
  }));
}

function reindexChildrenDisplayOrder(children: DeedFormItem[]): DeedFormItem[] {
  return children.map((child, index) => ({
    ...child,
    displayOrder: index + 1,
  }));
}

export function canMoveDeedUp(path: DeedFormPath): boolean {
  return path.length > 0 && path[path.length - 1] > 0;
}

export function canMoveDeedDown(path: DeedFormPath, siblingCount: number): boolean {
  return path.length > 0 && path[path.length - 1] < siblingCount - 1;
}

export function remapPathKeyAfterSiblingSwap(
  key: string,
  parentPath: DeedFormPath,
  indexA: number,
  indexB: number
): string {
  if (!key || key === "root") {
    return key;
  }

  const path = fieldKeyToPath(key);
  const level = parentPath.length;

  if (path.length <= level) {
    return key;
  }

  const siblingIndex = path[level];

  if (siblingIndex !== indexA && siblingIndex !== indexB) {
    return key;
  }

  const nextPath = [...path];
  nextPath[level] = siblingIndex === indexA ? indexB : indexA;
  return pathToFieldKey(nextPath);
}

export function moveDeedAtPath(
  root: DeedFormItem,
  path: DeedFormPath,
  direction: "up" | "down"
): DeedFormItem {
  if (path.length === 0) {
    return root;
  }

  const childIndex = path[path.length - 1];
  const parentPath = path.slice(0, -1);
  const swapIndex = direction === "up" ? childIndex - 1 : childIndex + 1;
  const parent = getItemAtPath(root, parentPath);

  if (swapIndex < 0 || swapIndex >= parent.children.length) {
    return root;
  }

  return updateDeedFormTree(root, parentPath, (current) => {
    const children = [...current.children];
    [children[childIndex], children[swapIndex]] = [children[swapIndex], children[childIndex]];

    return {
      ...current,
      children: reindexChildrenDisplayOrder(children),
    };
  });
}
