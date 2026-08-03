import {TutorProfileService} from "../services/tutor.profile.service";
import {NextFunction, Request, Response} from "express";
import {
    createTutorProfileSchema,
    partialTutorProfileSchema,
    updateTutorProfileSchema
} from "../mappers/tutor.profile.mapper";
import {RequestParam} from "../types/request.param";

export class TutorProfileController {

    private readonly tutorProfileService = new TutorProfileService()

    async getTutorProfile(request: Request, response: Response, next: NextFunction) {
        try {
            const {userId}: RequestParam = request.params;
            if (!userId) {
                return response.status(400).json({success: false, message: "User ID is required"});
            }
            let results = await this.tutorProfileService.getTutorProfile(userId)
            return response.status(200).json(results);
        } catch (e) {
            next(e)
        }
    }

    async getTotalEarnings(request: Request, response: Response, next: NextFunction) {
        try {
            const {userId}: RequestParam = request.params;
            if (!userId) {
                return response.status(400).json({success: false, message: "User ID is required"});
            }
            let results = await this.tutorProfileService.getTotalEarnings(userId)
            return response.status(200).json(results);
        } catch (e) {
            next(e)
        }
    }

    async createTutorProfile(request: Request, response: Response, next: NextFunction) {
        try {
            const parsed = createTutorProfileSchema.safeParse(request.body);
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
            const result = await this.tutorProfileService.createTutorProfile(parsed.data);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateTutorProfile(request: Request, response: Response, next: NextFunction) {
        try {
            const {userId}: RequestParam = request.params;
            if (!userId) {
                return response.status(400).json({success: false, message: "User ID is required"});
            }

            const parsed = updateTutorProfileSchema.safeParse(request.body);
            if (!parsed.success) {
                return response.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                })
            }
            let results = await this.tutorProfileService.updateTutorProfile(userId, parsed.data)
            return response.status(200).json(results);
        } catch (e) {
            next(e)
        }
    }

    async updateTutorProfilePartial(request: Request, response: Response, next: NextFunction) {
        try {
            const {userId}: RequestParam = request.params;
            if (!userId) {
                return response.status(400).json({success: false, message: "User ID is required"});
            }

            const parsed = partialTutorProfileSchema.safeParse(request.body);
            if (!parsed.success) {
                return response.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                })
            }

            let results = await this.tutorProfileService.updateTutorProfilePartial(userId, parsed.data)
            return response.status(200).json(results);
        } catch (e) {
            next(e)
        }
    }

    async getTutors(request: Request, response: Response, next: NextFunction) {
        try {
            const {subject} = request.query;

            let results = await this.tutorProfileService.getTutors(subject as string)
            return response.status(200).json(results);
        } catch (e) {
            next(e)
        }
    }
}