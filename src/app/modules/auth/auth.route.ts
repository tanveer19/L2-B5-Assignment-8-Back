import express from "express";
import { registerUser, loginUser, logoutUser } from "./auth.controller";
import { registerValidation, loginValidation } from "./auth.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post("/register", validateRequest(registerValidation), registerUser);

router.post("/login", validateRequest(loginValidation), loginUser);

router.post("/logout", logoutUser);

export default router;
