import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDeedItem,
  deleteDeedItem,
  getDeedItems,
  normalizeDeedItems,
  updateDeedItem,
  updateDeedItemsDisplayOrder,
} from "@/apis/deeds";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { deedType } from "@/constants/enums";
import type {
  CreateDeedItemPayload,
  CreateDeedItemResponse,
  DeedItem,
  UpdateDeedItemPayload,
  UpdateDeedItemsDisplayOrderPayload,
} from "@/interfaces/deeds";
import { findDeedItemById } from "@/utils/deeds";

export function useDeedItems(type: deedType, enabled = true) {
  return useQuery<DeedItem[], Error>({
    queryKey: QUERY_KEYS.DEEDS.ITEMS(type),
    queryFn: async () => normalizeDeedItems(await getDeedItems(type)),
    enabled,
    staleTime: 30_000,
    retry: false,
  });
}

export function useDeedItem(type: deedType, deedItemId: string, enabled = true) {
  const query = useDeedItems(type, enabled && Boolean(deedItemId));

  return {
    ...query,
    item: query.data ? findDeedItemById(query.data, deedItemId) : undefined,
  };
}

export function useCreateDeedItem(type: deedType) {
  const queryClient = useQueryClient();

  return useMutation<CreateDeedItemResponse, Error, CreateDeedItemPayload>({
    mutationFn: (payload) => createDeedItem(type, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEEDS.ITEMS(type) });
    },
  });
}

export function useCreateHasanaatItem() {
  return useCreateDeedItem(deedType.HASANAAT);
}

export function useUpdateDeedItemsDisplayOrder(type: deedType) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateDeedItemsDisplayOrderPayload>({
    mutationFn: (payload) => updateDeedItemsDisplayOrder(type, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEEDS.ITEMS(type) });
    },
  });
}

export function useDeleteDeedItem(type: deedType) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (deedItemId) => deleteDeedItem(type, deedItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEEDS.ITEMS(type) });
    },
  });
}

export function useUpdateDeedItem(type: deedType) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { deedItemId: string; payload: UpdateDeedItemPayload }>({
    mutationFn: ({ deedItemId, payload }) => updateDeedItem(type, deedItemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEEDS.ITEMS(type) });
    },
  });
}
