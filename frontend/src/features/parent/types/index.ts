// Parent feature types

import type { UserProfile, Booking, Payment } from '@/types';

export type WardLinkStatus = 'pending' | 'approved' | 'rejected' | 'revoked';

export type ParentNotificationType =
  | 'lesson_booking'
  | 'lesson_cancellation'
  | 'tutor_change'
  | 'homework'
  | 'attendance'
  | 'payment'
  | 'progress_report'
  | 'linking_request'
  | 'linking_approved'
  | 'linking_rejected';

export type LessonTrackingStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export interface ParentProfile {
  id: string;
  full_name: string;
  phone_number: string;
  avatar_url?: string;
  notification_prefs?: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface WardLink {
  id: string;
  parent_id: string;
  ward_id: string;
  status: WardLinkStatus;
  relation?: string;
  parent_code?: string;
  requested_at: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Ward extends UserProfile {
  link_id: string;
  relation?: string;
  link_status: WardLinkStatus;
  linked_at: string;
}

export interface WardSubject {
  id: string;
  name: string;
  tutor_id: string;
  tutor_name: string;
  tutor_avatar?: string;
  tutor_verified: boolean;
  progress_percent: number;
  lessons_completed: number;
  lessons_total: number;
}

export interface WardTutor {
  id: string;
  full_name: string;
  profile_photo?: string;
  bio?: string;
  subjects: string[];
  verification_status: string;
  rating_avg: number;
  rating_count: number;
  total_sessions: number;
  hourly_rate: number;
  qualifications?: string;
  location?: string;
  availability_notes?: string;
}

export interface WardLesson {
  id: string;
  subject: string;
  tutor_id: string;
  tutor_name: string;
  tutor_avatar?: string;
  status: LessonTrackingStatus;
  scheduled_time: string;
  end_time?: string;
  duration_hours?: number;
  total_amount?: number;
  meet_link?: string;
  location_lat?: number;
  location_lng?: number;
  location_sharing_consent: boolean;
  is_in_person: boolean;
  created_at: string;
}

export interface WardAttendance {
  id: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  tutor_name: string;
}

export interface WardHomework {
  id: string;
  subject: string;
  title: string;
  description?: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
  feedback?: string;
  tutor_name: string;
}

export interface WardAssignment {
  id: string;
  subject: string;
  title: string;
  description?: string;
  due_date: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  max_score?: number;
  score?: number;
  tutor_name: string;
}

export interface WardProgressReport {
  id: string;
  subject: string;
  period: string;
  overall_grade?: string;
  attendance_rate: number;
  assignments_completed: number;
  assignments_total: number;
  average_score?: number;
  strengths?: string[];
  areas_for_improvement?: string[];
  tutor_name: string;
  created_at: string;
}

export interface WardLearningGoal {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  target_date: string;
  progress_percent: number;
  status: 'on_track' | 'at_risk' | 'achieved' | 'overdue';
}

export interface WardPayment {
  payment: Payment;
  booking: Booking;
  tutor_name: string;
  subject: string;
}

export interface ParentNotification {
  id: string;
  parent_id: string;
  ward_id?: string;
  ward_name?: string;
  type: ParentNotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface LinkingRequest {
  id: string;
  parent_id: string;
  parent_name: string;
  parent_avatar?: string;
  relation?: string;
  status: WardLinkStatus;
  requested_at: string;
}

export interface WardSummary {
  ward: Ward;
  upcoming_lessons: WardLesson[];
  active_subjects: WardSubject[];
  attendance_rate: number;
  pending_homework: number;
  active_goals: number;
  unread_notifications: number;
}
