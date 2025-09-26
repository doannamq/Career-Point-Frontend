"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { approveJob, getAllJobs, rejectJob } from "@/lib/api/jobs";
import { useAuth } from "@/context/auth-context";

interface Job {
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
  jobType: string;
  applicationDeadline: string;
  postedBy: string;
  applicants: string[];
  status: string;
  createdAt: string;
}

interface JobsResponse {
  success: boolean;
  message: string;
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}

export default function JobsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [limit, setLimit] = useState(10);

  const fetchJobs = async (page = 1, searchQuery = searchTerm, status = statusFilter) => {
    setLoading(true);
    try {
      const response: JobsResponse = await getAllJobs(page, limit, searchQuery, status);
      if (response.success) {
        setJobs(response.jobs);
        setTotalJobs(response.totalJobs);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, limit]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      Draft: "Bản nháp",
      Published: "Đang tuyển",
      Closed: "Đã đóng",
      Expired: "Hết hạn",
      Archived: "Đã lưu trữ",
      Pending: "Chờ duyệt",
      Rejected: "Từ chối",
      Approved: "Đã duyệt",
    };
    return statusMap[status] || status;
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Published":
      case "Approved":
        return "default"; // màu xanh lá
      case "Draft":
        return "secondary"; // màu xám
      case "Pending":
        return "outline"; // màu vàng outline
      case "Closed":
      case "Expired":
      case "Archived":
        return "secondary"; // màu xám
      case "Rejected":
        return "destructive"; // màu đỏ
      default:
        return "outline";
    }
  };

  const getBadgeClassName = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
      case "Approved":
      case "Published":
        return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
      default:
        return "";
    }
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("vi-VN", options);
  };

  const handleApprove = async (jobId: string) => {
    try {
      if (user) {
        await approveJob(user?.accessToken, jobId);
        setJobs(jobs?.map((job) => (job._id === jobId ? { ...job, status: "Approved" } : job)));
      }
    } catch (error) {
      console.error("Error approving job:", error);
    }
  };

  const handleReject = async (jobId: string) => {
    try {
      if (user) {
        await rejectJob(user?.accessToken, jobId);
        setJobs(jobs?.map((job) => (job._id === jobId ? { ...job, status: "Rejected" } : job)));
      }
    } catch (error) {
      console.error("Error rejecting job:", error);
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      // API call to delete job
      console.log("Deleting job:", jobId);
      // Update local state
      setJobs(jobs?.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "Pending", label: "Chờ duyệt" },
    { value: "Approved", label: "Đã duyệt" },
    { value: "Published", label: "Đang tuyển" },
    { value: "Draft", label: "Bản nháp" },
    { value: "Rejected", label: "Từ chối" },
    { value: "Closed", label: "Đã đóng" },
    { value: "Expired", label: "Hết hạn" },
    { value: "Archived", label: "Đã lưu trữ" },
  ];

  const getStatusCounts = () => {
    const counts = jobs?.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Pagination UI helpers
  const renderPaginationButtons = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? "bg-primary text-primary-foreground" : ""}>
          {i}
        </Button>
      );
    }

    return pages;
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs(1, searchTerm, statusFilter);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    fetchJobs(1, searchTerm, value);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setCurrentPage(1);
    fetchJobs(1, searchTerm, statusFilter);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý việc làm</h1>
          <p className="text-muted-foreground">Quản lý tất cả các công việc được đăng tuyển</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm việc làm mới
        </Button>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">Tổng cộng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts?.Pending || 0}</div>
            <p className="text-xs text-muted-foreground">Chờ duyệt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statusCounts?.Published || 0}</div>
            <p className="text-xs text-muted-foreground">Đang tuyển</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{statusCounts?.Rejected || 0}</div>
            <p className="text-xs text-muted-foreground">Từ chối</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{statusCounts?.Draft || 0}</div>
            <p className="text-xs text-muted-foreground">Bản nháp</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-500">{statusCounts?.Closed || 0}</div>
            <p className="text-xs text-muted-foreground">Đã đóng</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách việc làm</CardTitle>
          <CardDescription>
            Hiển thị {jobs?.length} trong tổng số {totalJobs} việc làm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên công việc hoặc công ty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên công việc</TableHead>
                  <TableHead>Công ty</TableHead>
                  <TableHead className="hidden md:table-cell">Loại việc</TableHead>
                  <TableHead className="hidden lg:table-cell">Địa điểm</TableHead>
                  <TableHead className="hidden xl:table-cell">Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="hidden sm:table-cell">Ứng tuyển</TableHead>
                  <TableHead className="text-center">Duyệt</TableHead>
                  <TableHead className="text-right">Khác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : jobs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Không tìm thấy việc làm nào
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs?.map((job) => (
                    <TableRow key={job._id}>
                      <TableCell className="font-medium max-w-[150px]">
                        <div className="truncate" title={job.title}>
                          {job.title}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[120px]">
                        <div className="truncate" title={job.companyName}>
                          {job.companyName}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{job.jobType}</TableCell>
                      <TableCell className="hidden lg:table-cell max-w-[120px]">
                        <div className="truncate" title={job.location}>
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">{formatDate(job.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(job.status)} className={getBadgeClassName(job.status)}>
                          {getStatusText(job.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="font-medium">{job?.applicants?.length || 0}</span>
                      </TableCell>

                      {/* Cột Actions Duyệt */}
                      <TableCell className="text-center">
                        {job.status === "Pending" ? (
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(job._id)}
                              className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300">
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(job._id)}
                              className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      {/* Cột Actions Khác */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(job._id)}
                              className="text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Hiển thị <span className="font-medium">{jobs?.length}</span> trong{" "}
                <span className="font-medium">{totalJobs}</span> kết quả
              </p>
              <Select value={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={limit} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 50, 100]?.map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="hidden sm:flex">
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">{renderPaginationButtons()}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden sm:flex">
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
