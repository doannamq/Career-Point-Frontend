"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  SortAsc,
  FileText,
  Building,
  TrendingUp,
  User,
  Clock,
  UserCheck,
  UserX,
  Filter,
  BarChart3,
} from "lucide-react";
import { getJobApplicants, getJobBySlug } from "@/lib/api/jobs";
import { NavigationLink } from "@/components/ui/navigation-link";
import ViewPDF from "@/components/ViewPDF";
import { getApplicationsByApplicants, updateApplicationStatus } from "@/lib/api/application";

type ApplicationStatus = "Pending" | "Accepted" | "Rejected" | "Interviewing";

interface Applicant {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  bio: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    _id: string;
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  role: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  applicationId: string;
  resumeUrl: string;
  resumeFileName: string;
  status?: ApplicationStatus;
}

interface JobDetails {
  _id: string;
  title: string;
  slug: string;
  description: string;
  company: string;
  companyName: string;
  location: string;
  salary: number;
  experience: string;
  skills: string[];
  benefits: string[];
  applicationDeadline: string;
  jobType: string;
  postedBy: string;
  applicants: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ApplicantsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobSlug = params.slug as string;

  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Added loading state for actions

  const statusStats = {
    pending: applicants.filter((a) => !a.status || a.status === "Pending").length,
    accepted: applicants.filter((a) => a.status === "Accepted").length,
    rejected: applicants.filter((a) => a.status === "Rejected").length,
    interviewing: applicants.filter((a) => a.status === "Interviewing").length,
  };

