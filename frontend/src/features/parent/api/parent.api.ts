/**
 * Parent Feature API Layer
 *
 * This module provides all data access for the Parent feature.
 *
 * Architecture:
 * - Primary: calls the backend REST API via `apiFetch` (same as all other features)
 * - Fallback: uses mock data from `@/services/mock-data` when the backend is unavailable
 *
 * When the backend implements the parent endpoints documented in
 * `docs/BACKEND_API_REQUIREMENTS.md`, the mock fallbacks can be removed
 * without touching any screen or component code.
 *
 * Backend endpoints required (see docs/BACKEND_API_REQUIREMENTS.md for details):
 * - GET    /api/v1/parent/profile
 * - PUT    /api/v1/parent/profile
 * - GET    /api/v1/parent/wards
 * - POST   /api/v1/parent/wards/link
 * - DELETE /api/v1/parent/wards/:linkId
 * - GET    /api/v1/parent/wards/:wardId/summary
 * - GET    /api/v1/parent/wards/:wardId/subjects
 * - GET    /api/v1/parent/wards/:wardId/tutors
 * - GET    /api/v1/parent/wards/:wardId/lessons
 * - GET    /api/v1/parent/wards/:wardId/attendance
 * - GET    /api/v1/parent/wards/:wardId/homework
 * - GET    /api/v1/parent/wards/:wardId/assignments
 * - GET    /api/v1/parent/wards/:wardId/progress-reports
 * - GET    /api/v1/parent/wards/:wardId/learning-goals
 * - GET    /api/v1/parent/wards/:wardId/payments
 * - GET    /api/v1/parent/notifications
 * - PUT    /api/v1/parent/notifications/:id/read
 * - PUT    /api/v1/parent/notifications/read-all
 * - DELETE /api/v1/parent/notifications/:id
 * - GET    /api/v1/tutors/:tutorId (already exists)
 * - GET    /api/v1/tutors/:tutorId/reviews (already exists)
 */

import { apiFetch, ApiError } from '@/services/api';
import type { UserProfile, Booking, Review, Payment } from '@/types';
import {
  mockParentProfile,
  mockWards,
  mockWardLinks,
  mockWardSubjects,
  mockWardTutors,
  mockWardLessons,
  mockWardAttendance,
  mockWardHomework,
  mockWardAssignments,
  mockWardProgressReports,
  mockWardLearningGoals,
  mockWardPayments,
  mockParentNotifications,
  mockLinkingRequests,
  mockWardSummary,
  mockWardSummary2,
  mockReviews,
  mockTutors,
} from '@/services/mock-data';
import type {
  ParentProfile,
  WardLink,
  Ward,
  WardLinkStatus,
  ParentNotification,
  ParentNotificationType,
  WardTutor,
  WardLesson,
  LessonTrackingStatus,
  WardAttendance,
  WardHomework,
  WardAssignment,
  WardProgressReport,
  WardLearningGoal,
  WardPayment,
  WardSummary,
  WardSubject,
  LinkingRequest,
} from '../types';

// ─── Helper: try API, fall back to mock ────────────────────────

async function withMockFallback<T>(
  apiCall: () => Promise<T>,
  mockValue: T,
  feature = 'parent',
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof ApiError || error instanceof TypeError) {
      console.warn(`[${feature}] API unavailable, using mock data:`, error instanceof ApiError ? error.message : error.message);
      return mockValue;
    }
    throw error;
  }
}

// ─── Parent Profile ──────────────────────────────────────────

export async function getOrCreateParentProfile(user: UserProfile): Promise<ParentProfile> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: ParentProfile }>('/parent/profile');
      return res.data ?? (res as unknown as ParentProfile);
    },
    { ...mockParentProfile, id: user.id, full_name: user.full_name || mockParentProfile.full_name, phone_number: user.phone_number || mockParentProfile.phone_number },
  );
}

export async function updateParentProfile(updates: Partial<ParentProfile>): Promise<ParentProfile> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: ParentProfile }>('/parent/profile', {
        method: 'PUT',
        body: updates,
      });
      return res.data ?? (res as unknown as ParentProfile);
    },
    { ...mockParentProfile, ...updates },
  );
}

// ─── Ward Linking ─────────────────────────────────────────────

