import type { Request, Response } from "express";
import { catchAsync } from "../middleware/catchAsync.js";
import { jobsService } from "../services/jobsService.js";
import { parseJobFilters } from "../utils/filters.js";
import { parsePaginationParams } from "../utils/pagination.js";
import type { UpdateJobStatusInput } from "../types/job.types.js";
import type { AuthUser } from "../types/auth.types.js";

export const jobsController = {
  // GET /api/v1/jobs
  getJobs: catchAsync(async (req: Request, res: Response) => {
    console.log("req.query:", req.query);
    const filters = parseJobFilters(req.query as Record<string, unknown>);
    // console.log("filters:", filters);
    const pagination = parsePaginationParams(
      req.query as Record<string, unknown>,
    );
    console.log("pagination:", pagination);

    const userId = res.locals["user"].id;
    // console.log('scrapePayload:', scrapePayload);
    const result = await jobsService.getJobs(filters, pagination, userId);

    res.status(200).json({
      status: "success",
      ...result,
    });
  }),

  // GET /api/v1/jobs/stats
  getJobStats: catchAsync(async (_req: Request, res: Response) => {
    const stats = await jobsService.getJobStats();

    res.status(200).json({
      status: "success",
      data: stats,
    });
  }),

  // GET /api/v1/jobs/:id
  getJobById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        status: "error",
        message: "Job id is required",
      });
      return;
    }

    const job = await jobsService.getJobById(String(id));

    res.status(200).json({
      status: "success",
      data: job,
    });
  }),

  scrapeJobs: catchAsync(async (req: Request, res: Response) => {
    const { job_title, sources } = req.body;

    console.log("req.body:", req.body);

    const userId = res.locals["user"].id;

    const scrapePayload = {
      job_title,
      jobTitlepages: 1,
      sources,
    };

    console.log("scrapePayload:", scrapePayload);

    const jobs = await jobsService.scrapeJobsAndN8nJobParsing(
      scrapePayload,
      userId,
    );

    res.status(200).json({
      status: "success",
      message: "Jobs ready",
    });
  }),

  // In jobsController
  getApplications: catchAsync(async (_req: Request, res: Response) => {
    const userId = res.locals["user"].id;
    console.log("userId:", userId);
    const data = await jobsService.getApplications(userId);

    res.status(200).json({ status: "success", data });
  }),

  updateJobStatus: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = res.locals["user"].id;

    console.log("req.body:", req.body);
    
    const validStatuses = [
      "not_applied",
      "applied",
      "interviewing",
      "offered",
      "rejected",
    ];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ status: "error", message: "Invalid status" });
      return;
    }

    const data = await jobsService.updateJobStatus(userId, String(id), status);

    res.status(200).json({ status: "success", data });
  }),
};
