import { getAuthToken } from '@/features/auth/services/auth-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

if (!API_BASE_URL) {
  throw new Error('Missing environment variable EXPO_PUBLIC_API_BASE_URL');
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export type ApiVersion = 'v1' | 'v2';

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  version?: ApiVersion;
  auth?: boolean;
}

interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown;
}

function buildUrl(path: string, version: ApiVersion = 'v1'): string {
  const normalized = path.replace(/^\/+/, '');
  return `${API_BASE_URL}/api/${version}/${normalized}`;
}

async function buildHeaders(options?: ApiRequestOptions): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...((options?.headers as Record<string, string>) ?? {}),
  };

  const shouldAuthenticate = options?.auth ?? true;

  if (shouldAuthenticate) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
  }

  if (options?.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const version = options.version ?? 'v1';
  const url = buildUrl(path, version);
  const method = options.method?.toUpperCase() ?? 'GET';
  const headers = await buildHeaders(options);
  const body = options.body instanceof FormData ? options.body : options.body != null ? JSON.stringify(options.body) : undefined;

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    body,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const errorResponse = data as ApiErrorResponse;
    throw new ApiError(response.status, errorResponse?.message || response.statusText, data);
  }

  return data as T;
}
