"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import { getAllCompany, rejectCompany, verifyCompany } from "@/lib/api/company";
import { useAuth } from "@/context/auth-context";

export default function CompaniesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [companies, setCompanies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [limit, setLimit] = useState(10);

  const fetchCompanies = async (page = 1, searchQuery = searchTerm, status = statusFilter) => {
    setLoading(true);
    try {
      const response = await getAllCompany(page, limit, searchQuery, status);
      if (response.success) {
        setCompanies(response.companies);
        setTotalCompanies(response.totalCompanies);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage, limit]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Map API status to display status
  const getDisplayStatus = (apiStatus: string, isVerified: boolean) => {
    if (isVerified && apiStatus === "active") return "verified";
    if (apiStatus === "pending_verification") return "pending";
    if (apiStatus === "inactive" || apiStatus === "suspended") return "rejected";
    return apiStatus;
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "verified":
        return "default";
      case "pending":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "Đã xác thực";
      case "pending":
        return "Chờ duyệt";
      case "rejected":
        return "Bị từ chối";
      default:
        return status;
    }
  };

  const getBadgeClassName = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
      case "verified":
        return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
      default:
        return "";
    }
  };

  // Calculate statistics from API data
  const totalCompaniesCount = totalCompanies || companies.length;
  const verifiedCompanies = companies.filter((c: any) => c.isVerified && c.status === "active").length;
  const pendingCompanies = companies.filter((c: any) => c.status === "pending_verification").length;
  const rejectedCompanies = companies.filter((c: any) => c.status === "inactive" || c.status === "suspended").length;
  const totalActiveJobs = companies.reduce((sum: number, c: any) => {
    if (typeof c.stats === "object" && c.stats !== null) {
      return sum + (c.stats.activeJobs || 0);
    }
    return sum;
  }, 0);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleVerifyCompany = async (companyId: string) => {
    try {
      const response = await verifyCompany(user?.accessToken as string, companyId);
      if (response?.success) {
        setCompanies((prev) => prev.map((c: any) => (c._id === companyId ? { ...c, isVerified: true, status: "active" } : c)));
      }
    } catch (error) {
      console.error("Error verify company:", error);
    }
  };

  const handleRejectCompany = async (companyId: string) => {
    try {
      const response = await rejectCompany(user?.accessToken as string, companyId);
      if (response?.success) {
        setCompanies((prev) => prev.map((c: any) => (c._id === companyId ? { ...c, isVerified: false, status: "inactive" } : c)));
      }
    } catch (error) {
      console.error("Error reject company:", error);
    }
  };

  const handleDelete = async (companyId: string) => {
    try {
      // API call to delete company
      console.log("Deleting company:", companyId);
      // Update local state
      setCompanies(companies.filter((company) => company._id !== companyId));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "pending_verification", label: "Chờ duyệt" },
    { value: "active", label: "Đã xác thực" },
    { value: "inactive", label: "Bị từ chối" },
    { value: "suspended", label: "Bị đình chỉ" },
  ];

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
    fetchCompanies(1, searchTerm, statusFilter);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    fetchCompanies(1, searchTerm, value);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setCurrentPage(1);
    fetchCompanies(1, searchTerm, statusFilter);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý công ty</h1>
          <p className="text-muted-foreground">Quản lý các công ty đối tác và nhà tuyển dụng</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm công ty mới
        </Button>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalCompaniesCount}</div>
            <p className="text-xs text-muted-foreground">Tổng cộng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingCompanies}</div>
            <p className="text-xs text-muted-foreground">Chờ duyệt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{verifiedCompanies}</div>
            <p className="text-xs text-muted-foreground">Đã xác thực</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{rejectedCompanies}</div>
            <p className="text-xs text-muted-foreground">Bị từ chối</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{totalActiveJobs}</div>
            <p className="text-xs text-muted-foreground">Việc làm đang tuyển</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách công ty</CardTitle>
          <CardDescription>
            Hiển thị {companies.length} trong tổng số {totalCompanies} công ty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên công ty hoặc ngành nghề..."
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
                  {statusOptions.map((option) => (
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
                  <TableHead>Công ty</TableHead>
                  <TableHead className="hidden md:table-cell">Ngành nghề</TableHead>
                  <TableHead className="hidden lg:table-cell">Quy mô</TableHead>
                  <TableHead className="hidden lg:table-cell">Địa điểm</TableHead>
                  <TableHead className="hidden xl:table-cell">Ngày tham gia</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="hidden sm:table-cell">Việc làm</TableHead>
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
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Không tìm thấy công ty nào
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company: any) => {
                    const displayStatus = getDisplayStatus(company.status, company.isVerified);
                    return (
                      <TableRow key={company._id || company.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3 max-w-[200px]">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage src={company.logo || "/placeholder.svg?height=40&width=40"} alt={company.name} />
                              <AvatarFallback>{company.name?.charAt(0) || "C"}</AvatarFallback>
                            </Avatar>
                            <div className="truncate" title={company.name}>
                              {company.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-[120px]">
                          <div className="truncate" title={company.industry}>
                            {company.industry}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{company.companySize}</TableCell>
                        <TableCell className="hidden lg:table-cell max-w-[120px]">
                          <div className="truncate" title={company.fullAddress || company.address?.city || "N/A"}>
                            {company.fullAddress || company.address?.city || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">{formatDate(company.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(displayStatus)} className={getBadgeClassName(displayStatus)}>
                            {getStatusText(displayStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="font-medium">
                            {typeof company.stats === "object" && company.stats !== null ? company.stats.activeJobs || 0 : 0}
                          </span>
                        </TableCell>

                        {/* Cột Actions Duyệt */}
                        <TableCell className="text-center">
                          {displayStatus === "pending" ? (
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifyCompany(company._id)}
                                className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300">
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectCompany(company._id)}
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
                              <DropdownMenuItem onClick={() => handleDelete(company._id)} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Hiển thị <span className="font-medium">{companies.length}</span> trong <span className="font-medium">{totalCompanies}</span> kết quả
              </p>
              <Select value={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={limit} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 50, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="hidden sm:flex">
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">{renderPaginationButtons()}</div>
              <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
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
