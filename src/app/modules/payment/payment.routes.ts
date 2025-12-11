import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create-subscription",
  auth("USER"),
  PaymentController.createSubscriptionSession
);
router.post(
  "/create-verified-badge",
  auth("USER"),
  PaymentController.createOneTimeSession
);

export const paymentRoutes = router;
