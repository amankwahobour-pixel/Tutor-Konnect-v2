import { apiFetch } from '@/services/api';
import { ApiResponse, UserProfile } from '@/types';
import { removeAuthToken, saveAuthToken, saveAuthUser } from './auth-storage';

export interface AuthTokenData {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  expires_at?: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string | null;
  refreshToken?: string | null;
  session?: AuthTokenData | null;
  user?: UserProfile | null;
  email?: string;
  data?: unknown;
}

function normalizeUser(user: any): UserProfile {
  return {
    id: user.id,
    phone_number: user.phone ?? '',
    email: user.email ?? undefined,
    role: user.role ?? '',
    full_name: user.user_metadata?.full_name ?? user.full_name ?? undefined,
    profile_photo: user.user_metadata?.avatar_url ?? user.avatar_url ?? undefined,
    created_at: user.created_at ?? new Date().toISOString(),
    updated_at: user.updated_at ?? new Date().toISOString(),
  };
}

function extractTokenData(payload: any): AuthTokenData | null {
  if (!payload) {
    return null;
  }

  if (typeof payload === 'string') {
    return { access_token: payload };
  }

  if (payload.access_token) {
    return {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      token_type: payload.token_type,
      expires_in: payload.expires_in,
      expires_at: payload.expires_at,
    };
  }

  if (payload.token && typeof payload.token === 'object') {
    return extractTokenData(payload.token);
  }

  if (payload.session && typeof payload.session === 'object') {
    return extractTokenData(payload.session);
  }

  return null;
}

async function persistAuthData(response: AuthResponse): Promise<void> {
  if (response.session?.access_token) {
    await saveAuthToken(response.session.access_token);
  } else if (response.token) {
    await saveAuthToken(response.token);
  }

  if (response.user) {
    await saveAuthUser(response.user);
  }
}

export type LoginPayload = {
  email?: string;
  password?: string;
  phone?: string;
  otp?: string;
};

export async function loginWithEmail(payload: { email: string; password: string }): Promise<AuthResponse> {
  const response = await apiFetch<ApiResponse<any>>('auth/login', {
    method: 'POST',
    body: payload,
    version: 'v2',
    auth: false,
  });

  const session = extractTokenData(response.data);
  const user = response.data?.user ? normalizeUser(response.data.user) : null;
  const authResponse: AuthResponse = {
    success: response.success ?? true,
    message: response.message,
    token: session?.access_token ?? null,
    refreshToken: session?.refresh_token ?? null,
    session,
    user,
    data: response.data,
  };

  if (session) {
    await persistAuthData(authResponse);
  }

  return authResponse;
}

export async function loginWithPhone(payload: { phone: string }): Promise<AuthResponse> {
  const response = await apiFetch<ApiResponse<any>>('auth/login', {
    method: 'POST',
    body: payload,
    version: 'v1',
    auth: false,
  });

  return {
    success: response.success ?? true,
    message: response.message,
    data: response.data,
  };
}

export async function signUpWithEmail(payload: { email: string; password: string; phone?: string; name?: string }): Promise<AuthResponse> {
  const response = await apiFetch<ApiResponse<any>>('auth/signup', {
    method: 'POST',
    body: payload,
    version: 'v1',
    auth: false,
  });

  const session = extractTokenData(response.data);
  const user = response.data?.user ? normalizeUser(response.data.user) : null;
  const authResponse: AuthResponse = {
    success: response.success ?? true,
    message: response.message,
    token: session?.access_token ?? null,
    refreshToken: session?.refresh_token ?? null,
    session,
    user,
    email: payload.email,
    data: response.data,
  };

  if (session) {
    await persistAuthData(authResponse);
  }

  return authResponse;
}

export async function resendEmailVerification(email: string): Promise<AuthResponse> {
  const response = await apiFetch<ApiResponse<any>>('auth/resend-email-verification', {
    method: 'POST',
    body: { email },
    version: 'v1',
    auth: false,
  });

  return {
    success: response.success ?? true,
    message: response.message,
    email,
    data: response.data,
  };
}

export async function verifyPhoneOtp(payload: { phone: string; otp: string }): Promise<AuthResponse> {
  const response = await apiFetch<ApiResponse<any>>('auth/verify-phone', {
    method: 'POST',
    body: { phoneNumber: payload.phone, token: payload.otp },
    version: 'v1',
    auth: false,
  });

  const session = extractTokenData(response.data);
  const user = response.data?.user ? normalizeUser(response.data.user) : null;
  const authResponse: AuthResponse = {
    success: response.success ?? true,
    message: response.message,
    token: session?.access_token ?? null,
    refreshToken: session?.refresh_token ?? null,
    session,
    user,
    data: response.data,
  };

  if (session) {
    await persistAuthData(authResponse);
  }

  return authResponse;
}

export async function logout(): Promise<void> {
  await apiFetch<ApiResponse<any>>('auth/logout', {
    method: 'POST',
    version: 'v1',
    auth: true,
  });
  await removeAuthToken();
}
