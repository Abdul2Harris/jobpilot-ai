"use client";

import { Spin } from "antd";


import { useJobStats } from "@/services/jobs";
import { FileCheck, FileSearch, RefreshCw, Trophy, XCircle } from "lucide-react";



export default function StatsCards() {
  const { data: stats, isLoading } = useJobStats();

  // const dummyData = [
  //   { title: "NOT APPLIED", value: "24", sub: "+3 new" },
  //   { title: "APPLIED", value: "118", sub: "84% fit" },
  //   { title: "INTERVIEWING", value: "12", sub: "3 today" },
  //   { title: "REJECTED", value: "45", sub: "Market avg" },
  //   { title: "OFFERED", value: "2", sub: "Success" },
  // ];

  const statConfig = [
  {
    key: "not_applied",
    label: "Not Applied",
    icon: <FileSearch className="text-blue-500" />,
    color: "#3b82f6",
    value: stats?.data?.not_applied
  },
  {
    key: "applied",
    label: "Applied",
    icon: <FileCheck className="text-yellow-500" />,
    color: "#f59e0b",
    value: stats?.data?.applied
  },
  {
    key: "interviewing",
    label: "Interviewing",
    icon: <RefreshCw className="text-purple-500" />,
    color: "#8b5cf6",
    value: stats?.data?.interviewing
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: <XCircle className="text-red-500" />,
    color: "#ef4444",
    value: stats?.data?.rejected
  },
  {
    key: "offered",
    label: "Offered",
    icon: <Trophy className="text-green-500" />,
    color: "#22c55e",
    value: stats?.data?.offered
  },
];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    // <Row gutter={[16, 16]}>
    //   {statConfig.map((stat) => (
    //     <Col xs={24} sm={12} lg={8} xl={4} key={stat.key}>
    //       <Card>
    //         <Statistic
    //           title={stat.label}
    //           value={stats?.[stat.key as keyof typeof stats] ?? 0}
    //           prefix={stat.icon}
    //           valueStyle={{ color: stat.color }}
    //         />
    //       </Card>
    //     </Col>
    //   ))}
    // </Row>

    <div className="grid grid-cols-5 gap-4">
      {statConfig.map((stat) => (
        <div key={stat.key} className="bg-surface-lowest border border-outline-variant/30 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between">
          <p className="text-md font-medium text-on-surface-faint mb-2">{stat.label.toLocaleUpperCase()}</p>
          <div className="flex items-center gap-2 mb-2">{stat.icon}</div>
          </div>
          <h2 className="text-2xl font-bold text-on-surface">{stat.value ?? 0}</h2>

          {/* <p className="text-xs text-primary mt-1">{item.sub}</p> */}
        </div>
      ))}
    </div>
  );
}
