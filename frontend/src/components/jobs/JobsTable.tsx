"use client";

import { Table, Typography, Progress } from "antd";


import type { ColumnsType } from "antd/es/table";
import type { IJob } from "@/services/jobs/contract";
import type { IPaginatedMeta } from "@/services/jobs/contract";

interface JobsTableProps {
  data: IJob[];
  pagination: IPaginatedMeta;
  loading: boolean;
  onPageChange: (page: number, pageSize: number) => void;
}

// const statusActions: { key: JobStatus; label: string }[] = [
//   { key: "not_applied", label: "Mark Not Applied" },
//   { key: "applied", label: "Mark Applied" },
//   { key: "interviewing", label: "Mark Interviewing" },
//   { key: "rejected", label: "Mark Rejected" },
//   { key: "offered", label: "Mark Offered" },
// ];

export default function JobsTable({
  data,
  pagination,
  loading,
  onPageChange,
}: JobsTableProps) {
  // const { mutate: updateStatus, isPending } = useUpdateJobStatus();

  const columns: ColumnsType<IJob> = [
    {
      title: "Job",
      key: "job",
      render: (_, record) => (
        <div>
          <Typography.Text strong className="block">
            {record.title ?? "Untitled"}
          </Typography.Text>
          <Typography.Text type="secondary" className="text-sm">
            {record.company ?? "Unknown Company"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location) => location ?? "—",
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (source) => (
        <Typography.Text className="capitalize">
          {source?.replace("_", " ") ?? "—"}
        </Typography.Text>
      ),
    },
    {
      title: "Match Score",
      dataIndex: "similarity",
      key: "similarity",
      sorter: (a, b) => (a.similarity ?? 0) - (b.similarity ?? 0),
      render: (score) =>
        score !== null ? (
          <div className="w-24">
            <Progress
              percent={Math.round(score * 100)}
              size="small"
              strokeColor={
                score >= 0.8
                  ? "#22c55e"
                  : score >= 0.6
                  ? "#f59e0b"
                  : "#ef4444"
              }
            />
          </div>
        ) : (
          "—"
        ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => <JobStatusBadge status={status} />,
    // },
    {
      title: "Applied",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) =>
        new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      title: "Job Url",
      dataIndex: "url",
      key: "url",
      render: (url) => (
        <a href={url ?? "#"} target="_blank" rel="noopener noreferrer">
          View Job
        </a>
      ),
    },
    {
      title: "Actions",
      key: "actions",
    //   render: (_, record) => {
    //     const items: MenuProps["items"] = [
    //       // Link to job
    //       {
    //         key: "link",
    //         icon: <LinkOutlined />,
    //         label: (
              
    //             href={record.job_url ?? "#"}
    //             target="_blank"
    //             rel="noopener noreferrer"
    //           >
    //             View Job
    //           </a>
    //         ),
    //       },
    //       { type: "divider" },
    //       // Status update options
    //       ...statusActions
    //         .filter((s) => s.key !== record.status)
    //         .map((s) => ({
    //           key: s.key,
    //           label: s.label,
    //           onClick: () =>
    //             updateStatus({ id: record.id, input: { status: s.key } }),
    //         })),
    //     ];

    //     return (
    //       <Space>
    //         <Dropdown menu={{ items }} trigger={["click"]}>
    //           <Button
    //             icon={<MoreOutlined />}
    //             size="small"
    //             loading={isPending}
    //           />
    //         </Dropdown>
    //       </Space>
    //     );
    //   },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `${total} jobs found`,
        onChange: onPageChange,
      }}
      scroll={{ x: "max-content" }}
    />
  );
}