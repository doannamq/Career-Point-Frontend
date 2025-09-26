"use client";

import React, { useRef } from "react";
import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchJobs } from "@/lib/api/jobs";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import JobSearchForm from "./JobSearchForm";
import JobFilters from "./JobFilters";
import JobsList from "./JobList";
import JobPagination from "./JobPagination";
import { getApplicationBatch } from "@/lib/api/application";
import { getSavedJobBatch, saveUnsaveJob } from "@/lib/api/save-job";
import { Job } from "@/types/job";

export type SearchFilters = {
  searchTerm: string;
  location: string;
  jobType: string;
  experience: string;
  selectedSkills: string[];
  minSalary: number;
  maxSalary: number;
  sortBy: "score" | "salary" | "createdAt";
  sortOrder: "asc" | "desc";
};

export default function JobsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Get initial values from URL
  const initialQuery = searchParams.get("query") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialJobType = searchParams.get("jobType") || "All Types";
  const initialMinSalary = searchParams.get("minSalary") ? Number.parseInt(searchParams.get("minSalary")!) : 0;
  const initialMaxSalary = searchParams.get("maxSalary") ? Number.parseInt(searchParams.get("maxSalary")!) : 200000;
  const initialExperience = searchParams.get("experience") || "All Levels";
  const initialSkills = searchParams.get("skills") ? searchParams.get("skills")!.split(",") : [];
  const initialSortBy = searchParams.get("sortBy") || "score";
  const initialSortOrder = searchParams.get("sortOrder") || "desc";
  const initialPage = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1;
  const initialView = searchParams.get("view") || "list";

  // Search form state (temporary values until applied)
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [jobType, setJobType] = useState(initialJobType);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([initialMinSalary, initialMaxSalary]);
  const [experience, setExperience] = useState(initialExperience);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
  const [sortBy, setSortBy] = useState<"score" | "salary" | "createdAt">(initialSortBy as any);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder as any);
  const [viewMode, setViewMode] = useState<"list" | "grid">(initialView as any);
  const [remoteOnly, setRemoteOnly] = useState(initialLocation === "Remote");
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [applicantsMap, setApplicantsMap] = useState<Record<string, number>>({});
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  // Applied search params state (values that will trigger the search)
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>({
    searchTerm: initialQuery,
    location: initialLocation,
    jobType: initialJobType,
    experience: initialExperience,
    selectedSkills: initialSkills,
    minSalary: initialMinSalary,
    maxSalary: initialMaxSalary,
    sortBy: initialSortBy as "score" | "salary" | "createdAt",
    sortOrder: initialSortOrder as "asc" | "desc",
  });

  // UI state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Count active filters
  const activeFilterCount = [
    appliedFilters.searchTerm ? 1 : 0,
    appliedFilters.location ? 1 : 0,
    appliedFilters.jobType !== "All Types" ? 1 : 0,
    appliedFilters.experience !== "All Levels" ? 1 : 0,
    appliedFilters.selectedSkills.length > 0 ? 1 : 0,
    appliedFilters.minSalary > 0 ? 1 : 0,
    appliedFilters.maxSalary < 200000 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Load jobs based on applied search params only
  useEffect(() => {
    async function loadJobs() {
      setIsLoading(true);
      setError(null);
      try {
        const params: any = {
          page: currentPage,
          limit: 10,
        };
        // thêm các filter vào params
        if (appliedFilters.searchTerm) params.query = appliedFilters.searchTerm;
        if (appliedFilters.location) params.location = appliedFilters.location;
        if (appliedFilters.jobType && appliedFilters.jobType !== "All Types") params.jobType = appliedFilters.jobType;
        if (appliedFilters.experience && appliedFilters.experience !== "All Levels")
          params.experience = appliedFilters.experience;
        if (appliedFilters.selectedSkills.length > 0) params.skills = appliedFilters.selectedSkills;
        if (appliedFilters.minSalary > 0) params.minSalary = appliedFilters.minSalary;
        if (appliedFilters.maxSalary < 200000) params.maxSalary = appliedFilters.maxSalary;
        params.sortBy = appliedFilters.sortBy;
        params.sortOrder = appliedFilters.sortOrder;

        const response = await searchJobs(params);

        if (response && response.success) {
          const jobList = response.data.results;
          setJobs(jobList);
          setTotalJobs(response.data.pagination.total);
          setTotalPages(response.data.pagination.totalPages);

          if (user && user.token && jobList.length > 0) {
            const jobIds = jobList.map((job: Job) => job.jobId);

            const batchApplication = await getApplicationBatch(user.token, user.userId, jobIds);
            setAppliedJobIds(batchApplication.appliedJobIds);
            setApplicantsMap(batchApplication.applicantsMap);

            const batchSavedJobs = await getSavedJobBatch(user.token, user.userId, jobIds);
            setSavedJobIds(batchSavedJobs.savedJobIds);
          } else {
            setAppliedJobIds([]);
            setApplicantsMap({});
            setSavedJobIds([]);
          }
        } else {
          setJobs([]);
          setTotalJobs(0);
          setTotalPages(0);
          if (response && response.message) {
            setError(response.message);
          }
        }
      } catch (error) {
        console.error("Failed to load jobs:", error);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadJobs();
  }, [currentPage, appliedFilters, user]);

  const handleToggleSave = async (jobId: string) => {
    if (!user?.accessToken) {
      router.push("/login");
      return;
    }

    setSavedJobIds((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]));

    try {
      await saveUnsaveJob(jobId, user.accessToken);
    } catch (error) {
      // rollback nếu lỗi
      setSavedJobIds((prev) => (prev.includes(jobId) ? [...prev, jobId] : prev.filter((id) => id !== jobId)));
    }
  };

  // Update URL with search params
  const updateSearchParams = useCallback(
    (page = currentPage) => {
      startTransition(() => {
        const params = new URLSearchParams();

        // Use the applied filters for URL parameters
        if (appliedFilters.searchTerm) params.set("query", appliedFilters.searchTerm);
        if (appliedFilters.location) params.set("location", appliedFilters.location);
        if (appliedFilters.jobType !== "All Types") params.set("jobType", appliedFilters.jobType);
        if (appliedFilters.experience !== "All Levels") params.set("experience", appliedFilters.experience);
        if (appliedFilters.selectedSkills.length > 0) params.set("skills", appliedFilters.selectedSkills.join(","));
        if (appliedFilters.minSalary > 0) params.set("minSalary", appliedFilters.minSalary.toString());
        if (appliedFilters.maxSalary < 200000) params.set("maxSalary", appliedFilters.maxSalary.toString());
        params.set("sortBy", appliedFilters.sortBy);
        params.set("sortOrder", appliedFilters.sortOrder);
        params.set("view", viewMode);

        // Use the page parameter
        params.set("page", page.toString());

        router.push(`/jobs?${params.toString()}`);
      });
    },
    [appliedFilters, currentPage, router, viewMode]
  );

  // Handle search form submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Apply current form values to the appliedFilters
    setAppliedFilters({
      searchTerm,
      location: remoteOnly ? "Remote" : location,
      jobType,
      experience,
      selectedSkills,
      minSalary: salaryRange[0],
      maxSalary: salaryRange[1],
      sortBy,
      sortOrder,
    });

    // Reset to page 1 when applying new search filters
    setCurrentPage(1);

    // Update URL with page 1
    updateSearchParams(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle skill toggle
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  };

  // Clear all filters
  const clearFilters = () => {
    // Reset form state
    setSearchTerm("");
    setLocation("");
    setJobType("All Types");
    setSalaryRange([0, 200000]);
    setExperience("All Levels");
    setSelectedSkills([]);
    setSortBy("score");
    setSortOrder("desc");
    setRemoteOnly(false);

    // Also apply these cleared filters immediately
    setAppliedFilters({
      searchTerm: "",
      location: "",
      jobType: "All Types",
      experience: "All Levels",
      selectedSkills: [],
      minSalary: 0,
      maxSalary: 200000,
      sortBy: "score",
      sortOrder: "desc",
    });
    setCurrentPage(1);

    // Update URL to remove parameters
    router.push("/jobs");
  };

  // Handle remote only toggle
  const handleRemoteToggle = (checked: boolean) => {
    setRemoteOnly(checked);
    if (checked) {
      setLocation("Remote");
    } else if (location === "Remote") {
      setLocation("");
    }
  };

  // Handle location selection
  const handleLocationSelect = (value: string) => {
    setLocation(value);
    if (value === "Remote") {
      setRemoteOnly(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <motion.div
        className="bg-gradient-to-r from-primary/5 to-primary/10 py-8 md:py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}>
              Khám phá việc làm
            </motion.h1>
            <motion.p
              className="mt-3 text-muted-foreground text-lg max-w-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              Khởi đầu sự nghiệp mơ ước với cơ hội dành riêng cho bạn
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobSearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          location={location}
          setLocation={setLocation}
          remoteOnly={remoteOnly}
          handleRemoteToggle={handleRemoteToggle}
          handleLocationSelect={handleLocationSelect}
          selectedSkills={selectedSkills}
          toggleSkill={toggleSkill}
          handleSearch={handleSearch}
          activeFilterCount={activeFilterCount}
          jobType={jobType}
          setJobType={setJobType}
          experience={experience}
          setExperience={setExperience}
          salaryRange={salaryRange}
          setSalaryRange={setSalaryRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          clearFilters={clearFilters}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <JobFilters
            jobType={jobType}
            setJobType={setJobType}
            experience={experience}
            setExperience={setExperience}
            remoteOnly={remoteOnly}
            handleRemoteToggle={handleRemoteToggle}
            salaryRange={salaryRange}
            setSalaryRange={setSalaryRange}
            selectedSkills={selectedSkills}
            toggleSkill={toggleSkill}
            handleSearch={handleSearch}
            activeFilterCount={activeFilterCount}
            clearFilters={clearFilters}
          />

          <JobsList
            jobs={jobs}
            totalJobs={totalJobs}
            isLoading={isLoading}
            error={error}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            handleSearch={handleSearch}
            clearFilters={clearFilters}
            appliedJobIds={appliedJobIds}
            applicantsMap={applicantsMap}
            onToggleSave={handleToggleSave}
            saveJobIds={savedJobIds}
          />
        </div>

        {totalPages > 1 && !isLoading && (
          <JobPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}
