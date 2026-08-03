export enum UserRole {
    STUDENT = 'student',
    TUTOR = 'tutor',
}

export enum VerificationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    MORE_INFO = 'more_info',
}

export enum BookingStatus {
    PENDING_PAYMENT = 'pending_payment',
    PENDING_TUTOR_ACCEPTANCE = 'pending_tutor_acceptance',
    ACCEPTED = 'accepted',
    CONFIRMED = 'confirmed',
    REJECTED = 'rejected',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SUCCESSFUL = 'successful',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum MobileProvider {
    MTN = 'mtn',
    VODAFONE = 'vodafone',
    AIRTELTIGO = 'airteltigo',
}