import express from "express";
import { registerUser } from "./auth.controller";
import { registerValidation } from "./auth.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post("/register", validateRequest(registerValidation), registerUser);

export default router;
