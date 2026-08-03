/**
 * Authentication API exports - Re-export from auth service
 * This module provides a centralized API for all authentication operations
 */

export {
  loginWithEmail,
  loginWithPhone,
  signUpWithEmail,
  resendEmailVerification,
  verifyPhoneOtp,
  logout,
  type AuthResponse,
  type LoginPayload,
} from '@/features/auth/services/auth.service';

export {
  saveAuthToken,
  getAuthToken,
  saveAuthUser,
  getAuthUser,
  removeAuthToken,
} from '@/features/auth/services/auth-storage';