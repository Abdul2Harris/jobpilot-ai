"use client";

import { ConfigProvider, App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const atelierTheme = {
  token: {
    /* ——— Primary Color (Indigo-Violet) ——— */
    colorPrimary: "#4648d4",
    colorPrimaryHover: "#6063ee",
    colorPrimaryActive: "#3537b0",

    /* ——— Typography ——— */
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    fontSize: 14,
    fontWeightStrong: 500,
    colorText: "#191c1d" /* Never pure black */,
    colorTextSecondary: "#464554",
    colorTextPlaceholder: "#9a9ba8",

    /* ——— Surfaces ——— */
    colorBgContainer: "#ffffff" /* surface-lowest — cards */,
    colorBgElevated: "#ffffff" /* modals, dropdowns */,
    colorBgLayout: "#f8f9fa" /* base canvas */,
    colorFillAlter: "#f3f4f5" /* input backgrounds (surface-low) */,

    /* ——— Borders ——— */
    colorBorder: "rgba(199, 196, 215, 0.25)" /* ghost border */,
    colorBorderSecondary: "rgba(199, 196, 215, 0.15)",

    /* ——— Radius (DESIGN.md: 12px components, 16px cards) ——— */
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,

    /* ——— Shadows ——— */
    boxShadow: "0 1px 3px rgba(17,24,39,0.05)",
    boxShadowSecondary: "0 20px 40px -12px rgba(17,24,39,0.08)",

    /* ——— Error ——— */
    colorError: "#ba1a1a",
    colorSuccess: "#386a20",
    colorWarning: "#7d4e00",

    /* ——— Motion ——— */
    motionDurationMid: "0.18s",
    motionEaseOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  components: {
    /* Input — surface-low bg, transitions to white on focus */
    Input: {
      colorBgContainer: "#f3f4f5",
      activeBg: "#ffffff",
      activeShadow: "0 0 0 2px rgba(70, 72, 212, 0.20)",
      hoverBorderColor: "rgba(199, 196, 215, 0.4)",
    },

    /* Button — primary gets gradient, no colored shadows */
    Button: {
      primaryShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
      fontWeight: 600,
    },

    /* Card — surface-lowest, ambient hover shadow */
    Card: {
      colorBgContainer: "#ffffff",
      paddingLG: 24,
    },

    /* Form labels — uppercase tracked metadata style */
    Form: {
      // labelColor: "#464554",
      // labelFontSize: 13, 
      // itemMarginBottom: 16,
      // verticalLabelPadding: "0 0 4px",
      // labelHeight: 24,
    },

    /* Select, DatePicker etc. inherit input styles */
    Select: {
      colorBgContainer: "#f3f4f5",
      optionActiveBg: "#f3f4f5",
      optionSelectedBg: "rgba(70, 72, 212, 0.08)",
    },

    /* Table */
    Table: {
      colorBgContainer: "#ffffff",
      headerBg: "#f8f9fa",
      rowHoverBg: "#f3f4f5",
      borderColor: "rgba(199, 196, 215, 0.2)",
    },

    /* Menu / Sidebar */
    Menu: {
      colorBgContainer: "#f3f4f5",
      itemHoverBg: "#e7e8e9",
      itemSelectedBg: "rgba(70, 72, 212, 0.08)",
      itemSelectedColor: "#4648d4",
    },
  },
};

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={atelierTheme}>
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
