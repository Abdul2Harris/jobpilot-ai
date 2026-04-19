import type { PaginationParams, PaginatedMeta } from "../types/job.types.js";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const parsePaginationParams = (query: Record<string, unknown>): PaginationParams => {
  const page = Number(query["page"]) || DEFAULT_PAGE;
  const limit = Number(query["limit"]) || DEFAULT_LIMIT;

  return {
    page: Math.max(1, page), // minimum page is 1
    limit: Math.min(Math.max(1, limit), MAX_LIMIT), // between 1 and 100
  };
};

export const getPaginationMeta = (
  total: number,
  params: PaginationParams
): PaginatedMeta => {

  const total_pages = Math.ceil(total / params.limit);

  return {
    total,
    page: params.page,
    limit: params.limit,
    total_pages,
    has_next: params.page < total_pages,
    has_prev: params.page > 1,
  };
};

// Supabase uses offset based pagination
export const getOffset = (params: PaginationParams): number => {
  return (params.page - 1) * params.limit;
};