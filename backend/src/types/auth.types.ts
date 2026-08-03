/**
 * Authentication-related type definitions
 */

/**
 * Authentication token details
 */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
}

/**
 * Login response containing user details and tokens
 */
export interface LoginDetails {
  email?: string;
  phone?: string;
  token: AuthTokens;
}

/**
 * OTP response from authentication service
 */
export interface OtpResponse {
  user?: Record<string, unknown>;
  session?: Record<string, unknown>;
}

/**
 * Email DTO (Data Transfer Object) for authentication
 */
export interface EmailDto {
  email: string;
}

/**
 * Phone DTO for OTP-based authentication
 */
export interface PhoneDto {
  phoneNumber: string;
}

/**
 * Email and password credentials
 */
export interface EmailPasswordDto {
  email: string;
  password: string;
}

/**
 * OTP verification DTO
 */
export interface VerifyOtpDto {
  phone: string;
  token: string;
}
