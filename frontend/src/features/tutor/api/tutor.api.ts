import { apiFetch, ApiRequestOptions } from '@/services/api';

export interface TutorProfile {
  id: string;
  user_id: string;
  full_name?: string;
  profile_photo?: string;
  bio?: string;
  subjects?: string[];
  hourly_rate: number;
  experience_years?: number;
  qualifications?: string;
  location?: string;
  verification_status: 'pending' | 'approved' | 'rejected' | 'more_info';
  verification_rejection_reason?: string;
  availability_notes?: string;
  total_earned: number;
  rating_avg: number;
  rating_count: number;
  total_sessions: number;
  created_at: string;
  updated_at: string;
}

export interface TutorCreateRequest {
  bio?: string;
  subjects?: string[];
  hourly_rate: number;
  qualifications?: string;
  availability_notes?: string;
}

export type TutorUpdateRequest = Partial<TutorCreateRequest>;

export interface TutorListResponse {
  success: boolean;
  data: TutorProfile[];
  message?: string;
}

export interface TutorDetailResponse {
  success: boolean;
  data: TutorProfile;
  message?: string;
}

export interface EarningsResponse {
  success: boolean;
  data: {
    total_earned: number;
    pending: number;
    available: number;
  };
  message?: string;
}

export async function getTutors(options?: ApiRequestOptions) {
  return apiFetch<TutorListResponse>('/tutors', {
    method: 'GET',
    ...options,
  });
}

export async function getTutorProfile(userId: string, options?: ApiRequestOptions) {
  try {
    return await apiFetch<TutorDetailResponse>(`/tutors/${userId}`, {
      method: 'GET',
      ...options,
    });
  } catch (err) {
    if (__DEV__) {
      console.warn('getTutorProfile failed, returning mock data in dev mode', err);
      const now = new Date().toISOString();
      return {
        success: true,
        data: {
          id: `tutor-${userId}`,
          user_id: userId,
          full_name: 'Demo Tutor',
          profile_photo: undefined,
          bio: 'Mock tutor bio',
          subjects: ['Mathematics', 'Physics'],
          hourly_rate: 80,
          experience_years: 3,
          qualifications: 'BEd',
          verification_status: 'approved',
          total_earned: 1200,
          rating_avg: 4.8,
          rating_count: 32,
          total_sessions: 120,
          created_at: now,
          updated_at: now,
        },
      } as TutorDetailResponse;
    }

    throw err;
  }
}

export async function getTutorEarnings(userId: string, options?: ApiRequestOptions) {
  return apiFetch<EarningsResponse>(`/tutors/${userId}/earnings`, {
    method: 'GET',
    ...options,
  });
}

export async function createTutorProfile(data: TutorCreateRequest, options?: ApiRequestOptions) {
  return apiFetch<TutorDetailResponse>('/tutors', {
    method: 'POST',
    body: data,
    ...options,
  });
}

export async function updateTutorProfile(
  userId: string,
  data: TutorUpdateRequest,
  options?: ApiRequestOptions
) {
  return apiFetch<TutorDetailResponse>(`/tutors/${userId}`, {
    method: 'PUT',
    body: data,
    ...options,
  });
}

export async function updateTutorProfileField(
  userId: string,
  field: string,
  value: unknown,
  options?: ApiRequestOptions
) {
  return apiFetch<TutorDetailResponse>(`/tutors/${userId}/field`, {
    method: 'PATCH',
    body: { [field]: value },
    ...options,
  });
}
