import { Router } from "express";
import { AdminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/users", auth("ADMIN"), AdminController.getUsers);
router.get("/stats", auth("ADMIN"), AdminController.getStats);

// Block / Unblock a user
router.patch("/users/:id/block", AdminController.blockUnblockUser);

export const adminRoutes = router;
