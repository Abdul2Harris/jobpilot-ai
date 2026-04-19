"use client";

import { Pagination, Select } from "antd";
import useURLParams from "@/hooks/useURLParms";

interface Props {
  total: number;
}

export default function JobsPagination({ total }: Props) {
  const { params, setParam } = useURLParams();

  const page = Number(params.get("page")) || 1;
  const pageSize = Number(params.get("limit")) || 12;

  if (!total || total <= pageSize) return null;

  const handleChange = (newPage: number, newSize: number) => {
    setParam("page", String(newPage));
    setParam("limit", String(newSize));
  };

  return (
    <div className="flex w-full justify-between items-center mt-10">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 text-sm text-on-surface-variant">
        
        <Select
          size="small"
          value={pageSize}
          className="!w-[80px]"
          options={[
            { value: 12, label: "12" },
            { value: 24, label: "24" },
            { value: 48, label: "48" },
            { value: 96, label: "96" },
          ]}
          onChange={(value) => handleChange(1, value)}
        />

        <span>
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, total)} of {total}
        </span>
      </div>

      {/* RIGHT SIDE */}
      <Pagination
        size="small"
        current={page}
        pageSize={pageSize}
        total={total}
        onChange={handleChange}
        showSizeChanger={false}
      />
    </div>
  );
}