"use client";

import StatsCards from "@/components/dashboard/StatsCards";
import { Button } from "antd";
import { Search } from "lucide-react";
import useURLParams from "@/hooks/useURLParms";

export default function DashboardPageNew() {
  const { setParam } = useURLParams();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant">
            Overview of your job search activity this week.
          </p>
        </div>

        <Button
          type="primary"
          icon={<Search size={16} />}
          className="!flex items-center gap-2 !px-5 !py-5 !rounded-md !font-semibold !text-white !bg-primary-gradient hover:!opacity-95 !shadow-ambient hover:!shadow-md!border-none"
          onClick={() => setParam("drawer", "open")}
        >
          Find Jobs
        </Button>
      </div>

      {/* STATS */}
      {/* <div className="grid grid-cols-5 gap-4">

        {[
          { title: "NOT APPLIED", value: "24", sub: "+3 new" },
          { title: "APPLIED", value: "118", sub: "84% fit" },
          { title: "INTERVIEWING", value: "12", sub: "3 today" },
          { title: "REJECTED", value: "45", sub: "Market avg" },
          { title: "OFFERED", value: "2", sub: "Success" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-surface-lowest border border-outline-variant/30 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <p className="text-xs text-on-surface-faint mb-2">
              {item.title}
            </p>
            <h2 className="text-2xl font-bold text-on-surface">
              {item.value}
            </h2>
            <p className="text-xs text-primary mt-1">{item.sub}</p>
          </div>
        ))}
      </div> */}

      <div>
        <StatsCards />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="col-span-2 bg-surface-lowest border border-outline-variant/30 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-on-surface">
              AI Recommended Jobs
            </h3>
            <button className="text-sm text-primary">View all matches</button>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "IT Analyst",
                company: "McLaren Strategic Solutions (MSS) • Hyderabad",
                match: "68%",
              },
              {
                title: "Software Developer",
                company: "Digiswitch Infotech Private Limited • Noida",
                match: "61%",
              },
              {
                title: "Software Engineer",
                company: "Randstad Digital • Hyderabad",
                match: "59%",
              },
            ].map((job, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-md hover:bg-surface-low transition"
              >
                <div>
                  <p className="font-medium text-on-surface">{job.title}</p>
                  <p className="text-xs text-on-surface-variant">
                    {job.company}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {job.match} Match
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          PROFILE STRENGTH
          <div className="bg-surface-lowest border border-outline-variant/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-on-surface-faint mb-4">
              PROFILE STRENGTH
            </h3>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center text-xl font-bold text-on-surface">
                85%
              </div>

              <p className="text-xs text-on-surface-variant mt-3 text-center">
                Add <span className="text-primary">3 more skills</span> to reach
                expert status.
              </p>
            </div>
          </div>

          {/* NEXT STEPS */}
          <div className="bg-surface-lowest border border-outline-variant/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-on-surface-faint mb-4">
              NEXT STEPS
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-on-surface">
                  Interview with McLaren Strategic Solutions (MSS)
                </p>
                <p className="text-xs text-on-surface-variant">
                  10:00 AM • Zoom
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-on-surface">
                  Final Round: Digiswitch Infotech Private Limited
                </p>
                <p className="text-xs text-on-surface-variant">
                  2:30 PM • On-site
                </p>
              </div>
            </div>

            <Button className="w-full mt-4">View Schedule</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
