import { z } from "zod";

export const reviewValidation = {
  createReview: z.object({
    body: z.object({
      reviewedUserId: z
        .string({ message: "Reviewed user ID is required" })
        .uuid("Invalid user ID format"),
      rating: z
        .number({ message: "Rating is required" })
        .int("Rating must be an integer")
        .min(1, "Rating must be at least 1 star")
        .max(5, "Rating must be at most 5 stars"),
      comment: z
        .string({ message: "Comment is required" })
        .min(5, "Comment must be at least 10 characters")
        .max(1000, "Comment must not exceed 1000 characters"),
    }),
  }),

  updateReview: z.object({
    body: z
      .object({
        rating: z
          .number()
          .int("Rating must be an integer")
          .min(1, "Rating must be at least 1 star")
          .max(5, "Rating must be at most 5 stars")
          .optional(),
        comment: z
          .string()
          .min(5, "Comment must be at least 10 characters")
          .max(1000, "Comment must not exceed 1000 characters")
          .optional(),
      })
      .refine(
        (data) => data.rating !== undefined || data.comment !== undefined,
        { message: "At least one field (rating or comment) must be provided" }
      ),
    params: z.object({
      id: z.string({ message: "Review ID is required" }),
    }),
  }),

  getReviewById: z.object({
    params: z.object({
      id: z.string({ message: "Review ID is required" }),
    }),
  }),

  getUserReviews: z.object({
    params: z.object({
      userId: z.string({ message: "User ID is required" }),
    }),
  }),

  getUserAverage: z.object({
    params: z.object({
      userId: z.string({ message: "User ID is required" }),
    }),
  }),
};
