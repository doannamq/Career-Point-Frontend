"use client";

import { type FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Briefcase,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Banknote,
} from "lucide-react";
import { Job } from "@/types/job";
import Link from "next/link";
import { formatSalary, markJobAsFeatured } from "@/lib/api/jobs";
import { formatCompanyAddress } from "@/helpers/formatCompanyAddress";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CompanyJobsProps {
  jobs: Job[];
  isLoading?: boolean;
  sectionRef: React.RefObject<HTMLDivElement | null>;
  accessToken: string;
  companyId: string;
}

const CompanyJobs: FC<CompanyJobsProps> = ({ jobs, isLoading = false, sectionRef, accessToken, companyId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredJobIds, setFeaturedJobIds] = useState<string[]>(jobs.filter((j) => j.isFeatured).map((j) => j._id));
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);
  const pageSize = 10;

  const totalPages = Math.ceil(jobs?.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const jobsToShow = jobs?.slice(startIdx, endIdx);
  const router = useRouter();

  const handleMarkFeatured = async (jobId: string) => {
    try {
      if (accessToken) {
        setLoadingJobId(jobId);
        const res = await markJobAsFeatured(accessToken, jobId);
        if (res.success) {
          setFeaturedJobIds((prev) => [...prev, jobId]);
        } else {
          toast.error(res.message || "Không thể đánh dấu công việc này là nổi bật");
        }
      } else {
        router.push(`/login?redirect=/companies/${companyId}`);
      }
    } catch (error: any) {
      // toast.error(error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi đánh dấu featured");
      toast.error("Lỗi", {
        description: error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi đánh dấu featured",
      });
    } finally {
      setLoadingJobId(null);
    }
  };

  // const formatSalary = (salary: number) => {
  //   if (salary >= 1000000) {
  //     return `${(salary / 1000000).toFixed(1)}M VNĐ`;
  //   }
  //   return `${salary.toLocaleString()} VNĐ`;
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType.toLowerCase()) {
      case "full-time":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "part-time":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "contract":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "internship":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-primary" />
        <span className="text-lg text-muted-foreground">Đang tải công việc...</span>
      </motion.div>
    );
  }

  if (jobs?.length === 0) {
    return (
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16">
        <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">Chưa có công việc nào</h3>
        <p className="text-muted-foreground">Công ty này chưa đăng tuyển vị trí nào.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Briefcase className="w-7 h-7 text-primary" />
            Các vị trí tuyển dụng
            <Badge variant="secondary" className="ml-auto">
              {jobs?.length} vị trí
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4">
              {jobsToShow?.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  // whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="group w-full">
                  <Card className="border-2 border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50">
                    <CardContent>
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Link href={`/jobs/${job.slug}`}>
                                <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                                  {job.title}
                                </h3>
                              </Link>
                              <Badge className={`${getJobTypeColor(job.jobType)} shrink-0 ml-4`}>{job.jobType}</Badge>
                              <button
                                className="ml-3"
                                disabled={
                                  job.isFeatured || featuredJobIds.includes(job._id) || loadingJobId === job._id
                                }
                                title={
                                  job.isFeatured || featuredJobIds.includes(job._id)
                                    ? "Đã featured"
                                    : "Đánh dấu featured"
                                }
                                onClick={() => handleMarkFeatured(job._id)}
                                style={{ background: "none", border: "none", cursor: "pointer" }}>
                                <Star
                                  className={`w-6 h-6 transition-colors ${
                                    job.isFeatured || featuredJobIds.includes(job._id)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-400"
                                  }`}
                                />
                              </button>
                            </div>
                            <p className="text-base text-muted-foreground font-medium">{job.companyName}</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span>{formatCompanyAddress(job.location)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                              <Banknote className="w-4 h-4" />
                              <span>{formatSalary(job.salary)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 text-primary" />
                              <span>{job.experience}</span>
                            </div>
                            {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="w-4 h-4 text-primary" />
                              <span>{job.applicants.length} ứng viên</span>
                            </div> */}
                          </div>
                        </div>

                        <div className="lg:w-64 flex flex-col items-end gap-4">
                          <Badge
                            variant={job.status === "Published" ? "default" : "secondary"}
                            className="text-sm px-3 py-1">
                            {job.status === "Published" ? "Đang tuyển" : job.status}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>Hạn nộp: {formatDate(job.applicationDeadline)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Trước
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10 p-0">
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2">
                Sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CompanyJobs;
