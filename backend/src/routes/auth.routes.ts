import express from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validators/auth.schemas";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.get("/me", protect, getCurrentUser);

export default router;
