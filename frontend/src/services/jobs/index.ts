import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobQueries } from "./queries";
import { PATCH, POST } from "@/lib/client";
import type { IJobFilters, IUpdateJobStatus } from "./contract";

// Get paginated jobs with filters
export const useJobs = (filters: IJobFilters = {}) => {
  return useQuery(jobQueries.list(filters));
};

// Get single job
export const useJobById = (id: string) => {
  return useQuery({
    ...jobQueries.detail(id),
    enabled: !!id,
  });
};

// Get dashboard stats
export const useJobStats = () => {
  return useQuery(jobQueries.stats);
};

// Update job status — mutation automatically invalidates job list cache
export const useUpdateJobStatus = () => {
  //   const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      console.log("id:", id);
      console.log("status:", status);
      return PATCH({ url: `/jobs/${id}/status`, data: {status} })
    },

  });
};

export const useJobsSearch = () => {
  return useMutation({
    mutationFn: (input: {job_title: string, sources: string[]}) => {
      console.log("input:",input);
      return POST({ url: `/jobs/search`, data: input })
    }
  })
};

export const useJobsApplications = () => {
  return useQuery(jobQueries.applications());
};