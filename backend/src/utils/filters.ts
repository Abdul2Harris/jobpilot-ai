import type { JobFilters } from "../types/job.types.js";
import type { JobStatus, JobSource } from "../types/job.types.js";

const VALID_STATUSES: JobStatus[] = [
  "not_applied",
  "applied",
  "interviewing",
  "rejected",
  "offered",
];

const VALID_SOURCES: JobSource[] = [
  "naukri",
  "internshala",
  "company_website",
  "other",
];

export const parseJobFilters = (query: Record<string, unknown>): JobFilters => {
  const filters: JobFilters = {};

  // Validate status
  if (query["status"]) {
    const status = query["status"] as string;
    if (VALID_STATUSES.includes(status as JobStatus)) {
      filters.status = status as JobStatus;
    }
  }

  // Validate source
  if (query["source"]) {
    const source = query["source"] as string;
    if (VALID_SOURCES.includes(source as JobSource)) {
      filters.source = source as JobSource;
    }
  }

  // Location - just trim whitespace
  if (query["location"] && typeof query["location"] === "string") {
    filters.location = query["location"].trim();
  }

  // Match score - must be between 0 and 100
  if (query["min_match_score"]) {
    const score = Number(query["min_match_score"]);
    if (!isNaN(score) && score >= 0 && score <= 100) {
      filters.min_match_score = score;
    }
  }

  // Search term - trim whitespace
  if (query["search"] && typeof query["search"] === "string") {
    filters.search = query["search"].trim();
  }

  return filters;
};