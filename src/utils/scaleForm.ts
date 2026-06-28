import type { CreateScaleItemPayload, ScaleFormItem } from "@/interfaces/scales";
import { encryptText } from "@/utils/crypto";
import {
  validateDeedDescription,
  validateDeedName,
  validateDeedNameUniquenessAmongSiblings,
} from "@/utils/deedFormValidation";

export function createEmptyScaleFormItem(displayOrder = 1): ScaleFormItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    displayOrder,
  };
}

export function validateScaleFormItems(items: ScaleFormItem[]): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!items.length) {
    errors.root = "At least one scale item is required.";
    return errors;
  }

  items.forEach((item, index) => {
    const key = String(index);
    const nameError = validateDeedName(item.name);

    if (nameError) {
      errors[`${key}-name`] = nameError;
      return;
    }

    const duplicateError = validateDeedNameUniquenessAmongSiblings(
      item.name,
      items.map((entry) => ({ id: entry.id, name: entry.name })),
      item.id
    );

    if (duplicateError) {
      errors[`${key}-name`] = duplicateError;
      return;
    }

    const descriptionError = validateDeedDescription(item.description);
    if (descriptionError) {
      errors[`${key}-description`] = descriptionError;
    }
  });

  return errors;
}

export async function buildEncryptedScaleItemsPayload(
  items: ScaleFormItem[],
  masterKey: string
): Promise<CreateScaleItemPayload[]> {
  return Promise.all(
    items.map(async (item) => {
      const description = item.description.trim();
      const payload: CreateScaleItemPayload = {
        name: await encryptText(masterKey, item.name.trim()),
        display_order: item.displayOrder,
      };

      if (description) {
        payload.description = await encryptText(masterKey, description);
      }

      return payload;
    })
  );
}
