import { useMutation } from "@tanstack/react-query";
import { getOrCreateAnonymousId } from "@/utils/visitor";
import { submitVisitorEmail, submitVisitorMessage, trackVisitor } from "@/apis/visitors";
import type { SubmitVisitorEmailPayload, SubmitVisitorMessagePayload, TrackVisitorPayload } from "@/interfaces/visitors";

export function useTrackVisitor() {
  return useMutation<void, Error, TrackVisitorPayload>({
    mutationFn: trackVisitor
  });
}

export function useSubmitVisitorEmail() {
  return useMutation<void, Error, SubmitVisitorEmailPayload>({
    mutationFn: (payload) =>
      submitVisitorEmail({
        ...payload,
        anonymous_id: getOrCreateAnonymousId()
      })
  });
}

export function useSubmitVisitorMessage() {
  return useMutation<void, Error, SubmitVisitorMessagePayload>({
    mutationFn: (payload) =>
      submitVisitorMessage({
        ...payload,
        anonymous_id: getOrCreateAnonymousId()
      })
  });
}