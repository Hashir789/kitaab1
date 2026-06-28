import { useQuery } from "@tanstack/react-query";
import { getScaleItems, normalizeScaleItems } from "@/apis/scales";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { DecryptedScaleItem } from "@/interfaces/scales";
import { decryptScaleItems } from "@/utils/scales";
import { getMasterKey } from "@/utils/session";

export function useScaleItems(deedItemId: string, enabled = true) {
  return useQuery<DecryptedScaleItem[], Error>({
    queryKey: QUERY_KEYS.SCALES.ITEMS(deedItemId),
    queryFn: async () => {
      const items = normalizeScaleItems(await getScaleItems(deedItemId));
      return decryptScaleItems(items, getMasterKey());
    },
    enabled: enabled && Boolean(deedItemId),
    staleTime: 30_000,
    retry: false,
  });
}
