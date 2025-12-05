import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/:id", userController.getSingleUser);
router.patch(
  "/:id",
  auth(), // check JWT
  userController.updateUserProfile
);

export const userRoutes = router;
