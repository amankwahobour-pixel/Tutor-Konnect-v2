import { router } from 'expo-router';

// Minimal navigation helpers to centralize unsafe casts required by Expo Router
export function pushPath(path: string) {
  // Expo Router's push typing is narrow; cast in this helper to minimize spread of 'any' casts.
  router.push(path as any);
}

export function buildChatRoute(otherId: string) {
  return `/chat?otherId=${encodeURIComponent(otherId)}`;
}

export function buildQueryRoute(base: string, params?: Record<string, any>) {
  if (!params) return base;
  const parts: string[] = [];
  for (const k of Object.keys(params)) {
    const v = params[k];
    if (v === undefined || v === null) continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `${base}?${parts.join('&')}` : base;
}
