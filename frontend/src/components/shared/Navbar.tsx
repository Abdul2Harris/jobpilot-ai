"use client";

import { Layout, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useProfile } from "@/services/auth";
import type { MenuProps } from "antd";

const { Header } = Layout;

export default function Navbar() {
  const router = useRouter();
  const { data: profile } = useProfile();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => router.push("/profile"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header className="flex items-center justify-between px-6 !bg-surface-lowest">
      
      {/* LEFT */}
      <h1 className="text-xl font-semibold text-on-surface">
        Welcome Back, {profile?.name}
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Search */}
        {/* <div className="hidden md:flex items-center bg-surface-low px-3 py-2 rounded-md w-64">
          <input
            placeholder="Search applications..."
            className="bg-transparent outline-none text-sm w-full text-on-surface"
          />
        </div> */}

        {/* Icons */}
        <button className="text-on-surface-faint hover:text-on-surface">
          <BellOutlined />
        </button>

        {/* Avatar */}
        <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
          <Avatar
            icon={<UserOutlined />}
            className="cursor-pointer bg-primary"
          />
        </Dropdown>
      </div>
    </Header>
  );
}