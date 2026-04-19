"use client";

import { Typography, Spin, Empty, Tag, Button, Select } from "antd";
import {
  PaperPlaneTilt,
  ChatCircleDots,
  Trophy,
  XCircle,
} from "@phosphor-icons/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { IJob } from "@/services/jobs/contract";
import { useJobsApplications, useUpdateJobStatus } from "@/services/jobs";

const { Title, Text } = Typography;

const STATUSES = [
  {
    key: "applied",
    label: "Applied",
    icon: <PaperPlaneTilt size={14} />,
    color: "#f59e0b",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    key: "interviewing",
    label: "Interviewing",
    icon: <ChatCircleDots size={14} />,
    color: "#8b5cf6",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    key: "offered",
    label: "Offered",
    icon: <Trophy size={14} />,
    color: "#22c55e",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: <XCircle size={14} />,
    color: "#ef4444",
    bg: "bg-red-50",
    border: "border-red-200",
  },
];

function ApplicationCard({
  job,
  onStatusChange,
}: {
  job: IJob;
  onStatusChange: (id: string, status: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
      <div>
        <Text strong className="block text-sm leading-snug">
          {job.title ?? "Untitled"}
        </Text>
        <Text type="secondary" className="text-xs">
          {job.company ?? "Unknown"}
        </Text>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {job.location && (
          <Tag className="text-xs rounded-full m-0">{job.location}</Tag>
        )}
        {job.source && (
          <Tag
            className="text-xs rounded-full m-0 capitalize"
            color={job.source === "naukri" ? "blue" : "green"}
          >
            {job.source}
          </Tag>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Select
          size="small"
          value={job.status}
          className="flex-1"
          onChange={(val) => onStatusChange(job.id, val)}
          options={[
            { value: "applied", label: "Applied" },
            { value: "interviewing", label: "Interviewing" },
            { value: "offered", label: "Offered" },
            { value: "rejected", label: "Rejected" },
            { value: "not_applied", label: "Remove" },
          ]}
        />
        <Button
          size="small"
          href={job.url || ""}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </Button>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useJobsApplications();
  const updateStatus = useUpdateJobStatus();

  // const { mutate: updateStatus } = useMutation({
  //   mutationFn: ({ id, status }: { id: string; status: string }) =>
  //     axios.patch(`/api/v1/jobs/${id}/status`, { status }),
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
  // });

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["applications"] }),
      },
    );
  };

  const jobs = data?.data ?? [];

  const grouped = STATUSES.reduce(
    (acc, s) => {
      acc[s.key] = (jobs).filter((j) => j.status === s.key);
      return acc;
    },
    {} as Record<string, IJob[]>,
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Appplications</h1>
        <p className="text-sm text-on-surface-variant">
          Track all your job applications in one place
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spin size="large" />
        </div>
      ) : !jobs?.length ? (
        <div className="flex justify-center py-24">
          <Empty description="No applications yet. Mark jobs as applied from the Jobs page." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUSES.map((s) => (
            <div
              key={s.key}
              className={`rounded-xl border ${s.border} ${s.bg} p-4`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <Text strong className="text-sm" style={{ color: s.color }}>
                    {s.label}
                  </Text>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: s.color + "20", color: s.color }}
                >
                  {grouped[s.key]?.length ?? 0}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3">
                {grouped[s.key]?.length === 0 ? (
                  <div className="text-center py-8">
                    <Text type="secondary" className="text-xs">
                      No jobs here
                    </Text>
                  </div>
                ) : (
                  grouped[s.key].map((job) => (
                    <ApplicationCard
                      key={job.id}
                      job={job}
                      onStatusChange={(id, status) =>
                        handleUpdateStatus(id, status)
                      }
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
