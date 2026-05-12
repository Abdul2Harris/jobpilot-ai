import { createQueryKeys } from "@lukemorales/query-key-factory";
import { GET } from "@/lib/client";
import type { IJobFilters, IPaginatedJobsResponse, IJob, IAppliedJobsResponse, IJobStatsResponse } from "./contract";

export const jobQueries = createQueryKeys("jobs", {
  list: (filters: IJobFilters) => ({
    queryKey: [filters],
    queryFn: (): Promise<IPaginatedJobsResponse> =>
      GET({ url: "/jobs", params: filters }),
  }),

  detail: (id: string) => ({
    queryKey: [id],
    queryFn: (): Promise<IJob> =>
      GET({ url: `/jobs/${id}` }),
  }),

  stats: {
    queryKey: null,
    queryFn: (): Promise<IJobStatsResponse> =>
      GET({ url: "/jobs/stats" }),
  },

  applications: () => ({
    queryKey: ["applications"],
    queryFn: (): Promise<IAppliedJobsResponse> =>
      GET({ url: "/jobs/applications"}),
  }),
});