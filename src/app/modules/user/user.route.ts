import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

// explore route (available for both logged out & logged in)
router.get("/", userController.getAllUsers);

router.get("/:id", userController.getSingleUser);

router.patch("/:id", auth(), userController.updateUserProfile);

export const userRoutes = router;
