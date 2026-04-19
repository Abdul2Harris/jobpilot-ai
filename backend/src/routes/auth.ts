import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

export const authRouter = Router();

authRouter.use(authenticate);

// POST /api/v1/auth/onboard
authRouter.post("/onboard", ...authController.onboardUser);

// GET /api/v1/auth/profile
authRouter.get("/profile", ...authController.getProfile);

// PATCH /api/v1/auth/profile
authRouter.patch("/profile", ...authController.updateProfile);

