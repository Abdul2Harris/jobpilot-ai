"use client";

import { Layout } from "antd";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import useURLParams from "@/hooks/useURLParms";

const { Sider } = Layout;

const menuItems = [
  {
    key: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    key: "/jobs",
    icon: Briefcase,
    label: "Jobs",
  },
  {
    key: "/applications",
    icon: FileText,
    label: "Applications",
  },
  {
    key: "/profile",
    icon: User,
    label: "Profile",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setParam } = useURLParams();

  return (
    <Sider
      width={240}
      className="min-h-screen !bg-surface border-r border-outline-variant/30"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 ">
        <span className="text-lg font-semibold text-primary">
          JobPilot AI
        </span>
      </div>

      {/* Menu */}
      <div className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.key;

          return (
            <button
              key={item.key}
              onClick={() => router.push(item.key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
              )}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="mt-auto p-4">
        <button
          onClick={() => setParam("drawer", "open")}
          className="w-full rounded-md bg-primary text-white py-2 text-sm font-semibold hover:bg-primary-container"
        >
          + New Job Scan
        </button>

        {/* <div className="flex items-center gap-3 mt-4">
          <div className="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center text-on-surface">
            A
          </div>
          <div className="text-xs">
            <p className="font-medium text-on-surface">Alex Chen</p>
            <p className="text-on-surface-faint">alex@studio.ai</p>
          </div>
        </div> */}
      </div>
    </Sider>
  );
}