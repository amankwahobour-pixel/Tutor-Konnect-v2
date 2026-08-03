import { apiFetch, ApiRequestOptions } from '@/services/api';
import type { Payment } from '@/types';

export interface InitiatePaymentRequest {
  booking_id: string;
  amount: number;
  provider: 'mtn' | 'vodafone' | 'airteltigo' | string;
  mobile_money_number?: string;
}

export interface PaymentResponse {
  success: boolean;
  data: Payment[];
  message?: string;
}

export async function initiatePayment(payload: InitiatePaymentRequest, options?: ApiRequestOptions) {
  // POST /payments
  return apiFetch<PaymentResponse>('/payments', {
    method: 'POST',
    body: payload,
    ...options,
  });
}

export async function getPaymentsForBooking(bookingId: string, options?: ApiRequestOptions) {
  // GET /payments/booking/:bookingId
  return apiFetch<PaymentResponse>(`/payments/booking/${bookingId}`, {
    method: 'GET',
    ...options,
  });
}

export async function getPaymentsForUser(userId: string, options?: ApiRequestOptions) {
  // GET /payments/user/:userId
  return apiFetch<PaymentResponse>(`/payments/user/${userId}`, {
    method: 'GET',
    ...options,
  });
}

export async function getPayment(paymentId: string, options?: ApiRequestOptions) {
  return apiFetch<PaymentResponse>(`/payments/${paymentId}`, {
    method: 'GET',
    ...options,
  });
}

export async function refundPayment(paymentId: string, options?: ApiRequestOptions) {
  // TODO: confirm backend endpoint for refunds. Assuming POST /payments/:id/refund
  return apiFetch<PaymentResponse>(`/payments/${paymentId}/refund`, {
    method: 'POST',
    ...options,
  });
}
