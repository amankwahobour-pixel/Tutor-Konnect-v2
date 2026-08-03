import { UserProfile } from '@/types';

// Backend DTOs (camelCase)
export interface CreateProfileRequest {
  id: string;
  fullName: string;
  phoneNumber: string;
  profilePhoto?: string;
  role: 'student' | 'tutor';
  bio?: string;
}

export interface UpdateProfileRequest {
  id?: string;
  fullName?: string;
  phoneNumber?: string;
  profilePhoto?: string;
  bio?: string;
}

// Mapper: frontend (snake_case UserProfile) -> backend DTO (camelCase)
export function toCreateProfileRequest(profile: Partial<UserProfile> & { role: 'student' | 'tutor' }): CreateProfileRequest {
  if (!profile.id) throw new Error('Missing id for create profile request');
  if (!profile.role) throw new Error('Missing role for create profile request');

  return {
    id: profile.id,
    fullName: (profile.full_name ?? '').trim(),
    phoneNumber: String(profile.phone_number ?? '').trim(),
    profilePhoto: profile.profile_photo,
    role: profile.role,
    bio: profile.bio,
  };
}

export function toUpdateProfileRequest(profile: Partial<UserProfile>): UpdateProfileRequest {
  return {
    id: profile.id,
    fullName: profile.full_name?.trim(),
    phoneNumber: profile.phone_number ? String(profile.phone_number).trim() : undefined,
    profilePhoto: profile.profile_photo,
    bio: profile.bio,
  };
}

// Mapper: backend response (flexible casing) -> frontend UserProfile (snake_case)
export function fromProfileResponse(data: any): UserProfile {
  // Defensive mapping to support both camelCase and snake_case responses
  const id = data.id ?? data.user_id ?? '';
  const phone_number = data.phone_number ?? data.phoneNumber ?? '';
  const email = data.email ?? undefined;
  const role = data.role ?? undefined;
  const full_name = data.full_name ?? data.fullName ?? undefined;
  const profile_photo = data.profile_photo ?? data.profilePhoto ?? undefined;
  const bio = data.bio ?? undefined;
  const created_at = data.created_at ?? data.createdAt ?? new Date().toISOString();
  const updated_at = data.updated_at ?? data.updatedAt ?? new Date().toISOString();

  return {
    id,
    phone_number,
    email,
    role: role as UserProfile['role'],
    full_name,
    profile_photo,
    bio,
    created_at,
    updated_at,
  };
}
