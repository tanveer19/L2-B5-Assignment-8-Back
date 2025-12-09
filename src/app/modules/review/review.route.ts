import express from "express";
import { reviewController } from "./review.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewValidation } from "./review.validation";
import { auth } from "../../middlewares/auth";

const router = express.Router();

// All routes require authentication
// router.use(auth());

// Create a new review
router.post(
  "/",
  auth(),
  validateRequest(reviewValidation.createReview),
  reviewController.createReview
);

// Get reviews I wrote
router.get("/my-reviews", auth(), reviewController.getMyReviews);

// Get all reviews for a specific user
router.get(
  "/user/:userId",
  validateRequest(reviewValidation.getUserReviews),
  reviewController.getReviewsByUser
);

// Get average rating for a specific user
router.get(
  "/user/:userId/average",
  validateRequest(reviewValidation.getUserAverage),
  reviewController.getUserAverageRating
);

// Get single review by ID
router.get(
  "/:id",
  validateRequest(reviewValidation.getReviewById),
  reviewController.getReviewById
);

// Update review (only own reviews)
router.patch(
  "/:id",
  auth(),
  validateRequest(reviewValidation.updateReview),
  reviewController.updateReview
);

// Delete review (only own reviews)
router.delete(
  "/:id",
  auth(),
  validateRequest(reviewValidation.getReviewById),
  reviewController.deleteReview
);

export const reviewRoutes = router;
