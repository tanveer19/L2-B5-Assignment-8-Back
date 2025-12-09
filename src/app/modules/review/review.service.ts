import prisma from "../../config/prisma";
import AppError from "../../errorHelpers/AppError";
import {
  ICreateReview,
  IUpdateReview,
  IUserRatingStats,
} from "./review.interface";

const createReview = async (reviewerId: string, payload: ICreateReview) => {
  // Check if reviewer exists
  const reviewer = await prisma.user.findUnique({
    where: { id: reviewerId },
  });

  if (!reviewer) {
    throw new AppError(404, "Reviewer not found");
  }

  // Check if reviewed user exists
  const reviewedUser = await prisma.user.findUnique({
    where: { id: payload.reviewedUserId },
  });

  if (!reviewedUser) {
    throw new AppError(404, "User to review not found");
  }

  // Prevent self-review
  if (reviewerId === payload.reviewedUserId) {
    throw new AppError(400, "You cannot review yourself");
  }

  // Check if review already exists (handled by unique constraint, but better UX)
  const existingReview = await prisma.review.findUnique({
    where: {
      reviewerId_reviewedUserId: {
        reviewerId,
        reviewedUserId: payload.reviewedUserId,
      },
    },
  });

  if (existingReview) {
    throw new AppError(
      400,
      "You have already reviewed this user. You can edit your existing review instead."
    );
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      reviewerId,
      reviewedUserId: payload.reviewedUserId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      reviewer: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
      reviewedUser: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  return review;
};

const getReviewsByUser = async (userId: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Get all reviews for this user
  const reviews = await prisma.review.findMany({
    where: { reviewedUserId: userId },
    include: {
      reviewer: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const getMyReviews = async (reviewerId: string) => {
  // Get all reviews written by this user
  const reviews = await prisma.review.findMany({
    where: { reviewerId },
    include: {
      reviewedUser: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const getReviewById = async (id: string, requesterId?: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      reviewer: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
      reviewedUser: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
    },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  return review;
};

const updateReview = async (
  id: string,
  reviewerId: string,
  payload: IUpdateReview
) => {
  // Check if review exists
  const existingReview = await prisma.review.findUnique({
    where: { id },
  });

  if (!existingReview) {
    throw new AppError(404, "Review not found");
  }

  // Check if user is the reviewer
  if (existingReview.reviewerId !== reviewerId) {
    throw new AppError(403, "You can only edit your own reviews");
  }

  // Update review
  const updatedReview = await prisma.review.update({
    where: { id },
    data: payload,
    include: {
      reviewer: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
      reviewedUser: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
    },
  });

  return updatedReview;
};

const deleteReview = async (id: string, reviewerId: string) => {
  // Check if review exists
  const existingReview = await prisma.review.findUnique({
    where: { id },
  });

  if (!existingReview) {
    throw new AppError(404, "Review not found");
  }

  // Check if user is the reviewer
  if (existingReview.reviewerId !== reviewerId) {
    throw new AppError(403, "You can only delete your own reviews");
  }

  // Delete review
  await prisma.review.delete({
    where: { id },
  });

  return null;
};

const getUserAverageRating = async (
  userId: string
): Promise<IUserRatingStats> => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Get all reviews for this user
  const reviews = await prisma.review.findMany({
    where: { reviewedUserId: userId },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    return {
      userId,
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {
        "5": 0,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0,
      },
    };
  }

  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = parseFloat((totalRating / reviews.length).toFixed(2));

  // Calculate rating distribution
  const ratingDistribution = {
    "5": reviews.filter((r) => r.rating === 5).length,
    "4": reviews.filter((r) => r.rating === 4).length,
    "3": reviews.filter((r) => r.rating === 3).length,
    "2": reviews.filter((r) => r.rating === 2).length,
    "1": reviews.filter((r) => r.rating === 1).length,
  };

  return {
    userId,
    averageRating,
    totalReviews: reviews.length,
    ratingDistribution,
  };
};

export const reviewService = {
  createReview,
  getReviewsByUser,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getUserAverageRating,
};
