import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validators/auth.schemas";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);

export default router;
