import { IJob } from "../jobs/contract";

export interface IApplication {
  id: string;
  job_id: string;
  applied_at: string;
  notes: string | null;
  resume_version: string | null;
  job?: IJob;
}

export interface ICreateApplication {
  job_id: string;
  notes?: string;
  resume_version?: string;
}