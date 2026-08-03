import {ResponseSpec} from "../types/response.spec";
import {EmailDto, EmailPasswordDto, PhoneDto, VerifyOtpDto} from "../mappers/auth.mapper";
import {supabase} from "../configs/supabase.client";
import {AppError} from "../exceptions/app.error";


export class AuthService {

    async loginWithPhone(body: PhoneDto): Promise<ResponseSpec> {
        const phoneNumber = body.phoneNumber?.trim();

        if (!phoneNumber) {
            throw new AppError("Phone number is required", 400);
        }

        const { data, error } = await supabase.auth.signInWithOtp({
            phone: phoneNumber
        });

        if (error) {
            throw new AppError(error.message, 400);
        }

        return {
            success: true,
            message: "OTP sent successfully",
            data
        };
    }

    async loginWithEmail(body: EmailPasswordDto): Promise<ResponseSpec> {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: body.email.trim(),
            password: body.password
        });

        if (error) {
            throw new AppError(error.message, 401);
        }

        const details = {
            user: data.user,
            email: data.user?.email,
            token: {
                access_token: data.session?.access_token,
                refresh_token: data.session?.refresh_token,
                token_type: data.session?.token_type,
                expires_in: data.session?.expires_in,
                expires_at: data.session?.expires_at
            }
        };

        return {success: true, message: "Login successful", data: details};
    }

    async singUpWithEmail(body: EmailPasswordDto): Promise<ResponseSpec> {
        const {data, error} = await supabase.auth.signUp({
            email: body.email.trim(),
            password: body.password
        });

        if (error) {
            throw new AppError(error.message, 401);
        }

        const details = {
            user: data.user,
            email: data.user?.email,
            session: data.session,
            data
        };

        return {success: true, message: "Sign up successful", data: details};
    }

    async verifyPhoneOtp(body: VerifyOtpDto): Promise<ResponseSpec> {
        const phoneNumber = body.phoneNumber?.trim();
        const token = body.token?.trim();

        if (!phoneNumber) {
            throw new AppError("Phone number is required", 400);
        }

        const {data, error} = await supabase.auth.verifyOtp({
            phone: phoneNumber,
            token: token,
            type: "sms"
        });

        if (error) {
            throw new AppError(error.message, 400);
        }

        let details = {
            user: {
                id: data?.user?.id,
                phone: data?.user?.phone,
                role: data?.user?.role,
                is_anonymous: data?.user?.is_anonymous,
                phone_confirmed_at: data?.user?.phone_confirmed_at,
                last_sign_in_at: data?.user?.last_sign_in_at,
                created_at: data?.user?.created_at,
                updated_at: data?.user?.updated_at
            },

            token: {
                access_token: data?.session?.access_token,
                refresh_token: data?.session?.refresh_token,
                token_type: data?.session?.token_type,
                expires_in: data?.session?.expires_in,
                expires_at: data?.session?.expires_at
            }
        };

        return {success: true, message: "Login successfully", data: details};
    }

    async resendEmailVerification(body: EmailDto): Promise<ResponseSpec> {
        const cleanEmail = body.email?.trim();

        if (!cleanEmail) {
            throw new AppError("Phone number is required", 400);
        }

        const {data, error} = await supabase.auth.resend({
            type: "signup",
            email: cleanEmail
        });

        if (error) {
            throw new AppError(error.message, 400);
        }

        return {success: true, message: "OTP sent successfully", data};
    }

    async logout(): Promise<ResponseSpec> {
        const {error} = await supabase.auth.signOut();

        if (error) {
            throw new AppError(error.message, 400);
        }

        return {success: true, message: "Logged out successfully"};
    }
}