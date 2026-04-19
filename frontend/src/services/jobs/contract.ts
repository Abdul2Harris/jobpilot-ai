export type JobStatus =
  | "not_applied"
  | "applied"
  | "interviewing"
  | "rejected"
  | "offered";

export type JobSource =
  // | "linkedin"
  | "naukri"
  // | "indeed"
  | "company_website"
  | "internshala"
  | "other";

export interface IJob {
  id: string;
  title: string | null;
  company: string | null;
  location: string | null;
  url: string | null;
  experience: string | null;
  salary: string | null;
  skills: string[];
  source: JobSource | null;
  similarity: number; // main ranking score
  status?: JobStatus; // optional if not from backend
  description?: string | null;
}

export interface IJobFilters {
  status?: JobStatus;
  source?: JobSource;
  location?: string;
  min_match_score?: number;
  search?: string;
  page?: number;
  limit?: number;
  job_title?: string;
  jobTitlepages?: number;
}

export interface IPaginatedMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface IPaginatedJobsResponse {
  data: IJob[];
  pagination: IPaginatedMeta;
}

export interface IAppliedJobsResponse {
  status: string; 
  data: IJob[];
}

export interface IJobStats {
  not_applied: number;
  applied: number;
  interviewing: number;
  rejected: number;
  offered: number;
}

export interface IJobStatsResponse {
  status: string;
  data: IJobStats;
}

export interface IUpdateJobStatus {
  status: JobStatus;
}
