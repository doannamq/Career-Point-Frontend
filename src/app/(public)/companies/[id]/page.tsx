"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CompanyHeader } from "@/components/company-header";
import { CompanyStats } from "@/components/company-stats";
import { CompanyContact } from "@/components/company-contact";
import { acceptJoinRequest, getCompanyById, inviteUserToJoinCompany } from "@/lib/api/company";
import {
  ArrowLeft,
  Loader2,
  Gift,
  Tag,
  FileText,
  Calendar,
  Building2,
  AlertCircle,
  EyeOff,
  Eye,
  Users,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Check,
  X,
  Trash,
} from "lucide-react";
import type { Company } from "@/types/company";
import { getJobsByCompanyId } from "@/lib/api/jobs";
import type { Job } from "@/types/job";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import CompanyJobs from "@/components/company-jobs";
import { convertCompanySize } from "@/helpers/convertCompanySize";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobsCompany, setJobsCompany] = useState<Job[]>([]);
  const [showBusinessCode, setShowBusinessCode] = useState(false);
  const [showTaxCode, setShowTaxCode] = useState(false);
  const [isShowEmployees, setIsShowEmployees] = useState(false);
  const [processingMembers, setProcessingMembers] = useState<Set<string>>(new Set());
  const userId = useSelector((state: RootState) => state.user.userId);
  const { user } = useAuth();
  const jobsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!params.id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await getCompanyById(params.id as string);
        if (response.success) {
          setCompany(response.company);
        } else {
          setError("Không tìm thấy thông tin công ty");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải thông tin công ty");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [params.id]);

  const scrollToCompanyJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isCompanyMember = company?.members?.some((m) => m.userId === userId);

  const handleGetJobsByCompanyId = async () => {
    try {
      if (company?._id) {
        const response = await getJobsByCompanyId(company?._id as string);
        setJobsCompany(response?.jobs);
      }
    } catch (error) {
      console.log("Error to get jobs by company id", error);
    }
  };

  const handleAddPendingMember = (userId: string, userName: string, joinedAt: string, role: string) => {
    setCompany((prevCompany) => {
      if (!prevCompany) return prevCompany;
      if (prevCompany.members?.some((m) => m.userId === userId)) return prevCompany;
      return {
        ...prevCompany,
        members: [
          ...(prevCompany.members || []),
          {
            _id: "",
            userId,
            userName,
            joinedAt,
            role,
            status: "pending",
            permissions: [],
          },
        ],
        memberCount: prevCompany.memberCount,
      };
    });
  };

  const handleAcceptMember = async (memberId: string) => {
    // Thêm member vào processing state
    setProcessingMembers((prev) => new Set(prev).add(memberId));

    try {
      const response = await acceptJoinRequest(company?._id as string, memberId, user?.accessToken as string);
      if (response.success && response.member) {
        toast.success("Thành viên đã được phê duyệt");
        setCompany((prevCompany) => {
          if (!prevCompany) return prevCompany;
          const updatedMembers = prevCompany.members?.map((member) => {
            if (member.userId === response.member.userId) {
              return {
                ...member,
                ...response.member, // cập nhật mọi trường mới nhất, bao gồm permissions
              };
            }
            return member;
          });
          const wasPending =
            prevCompany.members?.find((m) => m.userId === response.member.userId)?.status === "pending";
          return {
            ...prevCompany,
            members: updatedMembers,
            memberCount: wasPending ? prevCompany.memberCount + 1 : prevCompany.memberCount,
          };
        });
      } else {
        toast.error("Không thể phê duyệt thành viên");
      }
    } catch (error) {
      console.log("Error to accept member join company", error);
      toast.error("Đã xảy ra lỗi khi phê duyệt thành viên");
    } finally {
      // Remove member khỏi processing state
      setProcessingMembers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  const handleRejectMember = async (memberId: string) => {
    // Thêm member vào processing state
    setProcessingMembers((prev) => new Set(prev).add(memberId));

    try {
      // Giả sử bạn có API để reject member
      // const response = await rejectJoinRequest(company?._id as string, memberId, user?.accessToken as string);

      // Tạm thời simulate reject bằng cách remove member khỏi danh sách
      setCompany((prevCompany) => {
        if (!prevCompany) return prevCompany;

        const updatedMembers = prevCompany.members?.filter((member) => member.userId !== memberId);

        return {
          ...prevCompany,
          members: updatedMembers,
          memberCount: prevCompany.memberCount - 1,
        };
      });

      toast.success("Đã từ chối thành viên");
    } catch (error) {
      console.log("Error to reject member join company", error);
      toast.error("Đã xảy ra lỗi khi từ chối thành viên");
    } finally {
      setProcessingMembers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  const handleInviteUserToJoinCompany = async (userEmail: string) => {
    try {
      await inviteUserToJoinCompany(company?._id as string, user?.accessToken as string, userEmail);
    } catch (error) {
      console.error("Error to invite user to join company", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    // Thêm member vào processing state
    setProcessingMembers((prev) => new Set(prev).add(memberId));

    try {
      // Giả sử bạn có API để remove member
      // const response = await removeMember(company?._id as string, memberId, user?.accessToken as string);

      // Tạm thời simulate remove bằng cách remove member khỏi danh sách
      setCompany((prevCompany) => {
        if (!prevCompany) return prevCompany;

        const updatedMembers = prevCompany.members?.filter((member) => member.userId !== memberId);

        return {
          ...prevCompany,
          members: updatedMembers,
          memberCount: prevCompany.memberCount - 1,
        };
      });

      toast.success("Đã xoá thành viên");
    } catch (error) {
      console.log("Error to remove member from company", error);
      toast.error("Đã xảy ra lỗi khi xoá thành viên");
    } finally {
      // Remove member khỏi processing state
      setProcessingMembers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    handleGetJobsByCompanyId();
  }, [company]);

  const handleOpenEmployees = () => {
    setIsShowEmployees((prev) => !prev);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin_company":
        return "default";
      case "recruiter":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin_company":
        return "Quản trị viên";
      case "recruiter":
        return "Nhà tuyển dụng";
      default:
        return role;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "pending":
        return "Chờ xác nhận";
      default:
        return "Không hoạt động";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Đang tải thông tin công ty...</span>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Không thể tải thông tin công ty</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.back()} className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/5 cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Company Header */}
      <CompanyHeader
        company={company}
        jobsCompany={jobsCompany}
        onJoinPending={handleAddPendingMember}
        onInviteUserToJoinCompany={handleInviteUserToJoinCompany}
        scrollToCompanyJobs={scrollToCompanyJobs}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Stats */}
            <CompanyStats company={company} jobsCompany={jobsCompany} />

            {/* Company Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Giới thiệu công ty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-blue-100/60 rounded-xl p-6 bg-white shadow-sm">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: company?.description }}
                  />
                </div>
                {company.notes && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">{company.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits */}
            {company.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Phúc lợi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {company.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {company.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Từ khóa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {company.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Company jobs */}
            <CompanyJobs
              jobs={jobsCompany}
              sectionRef={jobsSectionRef}
              accessToken={user?.accessToken as string}
              companyId={params.id as string}
            />
          </div>

          {/* Right Column - Contact & Additional Info */}
          <div className="space-y-6">
            {/* Company Contact */}
            <div className="lg:col-span-1">
              <CompanyContact company={company} />
            </div>

            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Thông tin chi tiết
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mã số doanh nghiệp:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {showBusinessCode && isCompanyMember ? company.businessCode : "*****"}
                    </span>
                    {isCompanyMember && (
                      <button
                        type="button"
                        onClick={() => setShowBusinessCode((prev) => !prev)}
                        className="ml-2 focus:outline-none"
                        title={showBusinessCode ? "Ẩn mã số" : "Hiện mã số"}>
                        {showBusinessCode ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mã số thuế:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{showTaxCode && isCompanyMember ? company.taxCode : "*****"}</span>
                    {isCompanyMember && (
                      <button
                        type="button"
                        onClick={() => setShowTaxCode((prev) => !prev)}
                        className="ml-2 focus:outline-none"
                        title={showTaxCode ? "Ẩn tax code" : "Hiện tax code"}>
                        {showTaxCode ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quy mô:</span>
                  <span className="font-medium">{convertCompanySize(company.companySize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số thành viên:</span>
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-medium">{company.memberCount}</span>
                    {userId && company?.members?.some((m) => m?.userId === userId && m.role === "admin_company") && (
                      <Button
                        variant={"outline"}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                        onClick={handleOpenEmployees}>
                        <Users className="w-4 h-4 mr-2" />
                        Nhân viên
                      </Button>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <Badge variant={company.status === "active" ? "default" : "secondary"}>
                    {company.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
                {isCompanyMember && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gói đăng ký:</span>
                    <Badge variant="outline">
                      {company.subscription.plan === "free" ? "Miễn phí" : company.subscription.plan}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Last Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Cập nhật lần cuối: {new Date(company.lastActivity).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-sm text-gray-600">
                  Tham gia từ: {new Date(company.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Employees Modal */}
      <AnimatePresence>
        {isShowEmployees && (
          <Dialog open={isShowEmployees} onOpenChange={setIsShowEmployees}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full">
                <DialogHeader className="p-6 pb-4 border-b">
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Danh sách thành viên ({company.members?.length || 0})
                  </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-[500px] max-h-[60vh] p-6">
                    <div className="space-y-4 pr-4">
                      {company.members
                        ?.filter((member) => member.status === "active")
                        .map((member, index) => {
                          const isProcessing = processingMembers.has(member.userId);
                          const isAdmin =
                            userId && company?.members?.some((m) => m?.userId === userId && m.role === "admin_company");
                          const isPendingMember = member.status === "pending" && member.role !== "admin_company";
                          const isActiveMember = member.status !== "pending" && member.role !== "admin_company";

                          return (
                            <motion.div
                              key={member._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}>
                              <Card className="hover:shadow-md transition-shadow relative">
                                {isAdmin && isPendingMember && (
                                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handleAcceptMember(member.userId)}
                                      className="border-1 border-green-300"
                                      title="Phê duyệt"
                                      disabled={isProcessing}>
                                      {isProcessing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Check className="w-5 h-5 text-green-500" />
                                      )}
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handleRejectMember(member.userId)}
                                      className="border-1 border-red-300"
                                      title="Từ chối"
                                      disabled={isProcessing}>
                                      {isProcessing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <X className="w-5 h-5 text-red-500" />
                                      )}
                                    </Button>
                                  </div>
                                )}
                                {isAdmin && isActiveMember && (
                                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="border-1 border-gray-300"
                                      title="Xoá thành viên"
                                      onClick={() => handleRemoveMember(member.userId)}
                                      disabled={isProcessing}>
                                      {isProcessing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Trash className="w-5 h-5 text-gray-500" />
                                      )}
                                    </Button>
                                  </div>
                                )}
                                <CardContent className="p-4 ">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                          {member.userName?.slice(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                          <p className="font-medium text-gray-900">{member.userName}</p>
                                          <p className="text-sm text-gray-500">
                                            Tham gia: {new Date(member.joinedAt).toLocaleDateString("vi-VN")}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 mb-3">
                                        <Badge
                                          variant={getRoleBadgeVariant(member.role)}
                                          className="flex items-center gap-1">
                                          <Shield className="w-3 h-3" />
                                          {getRoleDisplayName(member.role)}
                                        </Badge>
                                        <div className="flex items-center gap-1">
                                          {getStatusIcon(member.status)}
                                          <span className="text-sm text-gray-600">
                                            {getStatusDisplayName(member.status)}
                                          </span>
                                        </div>
                                      </div>

                                      {/* {member.permissions && member.permissions.length > 0 && (
                                      <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Quyền hạn:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {member.permissions.map((permission, permIndex) => (
                                            <Badge key={permIndex} variant="outline" className="text-xs">
                                              {permission.replace(/_/g, " ")}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )} */}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
