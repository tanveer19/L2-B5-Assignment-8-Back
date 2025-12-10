import { Router } from "express";
import { AdminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/users", auth("ADMIN"), AdminController.getUsers);
router.delete("/users/:id", auth("ADMIN"), AdminController.deleteUser);
router.get("/stats", auth("ADMIN"), AdminController.getStats);

export const adminRoutes = router;
