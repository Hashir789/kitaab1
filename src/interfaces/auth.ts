export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginRequest extends LoginPayload {
  anonymous_id: string;
}

export interface LoginResponse {
  access_token: string;
  two_factor_enabled: boolean;
}

export interface Update2faPayload {
  two_factor_enabled: boolean;
}

export interface Update2faResponse {
  two_factor_enabled: boolean;
}