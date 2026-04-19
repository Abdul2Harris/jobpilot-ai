import { Router } from "express";
import { jobsController } from "../controllers/jobsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

export const jobsRouter = Router();

// All job routes are protected
jobsRouter.use(authenticate);

// GET /api/v1/jobs
jobsRouter.get("/", ...jobsController.getJobs);

// GET /api/v1/jobs/stats
jobsRouter.get("/stats", ...jobsController.getJobStats);

// GET /api/v1/jobs/applications
jobsRouter.get("/applications", authenticate, jobsController.getApplications);

// GET /api/v1/jobs/:id
jobsRouter.get("/:id", ...jobsController.getJobById);

// PATCH /api/v1/jobs/:id/status
jobsRouter.patch("/:id/status", ...jobsController.updateJobStatus);

// POST /api/v1/jobs/search
jobsRouter.post("/search", ...jobsController.scrapeJobs);
