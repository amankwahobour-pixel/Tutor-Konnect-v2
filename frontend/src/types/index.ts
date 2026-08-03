// Shared types used across the application

/**
 * User role enumeration
 */
export enum UserRole {
  STUDENT = 'STUDENT',
  TUTOR = 'TUTOR',
  ADMIN = 'ADMIN',
}

/**
 * Booking/Lesson status
 */
export enum BookingStatus {
  PENDING_PAYMENT = 'pending_payment',
  PENDING_TUTOR_ACCEPTANCE = 'pending_tutor_acceptance',
  ACCEPTED = 'accepted',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  // backward-compatible aliases
  PENDING = 'pending_payment',
}

/**
 * Tutor verification status
 */
export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * User profile data structure (shared across all features)
 */
export interface UserProfile {
  id: string;
  phone_number: string;
  email?: string;
  role: UserRole | string;
  full_name?: string;
  profile_photo?: string;
  bio?: string;
  user_id?: string;
  subjects?: string[];
  experience_years?: number;
  hourly_rate?: number;
  location?: string;
  verification_status?: VerificationStatus | string;
  total_sessions?: number;
  rating_avg?: number;
  rating_count?: number;
  availability_notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Tutor profile information
 */
export interface TutorProfile {
  id: string;
  user_id: string;
  subjects: string[];
  experience_years: number;
  hourly_rate: number;
  location?: string;
  bio?: string;
  verification_status: VerificationStatus | string;
  total_sessions: number;
  rating_avg: number;
  rating_count: number;
  availability_notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Student profile information
 */
export interface StudentProfile {
  id: string;
  user_id: string;
  grade_level?: string;
  school?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Booking/Lesson record
 */
export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  mobile_money_number?: string;
  provider?: 'mtn' | 'vodafone' | 'airteltigo' | string;
  payment_status: 'pending' | 'processing' | 'successful' | 'failed' | 'refunded' | string;
  transaction_reference?: string;
  paystack_reference?: string;
  paystack_access_code?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  tutor_id: string;
  student_id: string;
  subject: string;
  level?: string;
  scheduled_time?: string;
  start_time?: string;
  end_time?: string;
  total_amount?: number;
  status: BookingStatus | string;
  message?: string;
  confirmed?: boolean;
  tutor?: UserProfile;
  student?: UserProfile;
  tutorName?: string;
  time?: string;
  payments?: Payment[];
  created_at: string;
  updated_at: string;
}
 
export interface Review {
  id: string;
  booking_id: string;
  student_id: string;
  tutor_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
  student?: Pick<UserProfile, 'id' | 'full_name' | 'profile_photo'>;
  tutor?: Pick<UserProfile, 'id' | 'full_name' | 'profile_photo'>;
  booking?: {
    id: string;
    subject?: string;
    scheduled_time?: string;
    start_time?: string;
  };
}
 
/**
 * Queued booking (local storage)
 */
export interface QueuedBooking {
  id: string;
  payload: BookingPayload;
  created_at: string;
  synced?: boolean;
}

/**
 * Booking creation payload
 */
export interface BookingPayload {
  tutor_id: string;
  student_id: string;
  subject: string;
  level?: string;
  scheduled_time: string;
  message?: string;
}

/**
 * Tutor request (from student)
 */
export interface TutorRequest {
  id: string;
  tutor_id: string;
  student_id: string;
  subject: string;
  level?: string;
  scheduled_time?: string;
  status: BookingStatus | string;
  message?: string;
  created_at: string;
  updated_at: string;
  student: string | UserProfile;
}

/**
 * Earnings information
 */
export interface Earnings {
  total_earned: number;
  available: number;
  pending: number;
  withdrawn?: number;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

/**
 * Tutor document record used for verification uploads
 */
export interface TutorDocument {
  id: string;
  tutor_id: string;
  document_type: string;
  file_url?: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
  status?: string;
  uploaded_at?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

/**
 * Setting/Configuration item
 */
export interface SettingItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  onPress?: () => void;
  isDangerous?: boolean;
}

/**
 * Message/Chat record
 */
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read?: boolean;
}

/**
 * Notification
 */
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'system';
  read: boolean;
  created_at: string;
}

/**
 * Sync result
 */
export interface SyncResult<T = unknown> {
  synced: T[];
  failed: T[];
  total: number;
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string;
  message?: string;
  status: number;
  details?: Record<string, unknown>;
}


