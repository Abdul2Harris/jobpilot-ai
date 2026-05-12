"use client";

import DashboardPageNew from "./_components/Dashboard";

// interface SearchFormValues {
//   jobTitle: string;
// }

export default function DashboardPage() {
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
