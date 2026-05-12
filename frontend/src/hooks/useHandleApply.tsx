import { useUpdateJobStatus } from "@/services/jobs";
import { useQueryClient } from "@tanstack/react-query";
import { App } from "antd";

export const useHandleApply = ({
  jobId,
  status,
  setApplied,
}: {
  jobId: string;
  status: string;
  setApplied: any;
}) => {
  const updateStatus = useUpdateJobStatus();
  const queryClient = useQueryClient();

  const { notification } = App.useApp(); // ✅ Context-aware notification

  // ✅ Return a function instead of running logic directly
  return () => {
    updateStatus.mutate(
      { id: jobId, status: status ?? "applied" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["applications"] });
          notification.success({ message: "Status Updated" });
        },
      },
    );

    setApplied(true);
  };
};
