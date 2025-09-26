import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobBySlug } from "@/lib/api/jobs";
import JobDetailClient from "./JobDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    console.log("[v0] generateMetadata - slug:", resolvedParams.slug);
    const job = await getJobBySlug(resolvedParams.slug);

    if (!job) {
      return {
        title: "Không tìm thấy công việc",
        description: "Công việc bạn tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.",
      };
    }

    return {
      title: `${job.title} - ${job.companyName} | Job Board`,
      description: `Apply for ${job.title} position at ${job.companyName} in ${job.location}. ${job.jobType} role with ${job.experience} experience required.`,
      openGraph: {
        title: `${job.title} at ${job.companyName}`,
        description: `Apply for ${job.title} position at ${job.companyName} in ${job.location}`,
        type: "website",
      },
    };
  } catch (error) {
    console.error("[v0] generateMetadata error:", error);
    return {
      title: "Không tìm thấy công việc",
      description: "Công việc bạn tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.",
    };
  }
}

export default async function JobDetailPage({ params }: Props) {
  try {
    const resolvedParams = await params;
    console.log("[v0] JobDetailPage - slug:", resolvedParams.slug);
    const job = await getJobBySlug(resolvedParams.slug);

    if (!job) {
      console.log("[v0] Job not found, calling notFound()");
      notFound();
    }

    console.log("[v0] Job found, rendering JobDetailClient");
    return <JobDetailClient job={job} slug={resolvedParams.slug} />;
  } catch (error) {
    console.error("[v0] Failed to load job:", error);
    notFound();
  }
}
