export interface Application {
  id: string;
  job_id: string;
  applied_at: string;
  notes: string | null;
  resume_version: string | null;
}

export interface CreateApplicationInput {
  job_id: string;
  notes?: string;
  resume_version?: string;
}