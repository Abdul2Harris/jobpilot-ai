"use client";

import { Card } from "@/components/ui/Card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { IJob } from "@/services/jobs/contract";
import { useHandleApply } from "@/hooks/useHandleApply";
import { Button } from "antd";

import { notification } from "antd";
import { Check } from "lucide-react";

export default function JobCard({
  job,
  onClick,
}: {
  job: IJob;
  onClick: () => void;
}) {
  const [applied, setApplied] = useState(job.status === "applied");

  const match = Math.round(job.similarity * 100);

  const handleApply = useHandleApply({
    jobId: job.id,
    setApplied,
    status: "applied",
  });

  const handleApplyClick = (jobUrl: string, jobId: string) => {
    window.open(jobUrl, "_blank");

    notification.info({
      message: "Did you apply?",
      description: "Mark this job as applied to track your progress.",
      btn: (
        <Button
          onClick={() => {
            handleApply();
          }}
          className="text-primary font-medium"
        >
          Yes, Mark Applied
        </Button>
      ),
      duration: 6,
    });
  };

  return (
    <Card
      onClick={onClick}
      className="relative cursor-pointer group overflow-hidden"
    >
      {/* MAIN CONTENT */}
      <div className={cn("transition-opacity", "group-hover:opacity-20")}>
        {/* TOP */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-sm font-semibold text-on-surface">
              {job.title}
            </h3>
            <p className="text-xs text-on-surface-variant">{job.company}</p>
          </div>

          <span className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary">
            {match}% Match
          </span>
        </div>

        {/* META */}
        <div className="space-y-1 text-xs text-on-surface-variant mb-3">
          <p>📍 {job.location}</p>
          <p>💼 {job.experience}</p>
          <p>💰 {job.salary}</p>
          <p>🌐 {job.source}</p>
        </div>

        {/* SKILLS */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {job.skills.slice(0, 3).map((skill: string) => (
              <span
                key={skill}
                className="text-[10px] px-2 py-1 rounded bg-surface-low text-on-surface-faint"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* HOVER ACTION */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
        {/* APPLY */}
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyClick(job.url || "", job.id);
          }}
          className=""
        >
          Apply
        </Button>

        {/* MARK APPLIED */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleApply();
          }}
          /* If applied is true, we add green text/border classes; otherwise, we use text-primary */
          className={`font-medium transition-colors ${
            applied
              ? "!text-green-600 !border-green-600 !hover:text-green-700 !hover:border-green-700"
              : "text-primary"
          }`}
          disabled={applied}
        >
          {applied ? (
            <span className="flex items-center">
              <Check size={16} className="mr-1" />
              Applied
            </span>
          ) : (
            "Mark Applied"
          )}
        </Button>
      </div>
    </Card>
  );
}
