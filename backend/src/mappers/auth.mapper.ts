import z from "zod";

export interface EmailPasswordDto {
    email: string;
    password: string;
}

export interface EmailDto {
    email: string;
}

export interface PhoneDto {
    phoneNumber: string;
}

export interface VerifyOtpDto {
    phoneNumber: string;
    token: string;
}

export const emailSchema = z.object({
    email: z.string()
});

export const phoneLoginSchema = z.object({
    phoneNumber: z.string().min(10).max(13)
});

export const emailLoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});

export const verifyPhoneOtpSchema = z.object({
    phoneNumber: z.string().min(10).max(13),
    token: z.string().min(6)
});

