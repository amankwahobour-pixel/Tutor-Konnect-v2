import {NextFunction, Request, Response} from "express"
import {AuthService} from "../services/auth.service";
import {emailLoginSchema, emailSchema, phoneLoginSchema, verifyPhoneOtpSchema} from "../mappers/auth.mapper";

export class AuthController {

    private readonly userService = new AuthService();

    async singUpWithEmail(request: Request, response: Response, next: NextFunction) {
        try {
            const parsed = emailLoginSchema.safeParse(request.body);
            if (!parsed.success) {
                return response.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                });
            }
            const result = await this.userService.singUpWithEmail(parsed.data);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async loginWithPhone(request: Request, response: Response, next: NextFunction) {
        try {
            const parsed = phoneLoginSchema.safeParse(request.body);
            if (!parsed.success) {
                return response.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                });
            }
            const result = await this.userService.loginWithPhone(parsed.data);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async loginWithEmail(request: Request, response: Response, next: NextFunction) {
        try {
            const parsed = emailLoginSchema.safeParse(request.body);
            if (!parsed.success) {
                return response.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                });
            }

            const result = await this.userService.loginWithEmail(parsed.data);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async verifyPhoneOtp(request: Request, response: Response, next: NextFunction) {
        try {
            const parsed = verifyPhoneOtpSchema.safeParse(request.body);
            if (!parsed.success) {
                return response.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                });
            }

            const result = await this.userService.verifyPhoneOtp(parsed.data);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async resendEmailVerification(request: Request, response: Response, next: NextFunction) {
        try {
            const parsed = emailSchema.safeParse(request.body);
            if (!parsed.success) {
                return response.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                });
            }

            const result = await this.userService.resendEmailVerification(parsed.data);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async logout(request: Request, response: Response, next: NextFunction) {
        try {
            const result = await this.userService.logout();
            return response.status(200).json(result);
        } catch (e) {
            next(e)
        }
    }
}