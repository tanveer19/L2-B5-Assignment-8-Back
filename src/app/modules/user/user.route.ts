import express from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = express.Router();

// POST /api/users/register - Register new user
router.post(
  "/register",
  validateRequest(userValidation.registerUser),
  userController.registerUser
);

export const userRoutes = router;
