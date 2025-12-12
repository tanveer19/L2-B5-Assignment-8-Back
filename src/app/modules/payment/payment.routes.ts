import express from "express";
import { paymentController } from "./payment.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { paymentValidation } from "./payment.validation";
import { auth } from "../../middlewares/auth";

const router = express.Router();

// Webhook - no auth (Stripe calls this)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

// Protected routes
router.use(auth());

// Create checkout session
router.post(
  "/create-checkout-session",
  validateRequest(paymentValidation.createCheckoutSession),
  paymentController.createCheckoutSession
);

// Verify session
router.get(
  "/verify-session",
  validateRequest(paymentValidation.verifySession),
  paymentController.verifySession
);

// Get my subscription
router.get("/my-subscription", paymentController.getMySubscription);

// Get payment history
router.get("/history", paymentController.getPaymentHistory);

// Cancel subscription
router.post("/cancel-subscription", paymentController.cancelSubscription);

export const paymentRoutes = router;
