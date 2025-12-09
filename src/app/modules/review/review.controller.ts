import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const reviewerId = req.user!.id;
  const result = await reviewService.createReview(reviewerId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review created successfully",
    data: result,
  });
});

const getReviewsByUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await reviewService.getReviewsByUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const reviewerId = req.user!.id;
  const result = await reviewService.getMyReviews(reviewerId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Your reviews retrieved successfully",
    data: result,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const requesterId = req.user?.userId;
  const result = await reviewService.getReviewById(id, requesterId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const reviewerId = req.user!.id;
  const result = await reviewService.updateReview(id, reviewerId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const reviewerId = req.user!.id;
  await reviewService.deleteReview(id, reviewerId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review deleted successfully",
    data: null,
  });
});

const getUserAverageRating = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await reviewService.getUserAverageRating(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User rating statistics retrieved successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getReviewsByUser,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getUserAverageRating,
};
