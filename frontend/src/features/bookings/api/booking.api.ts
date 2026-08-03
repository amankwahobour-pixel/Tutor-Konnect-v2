import { apiFetch, ApiRequestOptions } from '@/services/api';
import { Booking, Review } from '@/types';

export interface BookingRequest {
  tutor_id: string;
  student_id: string;
  subject: string;
  level?: string;
  scheduled_time?: string;
  message?: string;
}

export interface BookingResponse {
  success: boolean;
  data: Booking[];
  message?: string;
}

export interface ReviewResponse {
  success: boolean;
  data: Review | null;
  message?: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  message?: string;
}

export async function createBooking(payload: BookingRequest, options?: ApiRequestOptions) {
  return apiFetch<BookingResponse>('/bookings', {
    method: 'POST',
    body: payload,
    ...options,
  });
}

export async function getStudentBookings(studentId: string, options?: ApiRequestOptions) {
  return apiFetch<BookingResponse>(`/bookings/student/${studentId}`, {
    method: 'GET',
    ...options,
  });
}

export async function getTutorRequests(tutorId: string, options?: ApiRequestOptions) {
  try {
    return await apiFetch<BookingResponse>(`/bookings/tutor/${tutorId}/requests`, {
      method: 'GET',
      ...options,
    });
  } catch (err) {
    // In development allow a mocked response so developers can navigate UI without backend.
    if (__DEV__) {
      console.warn('getTutorRequests failed, returning mock data in dev mode', err);
      const now = new Date().toISOString();
      return {
        success: true,
        data: [
          {
            id: 'mock-req-1',
            tutor_id: tutorId,
            student_id: 'student-1',
            subject: 'Mathematics',
            level: 'Senior High',
            scheduled_time: now,
            start_time: null,
            end_time: null,
            total_amount: 120,
            status: 'pending',
            message: 'I would like help with algebra',
            confirmed: false,
            created_at: now,
            updated_at: now,
          },
        ],
      } as unknown as BookingResponse;
    }

    throw err;
  }
}

export async function acceptBooking(bookingId: string, options?: ApiRequestOptions) {
  return apiFetch<BookingResponse>(`/bookings/${bookingId}/accept`, {
    method: 'POST',
    ...options,
  });
}

export async function declineBooking(bookingId: string, options?: ApiRequestOptions) {
  return apiFetch<BookingResponse>(`/bookings/${bookingId}/decline`, {
    method: 'POST',
    ...options,
  });
}

export async function getBooking(bookingId: string, options?: ApiRequestOptions) {
  return apiFetch<BookingResponse>(`/bookings/${bookingId}`, {
    method: 'GET',
    ...options,
  });
}

export async function confirmBooking(bookingId: string, options?: ApiRequestOptions) {
  return apiFetch<BookingResponse>(`/bookings/${bookingId}/confirm`, {
    method: 'POST',
    ...options,
  });
}

export async function completeBooking(bookingId: string, options?: ApiRequestOptions) {
  return apiFetch<BookingResponse>(`/bookings/${bookingId}/complete`, {
    method: 'POST',
    ...options,
  });
}

export async function cancelBooking(bookingId: string, options?: ApiRequestOptions) {
  return apiFetch<BookingResponse>(`/bookings/${bookingId}/cancel`, {
    method: 'POST',
    ...options,
  });
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
  review_text?: string;
}

function serializeReviewPayload(payload: CreateReviewRequest) {
  return {
    rating: payload.rating,
    review_text: payload.review_text ?? payload.comment,
  };
}

export async function createReview(bookingId: string, payload: CreateReviewRequest, options?: ApiRequestOptions) {
  return apiFetch<ReviewResponse>(`/bookings/${bookingId}/review`, {
    method: 'POST',
    body: serializeReviewPayload(payload),
    ...options,
  });
}

export async function updateReview(bookingId: string, payload: CreateReviewRequest, options?: ApiRequestOptions) {
  return apiFetch<ReviewResponse>(`/bookings/${bookingId}/review`, {
    method: 'PUT',
    body: serializeReviewPayload(payload),
    ...options,
  });
}

export async function getReviewByBooking(bookingId: string, options?: ApiRequestOptions) {
  return apiFetch<ReviewResponse>(`/bookings/${bookingId}/review`, {
    method: 'GET',
    ...options,
  });
}

export async function getTutorReviews(tutorId: string, options?: ApiRequestOptions) {
  return apiFetch<ReviewsResponse>(`/tutors/${tutorId}/reviews`, {
    method: 'GET',
    ...options,
  });
}

export async function getStudentReviews(studentId: string, options?: ApiRequestOptions) {
  return apiFetch<ReviewsResponse>(`/students/${studentId}/reviews`, {
    method: 'GET',
    ...options,
  });
}