export async function getWardLinks(parentId: string): Promise<WardLink[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardLink[] }>('/parent/wards');
      return res.data ?? (res as unknown as WardLink[]);
    },
    mockWardLinks,
  );
}

export async function getApprovedWards(parentId: string): Promise<Ward[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: Ward[] }>('/parent/wards');
      const wards = res.data ?? (res as unknown as Ward[]);
      return wards.filter((w) => w.link_status === 'approved');
    },
    mockWards,
  );
}

export async function searchStudentByCode(code: string): Promise<UserProfile | null> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: UserProfile | null }>(
        `/profiles/search?code=${encodeURIComponent(code)}`,
      );
      return res.data ?? null;
    },
    mockWards.find((w) => w.phone_number === code) ?? null,
  );
}

export async function searchStudentByPhone(phone: string): Promise<UserProfile | null> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: UserProfile | null }>(
        `/profiles/search?phone=${encodeURIComponent(phone)}`,
      );
      return res.data ?? null;
    },
    mockWards.find((w) => w.phone_number === phone) ?? null,
  );
}

export async function searchStudentById(studentId: string): Promise<UserProfile | null> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: UserProfile | null }>(`/profiles/${studentId}`);
      return res.data ?? null;
    },
    mockWards.find((w) => w.id === studentId) ?? null,
  );
}

export async function requestWardLink(
  parentId: string,
  wardId: string,
  relation?: string,
  parentCode?: string,
): Promise<WardLink> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardLink }>('/parent/wards/link', {
        method: 'POST',
        body: { ward_id: wardId, relation, parent_code: parentCode },
      });
      return res.data ?? (res as unknown as WardLink);
    },
    {
      id: `link-${Date.now()}`,
      parent_id: parentId,
      ward_id: wardId,
      status: 'pending',
      relation,
      parent_code: parentCode,
      requested_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  );
}

export async function revokeWardLink(linkId: string): Promise<void> {
  return withMockFallback(
    async () => {
      await apiFetch(`/parent/wards/${linkId}`, { method: 'DELETE' });
    },
    undefined,
  );
}

export async function getPendingLinkingRequests(wardId: string): Promise<LinkingRequest[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: LinkingRequest[] }>(
        `/parent/wards/${wardId}/linking-requests`,
      );
      return res.data ?? (res as unknown as LinkingRequest[]);
    },
    mockLinkingRequests,
  );
}

// ─── Ward Data ────────────────────────────────────────────────

export async function getWardSummary(wardId: string, linkId: string): Promise<WardSummary | null> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardSummary }>(`/parent/wards/${wardId}/summary`);
      return res.data ?? (res as unknown as WardSummary);
    },
    wardId === 'student-001' ? mockWardSummary : wardId === 'student-002' ? mockWardSummary2 : mockWardSummary,
  );
}

export async function getWardSubjects(wardId: string): Promise<WardSubject[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardSubject[] }>(`/parent/wards/${wardId}/subjects`);
      return res.data ?? (res as unknown as WardSubject[]);
    },
    mockWardSubjects,
  );
}

export async function getWardTutors(wardId: string): Promise<WardTutor[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardTutor[] }>(`/parent/wards/${wardId}/tutors`);
      return res.data ?? (res as unknown as WardTutor[]);
    },
    mockWardTutors,
  );
}

export async function getWardTutor(tutorId: string): Promise<WardTutor | null> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardTutor }>(`/tutors/${tutorId}`);
      return res.data ?? (res as unknown as WardTutor);
    },
    mockWardTutors.find((t) => t.id === tutorId) ?? mockWardTutors[0],
  );
}

export async function getWardLessons(wardId: string): Promise<WardLesson[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardLesson[] }>(`/parent/wards/${wardId}/lessons`);
      return res.data ?? (res as unknown as WardLesson[]);
    },
    mockWardLessons,
  );
}

export async function getWardAttendance(wardId: string): Promise<WardAttendance[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardAttendance[] }>(`/parent/wards/${wardId}/attendance`);
      return res.data ?? (res as unknown as WardAttendance[]);
    },
    mockWardAttendance,
  );
}

export async function getWardHomework(wardId: string): Promise<WardHomework[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardHomework[] }>(`/parent/wards/${wardId}/homework`);
      return res.data ?? (res as unknown as WardHomework[]);
    },
    mockWardHomework,
  );
}