  // Fetch job details and applicants
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.accessToken || !jobSlug) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch job details
        const jobResponse = await getJobBySlug(jobSlug);

        setJobDetails(jobResponse as unknown as JobDetails);

        // Fetch applicants for the job
        const applicants = await getJobApplicants(jobResponse?.slug as string, user?.accessToken);
        setApplicants(applicants);
        setFilteredApplicants(applicants);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, jobSlug]);

  // Filter and sort applicants
  useEffect(() => {
    let filtered = [...applicants];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (applicant.bio && applicant.bio.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((applicant) => (applicant.status || "Pending") === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "name":
        filtered.sort((a, b) => (a.userName || "").localeCompare(b.userName || ""));
        break;
      case "status":
        filtered.sort((a, b) => (a.status || "Pending").localeCompare(b.status || "Pending"));
        break;
    }

    setFilteredApplicants(filtered);
  }, [applicants, searchTerm, statusFilter, sortBy]);

  // Check if user is authorized
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "recruiter")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleUpdateApplicationStatus = async (applicationId: string, status: "Accepted" | "Rejected") => {
    try {
      setActionLoading(applicationId);
      await updateApplicationStatus(user?.accessToken as string, applicationId, status);

      // Update local state
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant._id === applicationId ? { ...applicant, status: status as ApplicationStatus } : applicant
        )
      );
    } catch (error) {
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status?: ApplicationStatus) => {
    const currentStatus = status || "Pending";
    switch (currentStatus) {
      case "Accepted":
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
          icon: UserCheck,
          text: "Đã chấp nhận",
        };
      case "Rejected":
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
          icon: UserX,
          text: "Đã từ chối",
        };
      case "Interviewing":
        return {
          variant: "secondary" as const,
          className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
          icon: User,
          text: "Phỏng vấn",
        };
      default:
        return {
          variant: "outline" as const,
          className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
          icon: Clock,
          text: "Chờ xử lý",
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-red-600">Error Loading Applicants</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "recruiter") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <NavigationLink href="/profile" className="hover:text-primary transition-colors">
                Profile
              </NavigationLink>
              <span>/</span>
              <NavigationLink href="/profile?tab=jobs" className="hover:text-primary transition-colors">
                Posted Jobs
              </NavigationLink>
              <span>/</span>
              <span className="text-foreground font-medium">Applicants</span>
            </div>

            {/* Back Button */}
            <motion.div className="mb-6">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:bg-primary/5 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            </motion.div>

            {/* Job Info Header */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-primary/3 to-secondary/5 mb-6">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-balance mb-3">{jobDetails?.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{jobDetails?.companyName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{jobDetails?.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Đăng ngày{" "}
                          {jobDetails?.createdAt
                            ? new Date(jobDetails.createdAt).toLocaleDateString("vi-VN")
                            : "Gần đây"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>{jobDetails?.jobType}</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">{jobDetails?.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <div className="text-center p-4 bg-background/50 rounded-lg border">
                      <div className="text-2xl font-bold text-primary">{applicants.length}</div>
                      <div className="text-sm text-muted-foreground">Tổng ứng viên</div>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg border">
                      <div className="text-2xl font-bold text-yellow-600">{statusStats.pending}</div>
                      <div className="text-sm text-muted-foreground">Chờ xử lý</div>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">{statusStats.accepted}</div>
                      <div className="text-sm text-muted-foreground">Đã chấp nhận</div>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg border">
                      <div className="text-2xl font-bold text-red-600">{statusStats.rejected}</div>
                      <div className="text-sm text-muted-foreground">Đã từ chối</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm theo tên, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    {/* Status Filter */}
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "all")}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Lọc theo trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="Pending">Chờ xử lý</SelectItem>
                        <SelectItem value="Interviewing">Phỏng vấn</SelectItem>
                        <SelectItem value="Accepted">Đã chấp nhận</SelectItem>
                        <SelectItem value="Rejected">Đã từ chối</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SortAsc className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sắp xếp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Mới nhất</SelectItem>
                        <SelectItem value="name">Tên (A-Z)</SelectItem>
                        <SelectItem value="status">Trạng thái</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hover:bg-primary/5 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Xuất file
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-primary/5 bg-transparent">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Thống kê
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Applicants List */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            animate="visible"
            className="space-y-4">
            {filteredApplicants.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {searchTerm || statusFilter !== "all" ? "Không tìm thấy ứng viên phù hợp" : "Chưa có ứng viên nào"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all"
                      ? "Thử điều chỉnh bộ lọc tìm kiếm của bạn."
                      : "Chưa có ai ứng tuyển vào công việc này. Hãy chia sẻ tin tuyển dụng để thu hút ứng viên!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredApplicants.map((applicant, index) => {
                    const statusBadge = getStatusBadge(applicant.status);
                    const StatusIcon = statusBadge.icon;

                    return (
                      <motion.div
                        key={applicant.userId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        layout>
                        <Card className="hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/20">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Applicant Info */}
                              <div className="flex-1">
                                <div className="flex items-start gap-4">
                                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                                      {applicant.userName
                                        ?.split(" ")
                                        .map((n: string) => n[0])
                                        .join("")
                                        .toUpperCase() || "??"}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-3">
                                      <h3 className="text-lg font-semibold text-foreground truncate">
                                        {applicant.userName || "Tên không có"}
                                      </h3>
                                      <Badge className={statusBadge.className}>
                                        <StatusIcon className="h-3.5 w-3.5 mr-1" />
                                        {statusBadge.text}
                                      </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span className="truncate">{applicant.userEmail}</span>
                                      </div>
                                      {applicant.userPhoneNumber && (
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                                          <span>{applicant.userPhoneNumber}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>
                                          Ứng tuyển: {new Date(applicant.createdAt).toLocaleDateString("vi-VN")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-3 lg:w-56">
                                {/* Primary Actions */}
                                <div className="grid grid-cols-2 gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                                    <Eye className="h-3.5 w-3.5 mr-2" />
                                    Xem hồ sơ
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowModal(true)}
                                    className="hover:bg-muted/50">
                                    <FileText className="h-3.5 w-3.5 mr-2" />
                                    CV
                                  </Button>
                                </div>

                                {/* Status Actions */}
                                {(!applicant.status || applicant.status === "Pending") && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUpdateApplicationStatus(applicant._id, "Accepted")}
                                      disabled={actionLoading === applicant._id}
                                      className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-colors">
                                      {actionLoading === applicant._id ? (
                                        <motion.div
                                          className="h-3.5 w-3.5 border-2 border-green-600 border-t-transparent rounded-full"
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        />
                                      ) : (
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                      )}
                                      <span className="ml-1">Chấp nhận</span>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUpdateApplicationStatus(applicant._id, "Rejected")}
                                      disabled={actionLoading === applicant._id}
                                      className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors">
                                      {actionLoading === applicant._id ? (
                                        <motion.div
                                          className="h-3.5 w-3.5 border-2 border-red-600 border-t-transparent rounded-full"
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        />
                                      ) : (
                                        <XCircle className="h-3.5 w-3.5" />
                                      )}
                                      <span className="ml-1">Từ chối</span>
                                    </Button>
                                  </div>
                                )}

                                {/* Contact Actions */}
                                <div className="grid grid-cols-2 gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => window.open(`mailto:${applicant.userEmail}`, "_blank")}
                                          className="hover:bg-muted/50">
                                          <Mail className="h-3.5 w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="bottom">
                                        <p>Gửi email</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  {applicant.userPhoneNumber && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(`tel:${applicant.userPhoneNumber}`, "_blank")}
                                            className="hover:bg-muted/50">
                                            <Phone className="h-3.5 w-3.5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                          <p>Gọi điện</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* PDF Modal */}
                        <ViewPDF
                          showModal={showModal}
                          setShowModal={setShowModal}
                          resumeUrl={applicant.resumeUrl}
                          resumeFileName={applicant.resumeFileName}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Job Details Summary */}
          {jobDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Chi tiết công việc
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Kinh nghiệm</div>
                      <div className="font-medium">{jobDetails.experience}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Loại công việc</div>
                      <div className="font-medium">{jobDetails.jobType}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Hạn ứng tuyển</div>
                      <div className="font-medium">
                        {new Date(jobDetails.applicationDeadline).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Mức lương</div>
                      <div className="font-medium text-primary">
                        ${jobDetails.salary?.toLocaleString() || "Thỏa thuận"}
                      </div>
                    </div>
                  </div>

                  {jobDetails.skills?.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-3">Kỹ năng yêu cầu</div>
                      <div className="flex flex-wrap gap-2">
                        {jobDetails.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {jobDetails.benefits?.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-3">Quyền lợi</div>
                      <div className="flex flex-wrap gap-2">
                        {jobDetails.benefits.map((benefit) => (
                          <Badge
                            key={benefit}
                            className="bg-secondary/10 text-secondary-foreground border-secondary/20">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
