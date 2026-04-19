import { Router } from "express";
import { jobsRouter } from "./jobs.js";
import { authRouter } from "./auth.js";
import { applicationsRouter } from "./applications.js";

export const router = Router();

router.use("/jobs", jobsRouter);
router.use("/auth", authRouter);
router.use("/applications", applicationsRouter);