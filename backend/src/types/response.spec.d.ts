/**
 * Standard API response specification
 * Generic type T allows for type-safe response data
 */
export interface ResponseSpec<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}