"use client";

import { useHandleApply } from "@/hooks/useHandleApply";
import { IJob } from "@/services/jobs/contract";
import { Drawer, Button, notification } from "antd";
import { Check } from "lucide-react";
import { useState } from "react";

export default function JobDrawer({
  job,
  open,
  onClose,
}: {
  job: IJob;
  open: boolean;
  onClose: () => void;
}) {
  if (!job) return null;

  const match = Math.round(job.similarity * 100);
  const [applied, setApplied] = useState(job.status === "applied");

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
        <button
          onClick={() => {
            handleApply();
          }}
          className="text-primary font-medium"
        >
          Yes, Mark Applied
        </button>
      ),
      duration: 6,
    });
  };

  return (
    <Drawer
      title={"Job Details"}
      placement="right"
      onClose={onClose}
      open={open}
      size={'large'}
      className="!bg-surface-lowest !mb-4"
    >
      <div className="flex flex-col h-full">
        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-on-surface">{job.title}</h2>
          <p className="text-sm text-on-surface-variant">{job.company}</p>

          <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-primary/10 text-primary">
            {match}% Match
          </span>
        </div>

        {/* META */}
        <div className="space-y-2 text-sm text-on-surface-variant mb-4">
          <p>📍 {job.location}</p>
          <p>💼 {job.experience}</p>
          <p>💰 {job.salary}</p>
          <p>🌐 {job.source}</p>
        </div>

        {/* SKILLS */}
        {job.skills?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-on-surface mb-2">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-1 rounded bg-surface-low text-on-surface"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* DESCRIPTION */}
        {job?.description && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-on-surface mb-2">
              Description
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {job?.description || "-"}
            </p>
          </div>
        )}

        {/* CTA (sticky bottom) */}
        <div className="mt-auto space-y-3">
          {/* APPLY */}
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleApplyClick(job.url || "", job.id);
            }}
            className="w-full"
          >
            Apply on Website
          </Button>

          {/* MARK APPLIED */}
          {/* <Button
            onClick={(e) => {
              e.stopPropagation();
              handleApply();}}
            className="w-full"
          >
            Mark as Applied
          </Button> */}

          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleApply();
            }}
            /* If applied is true, we add green text/border classes; otherwise, we use text-primary */
            className={`font-medium transition-colors w-full mb-2 ${
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
      </div>
    </Drawer>
  );
}
