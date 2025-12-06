import express from "express";
import { TravelPlanController } from "./travelPlan.controller";
import {
  createTravelPlanSchema,
  updateTravelPlanSchema,
} from "./travelPlan.validation";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(createTravelPlanSchema),
  TravelPlanController.create
);
router.get("/public", TravelPlanController.listPublic); // public listing with filters
router.get("/me", auth(), TravelPlanController.myPlans); // current user's plans
router.get("/:id", TravelPlanController.get); // detail view (respects visibility)
router.patch(
  "/:id",
  auth(),
  validateRequest(updateTravelPlanSchema),
  TravelPlanController.update
);
router.delete("/:id", auth(), TravelPlanController.remove);

export const travelPlanRoutes = router;
