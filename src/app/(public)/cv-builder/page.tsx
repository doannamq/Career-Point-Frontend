import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye, FileText, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CvBuilderPageClient from "./CvBuilderPageClient";

export const metadata: Metadata = {
  title: "Career Point | CV Builder",
  description: "Tạo CV đẹp mắt với nhiều template, xem trước real-time và tải xuống PDF chất lượng cao.",
};

export default function CvBuilderPage() {
  return (
    <div>
      <CvBuilderPageClient />
    </div>
  );
}
