import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationQueries } from "./queries";
import { jobQueries } from "../jobs/queries";
import type { ICreateApplication } from "./contract";
import { DELETE, POST } from "@/lib/client";

export const useApplications = () => {
  return useQuery(applicationQueries.list);
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICreateApplication) =>
      POST({ url: "/applications", data: input }),

    onSuccess: () => {
      // Invalidate both applications and jobs cache
      // because creating application changes job status too
      queryClient.invalidateQueries({
        queryKey: applicationQueries.list.queryKey,
      });
      queryClient.invalidateQueries({ queryKey: jobQueries.list._def });
      queryClient.invalidateQueries({ queryKey: jobQueries.stats.queryKey });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      DELETE({ url: `/applications/${id}` }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationQueries.list.queryKey,
      });
      queryClient.invalidateQueries({ queryKey: jobQueries.list._def });
      queryClient.invalidateQueries({ queryKey: jobQueries.stats.queryKey });
    },
  });
};