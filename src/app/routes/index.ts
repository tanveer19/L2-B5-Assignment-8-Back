import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";
import { travelPlanRoutes } from "../modules/travelPlans/travelPlan.route";
import { reviewRoutes } from "../modules/review/review.route";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/travel-plans", travelPlanRoutes);
router.use("/reviews", reviewRoutes);

export default router;
