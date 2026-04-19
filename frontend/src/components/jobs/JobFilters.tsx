"use client";

import { Input, Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useURLParams from "@/hooks/useURLParms";

export default function JobFilters() {
  const { params, setParam, deleteParam } = useURLParams();

  // values from URL
  const search = params.get("search") || "";
  const status = params.get("status") || undefined;
  const source = params.get("source") || undefined;
  const match = params.get("min_match_score") || undefined;

  return (
    <div className="mb-6 bg-surface-lowest p-4 rounded-md">

      <ul className="flex flex-wrap gap-3">

        {/* SEARCH */}
        <li>
          <Input
            className="!w-[260px] !bg-surface-low !border-outline-variant"
            placeholder="Search jobs..."
            prefix={<SearchOutlined />}
            value={search}
            allowClear
            onChange={(e) => {
              if (e.target.value) {
                setParam("search", e.target.value);
              } else {
                deleteParam("search");
              }
            }}
          />
        </li>

        {/* STATUS */}
        <li>
          <Select
            className="!w-40"
            placeholder="Status"
            value={status}
            allowClear
            options={[
              { value: "not_applied", label: "Not Applied" },
              { value: "applied", label: "Applied" },
              { value: "interviewing", label: "Interviewing" },
              { value: "rejected", label: "Rejected" },
              { value: "offered", label: "Offered" },
            ]}
            onChange={(val) => {
              if (val) setParam("status", val);
              else deleteParam("status");
            }}
          />
        </li>

        {/* SOURCE */}
        <li>
          <Select
            className="!w-40"
            placeholder="Source"
            value={source}
            allowClear
            options={[
              { value: "naukri", label: "Naukri" },
              { value: "internshala", label: "Internshala" },
              { value: "company", label: "Company Site" },
            ]}
            onChange={(val) => {
              if (val) setParam("source", val);
              else deleteParam("source");
            }}
          />
        </li>

        {/* MATCH SCORE */}
        <li>
          <Select
            className="!w-44"
            placeholder="Match Score"
            value={match ? Number(match) : undefined}
            allowClear
            options={[
              { value: 90, label: "90%+" },
              { value: 80, label: "80%+" },
              { value: 70, label: "70%+" },
              { value: 60, label: "60%+" },
            ]}
            onChange={(val) => {
              if (val) setParam("min_match_score", val);
              else deleteParam("min_match_score");
            }}
          />
        </li>

        {/* RESET */}
        <li>
          <Button
            onClick={() => {
              ["search", "status", "source", "min_match_score","page", "limit"].forEach(
                deleteParam
              );
            }}
            className="border border-outline-variant text-on-surface"
          >
            Reset
          </Button>
        </li>
      </ul>
    </div>
  );
}