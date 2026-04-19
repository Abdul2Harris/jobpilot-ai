import type { Metadata } from "next";
import AntdProvider from "@/providers/AntdProvider";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { Inter } from "next/font/google";
import "./globals.css"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Job Automation",
  description: "Your personal job tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AntdProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AntdProvider>
      </body>
    </html>
  );
}