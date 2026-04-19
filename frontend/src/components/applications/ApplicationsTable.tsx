"use client";

import { Table, Button, Tag, Typography, Popconfirm, Space } from "antd";
import { DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { IApplication } from "@/services/applications/contract";
import { useDeleteApplication } from "@/services/applications";

interface ApplicationsTableProps {
  data: IApplication[];
  loading: boolean;
}

export default function ApplicationsTable({
  data,
  loading,
}: ApplicationsTableProps) {
  const { mutate: deleteApplication, isPending } = useDeleteApplication();

  const columns: ColumnsType<IApplication> = [
    {
      title: "Job",
      key: "job",
      render: (_, record) => (
        <div>
          <Typography.Text strong className="block">
            {record.job?.title ?? "Untitled"}
          </Typography.Text>
          <Typography.Text type="secondary" className="text-sm">
            {record.job?.company ?? "Unknown Company"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) => record.job?.location ?? "—",
    },
    {
      title: "Source",
      key: "source",
      render: (_, record) => (
        <Typography.Text className="capitalize">
          {record.job?.source?.replace("_", " ") ?? "—"}
        </Typography.Text>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const status = record.job?.status;
        const colorMap: Record<string, string> = {
          applied: "blue",
          interviewing: "purple",
          rejected: "red",
          offered: "green",
          not_applied: "default",
        };
        return (
          <Tag color={status ? colorMap[status] : "default"}>
            {status?.replace("_", " ") ?? "—"}
          </Tag>
        );
      },
    },
    {
      title: "Applied At",
      dataIndex: "applied_at",
      key: "applied_at",
      render: (date) =>
        new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (notes) => notes ?? "—",
    },
    {
      title: "Resume Version",
      dataIndex: "resume_version",
      key: "resume_version",
      render: (version) => version ?? "—",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.job?.job_url && (
            <Button
              icon={<LinkOutlined />}
              size="small"
              href={record.job.job_url}
              target="_blank"
            >
              View Job
            </Button>
          )}
          <Popconfirm
            title="Delete application"
            description="This will revert the job status to not applied."
            onConfirm={() => deleteApplication(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              loading={isPending}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `${total} applications`,
      }}
      scroll={{ x: "max-content" }}
    />
  );
}