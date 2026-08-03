import { AppDataSource } from "../configs/data-source";
import { Booking } from "../entities/booking";
import { Review } from "../entities/review";
import { TutorProfile } from "../entities/tutor.profile";
import { ResponseSpec } from "../types/response.spec";
import { AppError } from "../exceptions/app.error";
import { NotFoundError, ForbiddenError } from "../exceptions/unauthorized.error";
import { BookingStatus } from "../enums/entity.enums";
import { CreateReviewDto, UpdateReviewDto } from "../mappers/review.mapper";

export class ReviewService {
    private readonly reviewRepository = AppDataSource.getRepository(Review);
    private readonly bookingRepository = AppDataSource.getRepository(Booking);
    private readonly tutorProfileRepository = AppDataSource.getRepository(TutorProfile);

    private async refreshTutorRatingStats(tutorId: string): Promise<void> {
        const reviews = await this.reviewRepository.find({
            where: { tutor: { id: tutorId } },
            select: ['rating'],
        });

        const ratingCount = reviews.length;
        const ratingAvg = ratingCount > 0 ? reviews.reduce((total, review) => total + review.rating, 0) / ratingCount : 0;

        const tutorProfile = await this.tutorProfileRepository.findOne({
            where: { user: { id: tutorId } },
            relations: ['user'],
        });

        if (!tutorProfile) {
            return;
        }

        tutorProfile.rating_avg = Number(ratingAvg.toFixed(2));
        tutorProfile.rating_count = ratingCount;

        await this.tutorProfileRepository.save(tutorProfile);
    }

    async getReviewByBooking(bookingId: string): Promise<ResponseSpec> {
        const review = await this.reviewRepository.findOne({
            where: { booking: { id: bookingId } },
            relations: ["student", "tutor", "booking"],
        });

        return { success: true, data: review ?? null };
    }

    async getTutorReviews(tutorId: string): Promise<ResponseSpec> {
        const reviews = await this.reviewRepository
            .createQueryBuilder("review")
            .leftJoinAndSelect("review.student", "student")
            .leftJoinAndSelect("review.booking", "booking")
            .where("review.tutor_id = :tutorId", { tutorId })
            .orderBy("review.created_at", "DESC")
            .getMany();

        return { success: true, data: reviews };
    }

    async getStudentReviews(studentId: string): Promise<ResponseSpec> {
        const reviews = await this.reviewRepository
            .createQueryBuilder("review")
            .leftJoinAndSelect("review.tutor", "tutor")
            .leftJoinAndSelect("review.booking", "booking")
            .where("review.student_id = :studentId", { studentId })
            .orderBy("review.created_at", "DESC")
            .getMany();

        return { success: true, data: reviews };
    }

    async createReview(bookingId: string, payload: CreateReviewDto): Promise<ResponseSpec> {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ["student", "tutor", "review"],
        });

        if (!booking) {
            throw new NotFoundError("Booking not found");
        }

        if (booking.status !== BookingStatus.COMPLETED) {
            throw new ForbiddenError("Reviews can only be submitted after a completed booking");
        }

        if (booking.review) {
            throw new AppError("A review already exists for this booking", 409);
        }

        const review = this.reviewRepository.create({
            booking,
            student: booking.student,
            tutor: booking.tutor,
            rating: payload.rating,
            review_text: payload.review_text,
        });

        const saved = await this.reviewRepository.save(review);
        await this.refreshTutorRatingStats(booking.tutor.id);

        return { success: true, message: "Review submitted successfully", data: saved };
    }

    async updateReview(bookingId: string, payload: UpdateReviewDto): Promise<ResponseSpec> {
        const review = await this.reviewRepository.findOne({
            where: { booking: { id: bookingId } },
            relations: ["booking", "student", "tutor"],
        });

        if (!review) {
            throw new NotFoundError("Review not found");
        }

        if (review.booking.status !== BookingStatus.COMPLETED) {
            throw new ForbiddenError("Reviews can only be updated for completed bookings");
        }

        review.rating = payload.rating;
        review.review_text = payload.review_text;

        const saved = await this.reviewRepository.save(review);
        await this.refreshTutorRatingStats(review.tutor.id);

        return { success: true, message: "Review updated successfully", data: saved };
    }
}
