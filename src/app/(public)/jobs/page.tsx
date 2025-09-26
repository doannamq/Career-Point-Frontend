import type { Metadata } from "next";
import JobsPageClient from "./JobPageClient";

export const metadata: Metadata = {
  title: "Browse Jobs | Job Board",
  description: "Find the perfect job opportunity from our extensive listings",
};

export default function JobsPage() {
  return <JobsPageClient />;
}
