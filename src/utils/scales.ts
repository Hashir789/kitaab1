import { decryptText } from "@/utils/crypto";
import type { DecryptedScaleItem, ScaleItem } from "@/interfaces/scales";

async function tryDecryptValue(masterKey: string | null, value: string): Promise<string> {
  if (!masterKey) {
    return value;
  }

  try {
    return await decryptText(masterKey, value);
  } catch {
    return value;
  }
}

export async function decryptScaleItem(
  item: ScaleItem,
  masterKey: string | null
): Promise<DecryptedScaleItem> {
  const name = await tryDecryptValue(masterKey, item.name);
  const description = item.description
    ? await tryDecryptValue(masterKey, item.description)
    : undefined;

  return {
    scale_item_id: item.scale_item_id,
    name,
    description,
    display_order: item.display_order,
  };
}

export async function decryptScaleItems(
  items: ScaleItem[],
  masterKey: string | null
): Promise<DecryptedScaleItem[]> {
  return Promise.all(items.map((item) => decryptScaleItem(item, masterKey)));
}
