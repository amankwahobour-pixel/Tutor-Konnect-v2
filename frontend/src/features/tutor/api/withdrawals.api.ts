import { apiFetch, ApiRequestOptions } from '@/services/api';

export interface CreateWithdrawalRequest {
  tutorId: string;
  amount: number;
  provider: 'mtn' | 'vodafone' | 'airteltigo' | string;
  mobileMoneyNumber: string;
}

export interface WithdrawalRecord {
  id: string;
  amount: number;
  provider: string;
  mobile_money_number: string;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  failure_reason?: string;
  created_at: string;
  processed_at?: string;
}

export interface WithdrawalListResponse {
  success: boolean;
  data: WithdrawalRecord[];
  message?: string;
}

export async function createWithdrawal(payload: CreateWithdrawalRequest, options?: ApiRequestOptions) {
  // TODO: Ensure backend exposes POST /withdrawals to create a withdrawal request.
  return apiFetch<any>('/withdrawals', {
    method: 'POST',
    body: payload,
    ...options,
  });
}

export async function getTutorWithdrawals(tutorId: string, options?: ApiRequestOptions) {
  // TODO: Backend may expose /withdrawals/tutor/:tutorId or /tutors/:id/withdrawals.
  // Try a common pattern first.
  try {
    return apiFetch<WithdrawalListResponse>(`/tutors/${tutorId}/withdrawals`, {
      method: 'GET',
      ...options,
    });
  } catch {
    // Fallback: try /withdrawals/tutor/:tutorId
    return apiFetch<WithdrawalListResponse>(`/withdrawals/tutor/${tutorId}`, {
      method: 'GET',
      ...options,
    });
  }
}
