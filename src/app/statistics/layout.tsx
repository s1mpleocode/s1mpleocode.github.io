import { config } from "@/lib/config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "统计 - " + config.site.title,
  description: "网站访问统计数据和分析",
};

export default function StatisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
