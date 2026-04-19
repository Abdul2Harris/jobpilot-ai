import { Router } from "express";
import { applicationsController } from "../controllers/applicationsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

export const applicationsRouter = Router();

applicationsRouter.use(authenticate);

// GET /api/v1/applications
applicationsRouter.get("/", ...applicationsController.getApplications);

// POST /api/v1/applications
applicationsRouter.post("/", ...applicationsController.createApplication);

// DELETE /api/v1/applications/:id
applicationsRouter.delete("/:id", ...applicationsController.deleteApplication);