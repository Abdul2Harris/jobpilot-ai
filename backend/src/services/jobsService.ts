import { supabase } from "../config/supabase.js";
import { AppError } from "../middleware/errorHandler.js";
import { getOffset, getPaginationMeta } from "../utils/pagination.js";
import type {
  Job,
  JobFilters,
  JobStatus,
  PaginatedJobsResponse,
  UpdateJobStatusInput,
} from "../types/job.types.js";
import type { PaginationParams } from "../types/job.types.js";
import axios from "axios";

export const jobsService = {
  // Get all jobs with filters and pagination
  async getJobs(
    filters: JobFilters,
    pagination: PaginationParams,
    userId: string,
  ): Promise<PaginatedJobsResponse> {
    const offset = getOffset(pagination);
    // const end = offset + pagination.limit - 1;

    // 1. Fetch user's resume embedding from profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("resume_embedding")
      .eq("auth_user_id", userId)
      .single();

    if (profileError || !profile?.resume_embedding) {
      throw new AppError(
        500,
        "Resume embedding not found. Please re-upload your resume.",
      );
    }

    // 2. Call match_jobs RPC with embedding + pagination
    const { data, error } = await supabase.rpc("match_jobs", {
      query_embedding: profile.resume_embedding,
      filter_user_id: userId,
      match_count: pagination.limit,
      match_offset: offset,
    });

    if (error) {
      throw new AppError(500, `Failed to fetch matched jobs: ${error.message}`);
    }

    // 1. Extract total from the first row (if it exists)
    const totalJobs = data.length > 0 ? data[0].total_count : 0;

    // 2. Map the data to remove total_count from individual job objects if you want it "clean"
    const cleanJobs = (data as (Job & { total_count: number })[]).map(
      ({ total_count, ...job }) => job,
    );

    // 3. Apply filters client-side (since RPC doesn't support dynamic filters)
    let filtered = (cleanJobs as Job[]) ?? [];

    // Dynamically apply filters only if they exist
    if (filters.source) {
      filtered = filtered.filter((j) => j.source === filters.source);
    }

    if (filters.status) {
      filtered = filtered.filter((j) => j.status === filters.status);
    }

    // if (filters.location) {
    //   filtered = filtered.filter((j) =>
    //     j.location.toLowerCase().includes(filters.location!.toLowerCase()),
    //   );
    // }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.company?.toLowerCase().includes(q),
      );
    }

    if (filters.min_match_score !== undefined) {
      const threshold = filters.min_match_score / 100;

      filtered = filtered.filter((j) => j.similarity >= threshold);
    }

    // const { data, error, count } = await query;

    return {
      data: filtered,
      pagination: getPaginationMeta(totalJobs, pagination),
    };
  },

  async scrapeJobsAndN8nJobParsing(
    scrapePayload: Record<string, unknown>,
    userId: string,
  ): Promise<any> {
    // console.log("scrapePayload:", scrapePayload);

    // 1. Scrape jobs based on job_title
    const API_BASE_URL = process.env.SCRAPER_API_URL;

    let scrapedJobsRes;
    try {
      // console.log("API_BASE_URL:", API_BASE_URL);

      scrapedJobsRes = await axios.post(`${API_BASE_URL}/scrape`, {
        keyword: scrapePayload.job_title,
        pages: scrapePayload.jobTitlepages ?? 1,
        sources: ["naukri", "internshala"],
      });
    } catch (error: any) {
      // console.error("AXIOS ERROR:", error.response?.data || error.message);
      throw new AppError(500, `Failed to scrape jobs: ${error.message}`);
    }

    const jobs = scrapedJobsRes.data.jobs;
    // console.log("jobs:",jobs);

    if (!jobs || jobs.length === 0) {
      throw new AppError(404, "No jobs found for this search.");
    }

    // 2. Call n8n webhook and wait for job parsing + embedding to complete
    let n8nResponse;
    try {
      n8nResponse = await axios.post(
        `${process.env.N8N_JOB_PARSER_URL}`,
        {
          jobs: jobs,
          auth_user_id: userId,
        },
      );
      console.log("n8n response:", n8nResponse.data);
    } catch (n8nError: any) {
      console.error("n8n job parser failed:", n8nError.message);
      throw new AppError(500, `Job processing failed: ${n8nError.response?.data ?? n8nError.message}`);
    }

    // 3. Return success only after n8n confirms all jobs are parsed + stored
    return {
      success: true,
      message: "Jobs scraped and processed successfully",
      data: n8nResponse.data,
    };
  },

  // Get single job by id
  async getJobById(id: string): Promise<Job> {
    // console.log("getJobBYid:", id);

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      throw new AppError(404, "Job not found");
    }

    return data as Job;
  },

  // Get jobs grouped by status — useful for dashboard
  async getJobStats(authUserId: string): Promise<Record<JobStatus, number>> {
    const { data, error } = await supabase
      .from("jobs")
      .select("status")
      .eq("auth_user_id", authUserId);

    if (error) {
      throw new AppError(500, `Failed to fetch job stats: ${error.message}`);
    }

    // Count each status
    const stats = {
      not_applied: 0,
      applied: 0,
      interviewing: 0,
      rejected: 0,
      offered: 0,
    } as Record<JobStatus, number>;

    for (const job of data ?? []) {
      const status = job.status as JobStatus;
      if (status in stats) {
        stats[status]++;
      }
    }

    return stats;
  },

  async getApplications(userId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("auth_user_id", userId)
      .neq("status", "not_applied")
      .order("created_at", { ascending: false });

    // console.log("data:", data);

    if (error) {
      throw new AppError(500, `Failed to fetch applications: ${error.message}`);
    }

    return (data as Job[]) ?? [];
  },

  async updateJobStatus(jobId: string, status: JobStatus) {
    const { data, error } = await supabase
      .from("jobs")
      .update({ status: status })
      .eq("id", jobId)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(500, `Failed to update job status: ${error?.message}`);
    }

    return data as Job;
  },
};
