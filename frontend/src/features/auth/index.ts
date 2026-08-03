// Auth feature exports
export { OnboardingSlide, OTPInput, PaginationDots, RoleCard } from './components';
export { useAuth } from './hooks/use-auth';
export { getAuthToken, getAuthUser, removeAuthToken, saveAuthToken, saveAuthUser } from './services/auth-storage';
export {
    loginWithEmail,
    loginWithPhone, logout,
    resendEmailVerification, signUpWithEmail,
    verifyPhoneOtp, type AuthResponse,
    type LoginPayload
} from './services/auth.service';
export * from './types';

