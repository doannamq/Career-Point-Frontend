import type { Metadata } from "next";
import CompaniesPage from "./CompaniesPageClient";

export const metadata: Metadata = {
  title: "Career Point | Companies",
  description: "Explore top companies and job opportunities that match you.",
};

export default function CompnaiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <CompaniesPage />
    </main>
  );
}
