import z from "zod";

export const createReviewSchema = z.object({
    rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    review_text: z.string().optional(),
});

export const updateReviewSchema = createReviewSchema;

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
export type UpdateReviewDto = z.infer<typeof updateReviewSchema>;
