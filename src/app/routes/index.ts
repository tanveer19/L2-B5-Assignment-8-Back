import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export default router;
