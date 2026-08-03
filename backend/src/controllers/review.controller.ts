import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service";
import { createReviewSchema, updateReviewSchema } from "../mappers/review.mapper";
import { RequestParam } from "../types/request.param";

export class ReviewController {
    private readonly reviewService = new ReviewService();

    async getReviewByBooking(request: Request, response: Response, next: NextFunction) {
        try {
            const { bookingId }: RequestParam = request.params;
            if (!bookingId) {
                return response.status(400).json({ success: false, message: "Booking ID is required" });
            }

            const result = await this.reviewService.getReviewByBooking(bookingId);
            return response.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getTutorReviews(request: Request, response: Response, next: NextFunction) {
        try {
            const { tutorId }: RequestParam = request.params;
            if (!tutorId) {
                return response.status(400).json({ success: false, message: "Tutor ID is required" });
            }

            const result = await this.reviewService.getTutorReviews(tutorId);
            return response.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getStudentReviews(request: Request, response: Response, next: NextFunction) {
        try {
            const { studentId }: RequestParam = request.params;
            if (!studentId) {
                return response.status(400).json({ success: false, message: "Student ID is required" });
            }

            const result = await this.reviewService.getStudentReviews(studentId);
            return response.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createReview(request: Request, response: Response, next: NextFunction) {
        try {
            const { bookingId }: RequestParam = request.params;
            if (!bookingId) {
                return response.status(400).json({ success: false, message: "Booking ID is required" });
            }

            const parsed = createReviewSchema.safeParse(request.body);
            if (!parsed.success) {
                return response.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                });
            }

            const result = await this.reviewService.createReview(bookingId, parsed.data);
            return response.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateReview(request: Request, response: Response, next: NextFunction) {
        try {
            const { bookingId }: RequestParam = request.params;
            if (!bookingId) {
                return response.status(400).json({ success: false, message: "Booking ID is required" });
            }

            const parsed = updateReviewSchema.safeParse(request.body);
            if (!parsed.success) {
                return response.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                });
            }

            const result = await this.reviewService.updateReview(bookingId, parsed.data);
            return response.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
