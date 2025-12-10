import { Router } from "express";
import { AdminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/users", auth("ADMIN"), AdminController.getUsers);
router.get("/stats", auth("ADMIN"), AdminController.getStats);
router.patch("/users/:id/block", AdminController.blockUnblockUser);

// Travel plans routes
router.get("/travel-plans", AdminController.getTravelPlans);
router.delete("/travel-plans/:id", AdminController.deleteTravelPlan);
router.patch("/travel-plans/:id", AdminController.updateTravelPlan);

export const adminRoutes = router;
