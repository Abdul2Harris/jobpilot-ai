"use client";

import { useState } from "react";
import { Empty, Spin } from "antd";
import JobFilters from "@/components/jobs/JobFilters";
import { useJobs } from "@/services/jobs";
import type { IJobFilters, JobSource, JobStatus } from "@/services/jobs/contract";
import useURLParams from "@/hooks/useURLParms";
import JobCard from "@/components/jobs/JobsCards";
import JobDrawer from "@/components/jobs/JobDrawer";
import JobsPagination from "@/components/jobs/JobsPagination";


export default function JobsPage() {

  const { params } = useURLParams();
  const jobTitle = params.get("job_title") || "";
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 12;

  const statusParam = params.get("status");
const sourceParam = params.get("source");

// Define valid values as arrays
const validStatuses: JobStatus[] = ["not_applied", "applied", "interviewing", "rejected", "offered"];
const validSources: JobSource[] = [ "naukri", "internshala", "company_website", "other"];

const filters: IJobFilters = {
  search: params.get("search") || "",
  status: validStatuses.includes(statusParam as JobStatus) ? (statusParam as JobStatus) : undefined,
  source: validSources.includes(sourceParam as JobSource) ? (sourceParam as JobSource) : undefined,
  min_match_score: params.get("min_match_score")
    ? Number(params.get("min_match_score"))
    : undefined,
};

  const { data, isLoading } = useJobs({
    ...filters,
    page,
    limit,
    job_title: jobTitle,
    jobTitlepages: 1,
  });

  // const handleFilter = (newFilters: IJobFilters) => {
  //   setFilters(newFilters);
  //   setPage(1);
  // };

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Best Matches</h1>
        <p className="text-sm text-on-surface-variant">
          AI-curated roles matched to your profile
        </p>
      </div>
      <JobFilters />
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spin size="large" />
        </div>
      ) : !data?.data?.length ? (
        <div className="flex justify-center py-24">
          <Empty description="No jobs found. Try searching from the dashboard." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => {
                  setSelectedJob(job);
                  setDrawerOpen(true);
                }}
              />
            ))}
          </div>

          {/* Pagination */}
            <JobsPagination total={data.pagination.total} />
        </>
      )}
      <JobDrawer
        job={selectedJob}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
