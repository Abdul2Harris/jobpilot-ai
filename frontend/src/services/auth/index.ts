import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PATCH, POST } from "@/lib/client";
import type { ICreateProfile, IUpdateProfile } from "./contract";
import { authQueries } from "./queries";
import { notification } from "antd";

export const useProfile = () => {
  return useQuery(authQueries.profile);
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IUpdateProfile) =>
      PATCH({ url: "/auth/profile", params: input }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authQueries.profile.queryKey,
      });
    },
  });
};

export const useOnBoardUserFn = () => {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICreateProfile) => {
      // console.log("Onboarding Input Data:", input); // Log the input here
      return POST({ url: "/auth/onboard", data: input });
    },

    onSuccess: () => {
      notification.success({ message: "Onboarding successful" });
    },
    onError: (err: any) => {
      const errorDescription =
        err.response?.data?.message || // Common for Axios
        err.message || // Standard JS error
        "An unexpected error occurred.";

      notification.error({
        message: "Onboarding failed",
        description: errorDescription, // This shows the detail below the title
      });
    },
  });
};
