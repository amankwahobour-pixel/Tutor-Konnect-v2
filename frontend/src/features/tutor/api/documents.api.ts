import { apiFetch, ApiRequestOptions } from '@/services/api';
import type { ApiResponse, TutorDocument } from '@/types';

export interface CreateTutorDocumentRequest {
  tutorId: string;
  documentType: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

export type TutorDocumentListResponse = ApiResponse<TutorDocument[]>;
export type TutorDocumentItemResponse = ApiResponse<TutorDocument>;

export async function createTutorDocument(payload: CreateTutorDocumentRequest, options?: ApiRequestOptions) {
  return apiFetch<TutorDocumentItemResponse>('/tutor-documents', {
    method: 'POST',
    body: payload,
    ...options,
  });
}

export async function getTutorDocuments(tutorId: string, options?: ApiRequestOptions) {
  // Note: backend route expects a docId path param; the implementation uses it to look up documents for a tutor
  return apiFetch<TutorDocumentListResponse>(`/tutor-documents/${tutorId}`, {
    method: 'GET',
    ...options,
  });
}

export async function deleteTutorDocument(docId: string, options?: ApiRequestOptions) {
  return apiFetch<TutorDocumentItemResponse>(`/tutor-documents/${docId}`, {
    method: 'DELETE',
    ...options,
  });
}
