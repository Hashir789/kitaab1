import type { deviceType } from "@/constants/enums";

export interface TrackVisitorPayload {
  clicks?: number;
  timezone: string;
  navigations?: number;
  anonymous_id: string;
  device_type: deviceType;
}

export interface SubmitVisitorEmailPayload {
  email: string;
}

export interface VisitorEmailRequest extends SubmitVisitorEmailPayload {
  anonymous_id: string;
}

export interface SubmitVisitorMessagePayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface VisitorMessageRequest extends SubmitVisitorMessagePayload {
  anonymous_id: string;
}