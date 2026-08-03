import { apiFetch, ApiRequestOptions } from '@/services/api';
import { UserProfile } from '@/types';
import {
  CreateProfileRequest,
  UpdateProfileRequest,
  toCreateProfileRequest,
  toUpdateProfileRequest,
  fromProfileResponse,
} from './profile.mapper';

export interface SearchTutorResponse {
  success: boolean;
  data: UserProfile[];
  message?: string;
}

export interface ProfileResponse {
  success: boolean;
  data: UserProfile;
  message?: string;
}

export interface ProfileListResponse {
  success: boolean;
  data: UserProfile[];
  message?: string;
}

export async function getAllTutors(options?: ApiRequestOptions) {
  const res = await apiFetch<ProfileListResponse>('/profiles/tutors', {
    method: 'GET',
    ...options,
  });

  return {
    ...res,
    data: res.data?.map(fromProfileResponse),
  } as ProfileListResponse;
}

export async function getAllStudents(options?: ApiRequestOptions) {
  try {
    const res = await apiFetch<ProfileListResponse>('/profiles/students', {
      method: 'GET',
      ...options,
    });

    return {
      ...res,
      data: res.data?.map(fromProfileResponse),
    } as ProfileListResponse;
  } catch (err) {
    if (__DEV__) {
      console.warn('getAllStudents failed, returning mock data in dev mode', err);
      const now = new Date().toISOString();
      const mock = [
        {
          id: 'student-1',
          phone_number: '+233200000001',
          email: 'student1@example.com',
          role: 'student',
          full_name: 'Ama Mensah',
          profile_photo: undefined,
          bio: 'Eager learner',
          created_at: now,
          updated_at: now,
        },
        {
          id: 'student-2',
          phone_number: '+233200000002',
          email: 'student2@example.com',
          role: 'student',
          full_name: 'Kwame Asare',
          profile_photo: undefined,
          bio: 'High school student',
          created_at: now,
          updated_at: now,
        },
      ];

      return {
        success: true,
        data: mock.map(fromProfileResponse),
      } as ProfileListResponse;
    }

    throw err;
  }
}

export async function searchTutorsByName(query: string, options?: ApiRequestOptions) {
  const res = await apiFetch<SearchTutorResponse>(`/profiles/tutors/search?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    ...options,
  });

  return {
    ...res,
    data: res.data?.map(fromProfileResponse),
  } as SearchTutorResponse;
}

export async function getUserProfile(id: string, options?: ApiRequestOptions) {
  const res = await apiFetch<ProfileResponse>(`/profiles/${id}`, {
    method: 'GET',
    ...options,
  });

  return {
    ...res,
    data: res.data ? fromProfileResponse(res.data) : res.data,
  } as ProfileResponse;
}

export async function getAllProfiles(options?: ApiRequestOptions) {
  const res = await apiFetch<ProfileListResponse>('/profiles', {
    method: 'GET',
    ...options,
  });

  return {
    ...res,
    data: res.data?.map(fromProfileResponse),
  } as ProfileListResponse;
}

export async function createProfile(profile: Partial<UserProfile> & { role: 'student' | 'tutor' | 'parent' }, options?: ApiRequestOptions) {
  // Convert frontend snake_case profile to backend DTO (camelCase)
  const dto: CreateProfileRequest = toCreateProfileRequest(profile);
  const res = await apiFetch<ProfileResponse>('/profiles', {
    method: 'POST',
    body: dto,
    ...options,
  });

  return {
    ...res,
    data: res.data ? fromProfileResponse(res.data) : res.data,
  } as ProfileResponse;
}

export async function updateProfile(id: string, profile: Partial<UserProfile>, options?: ApiRequestOptions) {
  const dto: UpdateProfileRequest = toUpdateProfileRequest(profile);

  const res = await apiFetch<ProfileResponse>(`/profiles/${id}`, {
    method: 'PUT',
    body: dto,
    ...options,
  });

  return {
    ...res,
    data: res.data ? fromProfileResponse(res.data) : res.data,
  } as ProfileResponse;
}

export async function deleteProfile(id: string, options?: ApiRequestOptions) {
  return apiFetch<{ success: boolean; message?: string }>(`/profiles/${id}`, {
    method: 'DELETE',
    ...options,
  });
}
