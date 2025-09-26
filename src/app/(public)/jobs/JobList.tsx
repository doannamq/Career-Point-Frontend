"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, X, Search, RefreshCw, ArrowUpDown } from "lucide-react";
import JobCard from "@/components/JobCard";
import JobCardSkeleton from "./JobCardSkeleton";
import { Job } from "@/types/job";
// import type { Job } from "./JobPageClient";

interface JobsListProps {
  jobs: Job[];
  totalJobs: number;
  isLoading: boolean;
  error: string | null;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  sortBy: "score" | "salary" | "createdAt";
  setSortBy: (value: "score" | "salary" | "createdAt") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  handleSearch: () => void;
  clearFilters: () => void;
  applicantsMap: any;
  appliedJobIds: any;
  saveJobIds: string[];
  onToggleSave: (jobId: string) => void | Promise<void>;
}

export default function JobsList({
  jobs,
  totalJobs,
  isLoading,
  error,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  handleSearch,
  clearFilters,
  applicantsMap,
  appliedJobIds,
  saveJobIds,
  onToggleSave,
}: JobsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Đang tìm kiếm...
              </span>
            ) : totalJobs > 0 ? (
              <>
                Hiển thị <span className="font-medium">{jobs.length}</span> of{" "}
                <span className="font-medium">{totalJobs}</span> việc làm
              </>
            ) : (
              <>Không tìm thấy việc làm phù hợp</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "grid")} className="hidden sm:block">
            <TabsList className="h-8">
              <TabsTrigger value="list" className="text-xs px-3">
                Danh sách
              </TabsTrigger>
              <TabsTrigger value="grid" className="text-xs px-3">
                Lưới
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Label htmlFor="sortBy" className="text-sm whitespace-nowrap hidden sm:block">
              Sắp xếp
            </Label>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value as any);
                handleSearch();
              }}>
              <SelectTrigger id="sortBy" className="w-[140px] sm:w-[180px] h-9 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Liên quan nhất</SelectItem>
                <SelectItem value="salary">Lương</SelectItem>
                <SelectItem value="createdAt">Ngày đăng</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                handleSearch();
              }}
              className="h-9 w-9"
              title={sortOrder === "asc" ? "Ascending" : "Descending"}>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          className="bg-destructive/10 text-destructive p-4 rounded-md mb-4 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}>
          <X className="h-4 w-4" />
          {error}
        </motion.div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <motion.div
          className="text-center py-12 border rounded-lg bg-muted/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-muted rounded-full p-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mt-2">Không tìm thấy việc làm phù hợp</h3>
            <p className="text-muted-foreground mt-1 max-w-md">
              Không có việc làm nào phù hợp với tiêu chí tìm kiếm. Hãy thử thay đổi bộ lọc hoặc từ khóa.
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4 gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Xoá bộ lọc
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 gap-4" : "space-y-4"}>
          <AnimatePresence mode="popLayout">
            {jobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout>
                <JobCard
                  key={job._id}
                  job={job}
                  isApplied={appliedJobIds.includes(job.jobId)}
                  applicantCount={applicantsMap[job.jobId] || 0}
                  isSaved={saveJobIds.includes(job.jobId)}
                  onToggleSave={onToggleSave}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
