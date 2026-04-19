export type JobStatus =
  | "not_applied"
  | "applied"
  | "interviewing"
  | "rejected"
  | "offered";

export type JobSource =
  | "naukri"
  | "internshala"
  | "company_website"
  | "other";

export interface Job {
  id: string;
  title: string | null;
  company: string | null;
  location: string
  description: string | null;
  job_url: string | null;
  source: JobSource | null;
  match_score: number | null;
  status: JobStatus;
  created_at: string;
  similarity: number;
}

// What frontend sends when filtering jobs
export interface JobFilters {
  status?: JobStatus;
  source?: JobSource;
  location?: string;
  min_match_score?: number;
  search?: string; // search across title and company
}

// What frontend sends for pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// What Express sends back to frontend
export interface PaginatedJobsResponse {
  data: Job[];
  pagination: PaginatedMeta;
}

// When updating job status
export interface UpdateJobStatusInput {
  status: JobStatus;
}

