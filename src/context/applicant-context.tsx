"use client";

import React, { createContext, useContext, useState } from "react";

interface ApplicantContextType {
  selectedApplicant: any;
  setSelectedApplicant: (applicant: any) => void;
}

const ApplicantContext = createContext<ApplicantContextType | undefined>(undefined);

export function ApplicantProvider({ children }: { children: React.ReactNode }) {
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);

  return <ApplicantContext.Provider value={{ selectedApplicant, setSelectedApplicant }}>{children}</ApplicantContext.Provider>;
}

export function useApplicant() {
  const context = useContext(ApplicantContext);
  if (context === undefined) {
    throw new Error("useApplicant must be used within an ApplicantProvider");
  }
  return context;
}
