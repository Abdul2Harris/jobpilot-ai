"use client";

import { useHandleApply } from "@/hooks/useHandleApply";
import { IJob } from "@/services/jobs/contract";
import { Drawer, Button, notification, Progress } from "antd";
import { Check, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/services/auth";

export default function JobDrawer({
  job,
  open,
  onClose,
}: {
  job: IJob | null;
  open: boolean;
  onClose: () => void;
}) {
  const [applied, setApplied] = useState(job?.status === "applied");
  const { data: profile } = useProfile();

  const handleApply = useHandleApply({
    jobId: job?.id ?? "",
    setApplied,
    status: "applied",
  });

  if (!job) return null;

  const match = Math.round(job.similarity * 100);
  const userSkills = (profile?.skills ?? []).map((s) => s.toLowerCase());
  const jobSkills = job.skills ?? [];
  const matchedSkills = jobSkills.filter((s) => userSkills.includes(s.toLowerCase()));
  const gapSkills = jobSkills.filter((s) => !userSkills.includes(s.toLowerCase()));

  const handleApplyClick = (jobUrl: string) => {
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

          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-on-surface-variant">Match Score</span>
              <span className="text-xs font-bold text-primary">{match}%</span>
            </div>
            <Progress
              percent={match}
              showInfo={false}
              strokeColor={match >= 70 ? "#22c55e" : match >= 50 ? "#f59e0b" : "#ef4444"}
              trailColor="#e5e7eb"
              size="small"
            />
          </div>
        </div>

        {/* META */}
        <div className="space-y-2 text-sm text-on-surface-variant mb-4">
          <p>📍 {job.location}</p>
          <p>💼 {job.experience}</p>
          <p>💰 {job.salary}</p>
          <p>🌐 {job.source}</p>
        </div>

        {/* WHY THIS MATCHES */}
        {jobSkills.length > 0 && (
          <div className="mb-4 rounded-lg border border-outline-variant/30 bg-surface-low p-4">
            <h3 className="text-sm font-semibold text-on-surface mb-3">
              Why This Matches
            </h3>

            {matchedSkills.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1 mb-2">
                  <CheckCircle size={13} className="text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    You have ({matchedSkills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {gapSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <XCircle size={13} className="text-red-400" />
                  <span className="text-xs font-medium text-red-500">
                    Skills gap ({gapSkills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {gapSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
              handleApplyClick(job.url || "");
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
