import type { Metadata } from "next";
import { PlansPageClient } from "./PlansPageClient";

export const metadata: Metadata = {
  title: "Career Point | Plans",
  description: "Choose your plan",
};

export default function PlansPage() {
  return (
    <main className="min-h-screen bg-background">
      <PlansPageClient />
    </main>
  );
}