export async function getWardAssignments(wardId: string): Promise<WardAssignment[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardAssignment[] }>(`/parent/wards/${wardId}/assignments`);
      return res.data ?? (res as unknown as WardAssignment[]);
    },
    mockWardAssignments,
  );
}

export async function getWardProgressReports(wardId: string): Promise<WardProgressReport[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardProgressReport[] }>(`/parent/wards/${wardId}/progress-reports`);
      return res.data ?? (res as unknown as WardProgressReport[]);
    },
    mockWardProgressReports,
  );
}

export async function getWardLearningGoals(wardId: string): Promise<WardLearningGoal[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardLearningGoal[] }>(`/parent/wards/${wardId}/learning-goals`);
      return res.data ?? (res as unknown as WardLearningGoal[]);
    },
    mockWardLearningGoals,
  );
}

export async function getWardPayments(wardId: string): Promise<WardPayment[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardPayment[] }>(`/parent/wards/${wardId}/payments`);
      return res.data ?? (res as unknown as WardPayment[]);
    },
    mockWardPayments,
  );
}

// ─── Notifications ────────────────────────────────────────────

export async function getParentNotifications(parentId: string): Promise<ParentNotification[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: ParentNotification[] }>('/parent/notifications');
      return res.data ?? (res as unknown as ParentNotification[]);
    },
    mockParentNotifications,
  );
}

export async function getUnreadNotificationCount(parentId: string): Promise<number> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: { count: number } }>('/parent/notifications/unread-count');
      return res.data?.count ?? 0;
    },
    mockParentNotifications.filter((n) => !n.is_read).length,
  );
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  return withMockFallback(
    async () => {
      await apiFetch(`/parent/notifications/${notificationId}/read`, { method: 'PUT' });
    },
    undefined,
  );
}

export async function markAllNotificationsRead(parentId: string): Promise<void> {
  return withMockFallback(
    async () => {
      await apiFetch('/parent/notifications/read-all', { method: 'PUT' });
    },
    undefined,
  );
}

export async function createParentNotification(
  parentId: string,
  payload: {
    type: ParentNotificationType;
    title: string;
    body: string;
    ward_id?: string;
    data?: Record<string, unknown>;
  },
): Promise<void> {
  return withMockFallback(
    async () => {
      await apiFetch('/parent/notifications', {
        method: 'POST',
        body: payload,
      });
    },
    undefined,
  );
}

export async function deleteParentNotification(notificationId: string): Promise<void> {
  return withMockFallback(
    async () => {
      await apiFetch(`/parent/notifications/${notificationId}`, { method: 'DELETE' });
    },
    undefined,
  );
}

// ─── Tutor Reviews (for tutor detail) ─────────────────────────

export async function getTutorReviews(tutorId: string): Promise<Review[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: Review[] }>(`/tutors/${tutorId}/reviews`);
      return res.data ?? (res as unknown as Review[]);
    },
    mockReviews,
  );
}

export async function getTutorLessonHistoryForWard(tutorId: string, wardId: string): Promise<WardLesson[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: WardLesson[] }>(`/parent/wards/${wardId}/tutors/${tutorId}/lessons`);
      return res.data ?? (res as unknown as WardLesson[]);
    },
    mockWardLessons.filter((l) => l.tutor_id === tutorId),
  );
}

// ─── Location Sharing Consent ─────────────────────────────────
//
// Backend recommendation: Add `location_sharing_consent` boolean column
// and `location_lat` / `location_lng` decimal columns to the bookings table.
// See docs/BACKEND_API_REQUIREMENTS.md for the full migration recommendation.

export async function updateLocationConsent(
  lessonId: string,
  consent: boolean,
): Promise<void> {
  return withMockFallback(
    async () => {
      await apiFetch(`/parent/lessons/${lessonId}/location-consent`, {
        method: 'PUT',
        body: { consent },
      });
    },
    undefined,
  );
}

// ─── All Tutors (for student dashboard) ───────────────────────

export async function getAllTutors(): Promise<UserProfile[]> {
  return withMockFallback(
    async () => {
      const res = await apiFetch<{ data: UserProfile[] }>('/profiles/tutors');
      return res.data ?? (res as unknown as UserProfile[]);
    },
    mockTutors,
    'tutor',
  );
}
