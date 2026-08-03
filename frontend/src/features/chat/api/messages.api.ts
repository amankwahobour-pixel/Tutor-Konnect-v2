import { apiFetch, ApiRequestOptions } from '@/services/api';
import type { Message } from '@/features/chat/types';

export interface SendMessageRequest {
  booking_id?: string | null;
  sender_id: string;
  receiver_id: string;
  message: string;
}

export interface MessagesResponse {
  success?: boolean;
  data?: Message[];
  message?: string;
}

export async function sendMessage(payload: SendMessageRequest, options?: ApiRequestOptions) {
  return apiFetch<MessagesResponse>('/messages', {
    method: 'POST',
    body: payload,
    ...options,
  });
}

export async function getMessagesForUser(userId: string, options?: ApiRequestOptions) {
  // TODO: confirm backend endpoint. Assuming GET /messages/user/:userId
  return apiFetch<MessagesResponse>(`/messages/user/${userId}`, {
    method: 'GET',
    ...options,
  });
}

export async function getConversationBetween(userId: string, otherId: string, options?: ApiRequestOptions) {
  // TODO: confirm backend endpoint. Assuming GET /messages/conversation?user1=..&user2=..
  const path = `/messages/conversation?user1=${encodeURIComponent(userId)}&user2=${encodeURIComponent(otherId)}`;
  return apiFetch<MessagesResponse>(path, { method: 'GET', ...options });
}

export async function markMessagesRead(messageIds: string[], options?: ApiRequestOptions) {
  // TODO: confirm backend endpoint. Assuming POST /messages/mark-read { ids: [] }
  return apiFetch<{ success: boolean; data?: Record<string, unknown> }>(`/messages/mark-read`, {
    method: 'POST',
    body: { ids: messageIds },
    ...options,
  });
}
