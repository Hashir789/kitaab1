import { deedMeasurementType, deedType, deedVisibility } from "@/constants/enums";
import { deedsFormValidation } from "@/constants/placeholders";
import type { DeedFormItem, DecryptedDeedItem } from "@/interfaces/deeds";

const MIN_NAME_LENGTH = 2;
const MIN_DESCRIPTION_LENGTH = 2;

function normalizeDeedNameForComparison(name: string): string {
  return name.trim().toLowerCase();
}

export function validateDeedName(name: string): string | undefined {
  const trimmed = name.trim();

  if (!trimmed) {
    return deedsFormValidation.NAME_REQUIRED;
  }

  if (trimmed.length < MIN_NAME_LENGTH) {
    return deedsFormValidation.NAME_MIN_LENGTH;
  }

  return undefined;
}

export function validateDeedNameUniquenessAmongSiblings(
  name: string,
  siblings: Array<{ id: string; name: string }>,
  currentItemId: string
): string | undefined {
  const normalized = normalizeDeedNameForComparison(name);

  if (!normalized) {
    return undefined;
  }

  const hasDuplicate = siblings.some(
    (sibling) =>
      sibling.id !== currentItemId &&
      normalizeDeedNameForComparison(sibling.name) === normalized
  );

  if (hasDuplicate) {
    return deedsFormValidation.NAME_DUPLICATE;
  }

  return undefined;
}

export function validateDeedNameUniquenessAmongNames(
  name: string,
  existingNames: string[]
): string | undefined {
  const normalized = normalizeDeedNameForComparison(name);

  if (!normalized) {
    return undefined;
  }

  const hasDuplicate = existingNames.some(
    (existingName) => normalizeDeedNameForComparison(existingName) === normalized
  );

  if (hasDuplicate) {
    return deedsFormValidation.NAME_DUPLICATE;
  }

  return undefined;
}

export function validateDeedDescription(description: string): string | undefined {
  const trimmed = description.trim();

  if (!trimmed) {
    return undefined;
  }

  if (trimmed.length < MIN_DESCRIPTION_LENGTH) {
    return deedsFormValidation.DESCRIPTION_MIN_LENGTH;
  }

  return undefined;
}

export function canAddChildDeedToItem(item: DeedFormItem): boolean {
  return !validateDeedName(item.name);
}

export function isDeedFormSectionComplete(item: DeedFormItem): boolean {
  if (validateDeedName(item.name)) {
    return false;
  }

  if (validateDeedDescription(item.description)) {
    return false;
  }

  if (!item.displayOrder || item.displayOrder < 1) {
    return false;
  }

  if (!Object.values(deedVisibility).includes(item.visibility)) {
    return false;
  }

  if (!Object.values(deedType).includes(item.categoryType)) {
    return false;
  }

  if (!Object.values(deedMeasurementType).includes(item.measurementType)) {
    return false;
  }

  return true;
}

export function validateDecryptedDeedItem(
  item: DecryptedDeedItem,
  siblings: DecryptedDeedItem[] = []
): string | undefined {
  const nameError = validateDeedName(item.name);
  if (nameError) {
    return nameError;
  }

  const duplicateError = validateDeedNameUniquenessAmongSiblings(
    item.name,
    siblings.map((sibling) => ({ id: sibling.deed_item_id, name: sibling.name })),
    item.deed_item_id
  );
  if (duplicateError) {
    return duplicateError;
  }

  return validateDeedDescription(item.description ?? "");
}

export function validateDeedDetailTree(
  root: DecryptedDeedItem,
  existingRootSiblingNames: string[] = []
): string | undefined {
  function walk(
    item: DecryptedDeedItem,
    siblings: DecryptedDeedItem[],
    isRoot: boolean
  ): string | undefined {
    const validationError = isRoot
      ? validateDeedName(item.name) ??
        validateDeedNameUniquenessAmongNames(item.name, existingRootSiblingNames) ??
        validateDeedDescription(item.description ?? "")
      : validateDecryptedDeedItem(item, siblings);

    if (validationError) {
      return validationError;
    }

    for (const child of item.children ?? []) {
      const childError = walk(child, item.children ?? [], false);
      if (childError) {
        return childError;
      }
    }

    return undefined;
  }

  return walk(root, [], true);
}
