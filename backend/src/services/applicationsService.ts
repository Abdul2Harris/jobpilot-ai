import { supabase } from "../config/supabase.js";
import { AppError } from "../middleware/errorHandler.js";
import { jobsService } from "./jobsService.js";
import type { Application, CreateApplicationInput } from "../types/application.types.js";

export const applicationsService = {
  // Get all applications for a user
  async getApplications(userId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from("applications")
      .select("*, jobs(*)")  // join with jobs table
      .eq("user_id", userId)
      .order("applied_at", { ascending: false });

    if (error) {
      throw new AppError(500, `Failed to fetch applications: ${error.message}`);
    }

    return (data as Application[]) ?? [];
  },

  // Create application and update job status to applied atomically
  async createApplication(
    userId: string,
    input: CreateApplicationInput
  ): Promise<Application> {
    // Check job exists
    await jobsService.getJobById(input.job_id);

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: userId,
        job_id: input.job_id,
        notes: input.notes ?? null,
        resume_version: input.resume_version ?? null,
        applied_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      throw new AppError(500, `Failed to create application: ${error?.message}`);
    }

    // Automatically mark job as applied
    await jobsService.updateJobStatus(input.job_id, { status: "applied" });

    return data as Application;
  },

  // Delete application and revert job status back to not_applied
  async deleteApplication(userId: string, applicationId: string): Promise<void> {
    const { data: application, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", applicationId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !application) {
      throw new AppError(404, "Application not found");
    }

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", applicationId);

    if (error) {
      throw new AppError(500, `Failed to delete application: ${error.message}`);
    }

    // Revert job status
    await jobsService.updateJobStatus(application.job_id, {
      status: "not_applied",
    });
  },
};