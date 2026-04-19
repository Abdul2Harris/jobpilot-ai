"use client";

import StatsCards from "@/components/dashboard/StatsCards";
import { Typography, Input, Button, Form, notification } from "antd";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useState } from "react";
import FormItem from "antd/es/form/FormItem";
import useURLParams from "@/hooks/useURLParms";
import { useJobs, useJobsSearch } from "@/services/jobs";
import { useRouter } from "next/navigation";
import SearchDrawer from "@/components/shared/SearchDrawer";
import DashboardPageNew from "./_components/Dashboard";

const { Text, Title } = Typography;

interface SearchFormValues {
  jobTitle: string;
}

export default function DashboardPage() {
  const { params, setParam, deleteParam } = useURLParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  return (
    // <div>
    //   <div className="mb-6">
    //     <Title level={3} className="mb-0">
    //       Dashboard
    //     </Title>
    //     <Text type="secondary">Overview of your job search</Text>
    //   </div>
    //   <Button
    //     type="primary"
    //     size="large"
    //     icon={<MagnifyingGlassIcon size={16} />}
    //     onClick={() => setDrawerOpen(true)}
    //   >
    //     Find Jobs
    //   </Button>

    //   <SearchDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

    //   <StatsCards />
    // </div>
    <div>
      <DashboardPageNew />
    </div>
  );
}
