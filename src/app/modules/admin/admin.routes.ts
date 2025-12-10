import { Router } from "express";
import { AdminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

// User routes
router.get("/users", auth("ADMIN"), AdminController.getUsers);
router.patch(
  "/users/:id/block",
  auth("ADMIN"),
  AdminController.blockUnblockUser
);

// Dashboard stats
router.get("/stats", auth("ADMIN"), AdminController.getStats);

// Travel plan routes
router.get("/travel-plans", auth("ADMIN"), AdminController.getTravelPlans);
router.delete(
  "/travel-plans/:id",
  auth("ADMIN"),
  AdminController.deleteTravelPlan
);
router.patch(
  "/travel-plans/:id",
  auth("ADMIN"),
  AdminController.updateTravelPlan
);

export const adminRoutes = router;
