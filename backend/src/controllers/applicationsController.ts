import type { Request, Response } from "express";
import { catchAsync } from "../middleware/catchAsync.js";
import { applicationsService } from "../services/applicationsService.js";
import type { CreateApplicationInput } from "../types/application.types.js";
import type { AuthUser } from "../types/auth.types.js";

export const applicationsController = {
  // GET /api/v1/applications
  getApplications: catchAsync(async (_req: Request, res: Response) => {
    const user = res.locals["user"] as AuthUser;

    const applications = await applicationsService.getApplications(user.id);

    res.status(200).json({
      status: "success",
      data: applications,
    });
  }),

  // POST /api/v1/applications
  createApplication: catchAsync(async (req: Request, res: Response) => {
    const user = res.locals["user"] as AuthUser;
    const input = req.body as CreateApplicationInput;

    if (!input.job_id) {
      res.status(400).json({
        status: "error",
        message: "job_id is required",
      });
      return;
    }

    const application = await applicationsService.createApplication(
      user.id,
      input
    );

    res.status(201).json({
      status: "success",
      data: application,
    });
  }),

  // DELETE /api/v1/applications/:id
  deleteApplication: catchAsync(async (req: Request, res: Response) => {
    const user = res.locals["user"] as AuthUser;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        status: "error",
        message: "Application id is required",
      });
      return;
    }

    await applicationsService.deleteApplication(user.id, id);

    res.status(200).json({
      status: "success",
      message: "Application deleted successfully",
    });
  }),
};