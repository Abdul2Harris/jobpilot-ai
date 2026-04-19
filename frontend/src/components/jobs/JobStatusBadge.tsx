import { Tag } from "antd";
import type { JobStatus } from "@/services/jobs/contract";

const statusConfig: Record<JobStatus, { color: string; label: string }> = {
  not_applied: { color: "default", label: "Not Applied" },
  applied: { color: "blue", label: "Applied" },
  interviewing: { color: "purple", label: "Interviewing" },
  rejected: { color: "red", label: "Rejected" },
  offered: { color: "green", label: "Offered" },
};

export default function JobStatusBadge({ status }: { status: JobStatus }) {
  const config = statusConfig[status];
  return <Tag color={config.color}>{config.label}</Tag>;
}