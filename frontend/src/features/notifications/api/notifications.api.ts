import { apiFetch, ApiRequestOptions } from '@/services/api';

export interface NotificationItem {
  id: string;
  user_id?: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read?: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  success?: boolean;
  data?: NotificationItem[];
  message?: string;
}

export async function getNotifications(userId: string, options?: ApiRequestOptions) {
  // TODO: confirm backend endpoint. Assuming GET /notifications/user/:userId
  return apiFetch<NotificationsResponse>(`/notifications/user/${userId}`, { method: 'GET', ...options });
}

export async function markNotificationRead(id: string, options?: ApiRequestOptions) {
  // TODO: confirm backend endpoint. Assuming POST /notifications/:id/read
  return apiFetch<{ success: boolean }>(`/notifications/${id}/read`, { method: 'POST', ...options });
}

export async function markAllRead(userId: string, options?: ApiRequestOptions) {
  // TODO: confirm backend endpoint. Assuming POST /notifications/user/:userId/read
  return apiFetch<{ success: boolean }>(`/notifications/user/${userId}/read`, { method: 'POST', ...options });
}
