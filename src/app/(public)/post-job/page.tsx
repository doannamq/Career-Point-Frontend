import type { Metadata } from "next";
import PostJobForm from "./PostJobForm";

export const metadata: Metadata = {
  title: "Post a Job | Job Board",
  description: "Create a new job listing for your company",
};

export default function PostJobPage() {
  return <PostJobForm />;
}
