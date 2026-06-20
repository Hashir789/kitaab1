import { useMutation } from "@tanstack/react-query";
import { createHasanaatItem } from "@/apis/deeds";
import type { CreateHasanaatItemPayload, CreateHasanaatItemResponse } from "@/interfaces/deeds";

export function useCreateHasanaatItem() {
  return useMutation<CreateHasanaatItemResponse, Error, CreateHasanaatItemPayload>({
    mutationFn: (payload) => createHasanaatItem(payload),
  });
}