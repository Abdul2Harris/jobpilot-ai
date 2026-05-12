"use client";
import { App, Layout } from "antd";
import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";
import SearchDrawer from "@/components/shared/SearchDrawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Navbar />
        <Layout.Content className="p-6 overflow-auto">
          <App>
            {children}
          </App>
        </Layout.Content>
      </Layout>
      <SearchDrawer />
    </Layout>
  );
}
