"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Share2, Heart, Building2, Users } from "lucide-react";
import type { Company } from "@/types/company";
import type { Job } from "@/types/job";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { convertCompanyType } from "@/helpers/convertCompanyType";
import { convertCompanySize } from "@/helpers/convertCompanySize";
import { convertCompanyIndustry } from "@/helpers/convertCompanyIndustry";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyHeaderProps {
  company: Company;
  jobsCompany: Job[];
  onJoinPending: (userId: string, userName: string, joinedAt: string, role: string) => void;
  onInviteUserToJoinCompany?: (userEmail: string) => void;
  scrollToCompanyJobs: () => void;
}

export function CompanyHeader({
  company,
  jobsCompany,
  onJoinPending,
  scrollToCompanyJobs,
  onInviteUserToJoinCompany,
}: CompanyHeaderProps) {
  const publishedJobCount = jobsCompany?.filter((job) => job?.status === "Published").length ?? 0;
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const { user } = useAuth();

  const isAdminCompany = company?.members?.some(
    (member) => member.userId === user?.userId && member.role === "admin_company"
  );

  const handleInviteEmployee = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Lỗi", {
        description: "Vui lòng nhập email nhân viên.",
        closeButton: true,
        className: "bg-red-500 text-white",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error("Lỗi", {
        description: "Email không hợp lệ.",
        closeButton: true,
        className: "bg-red-500 text-white",
      });
      return;
    }

    try {
      setIsInviting(true);
      if (onInviteUserToJoinCompany) {
        await onInviteUserToJoinCompany(inviteEmail);
        toast.success("Thành công!", {
          description: "Đã gửi lời mời thành công.",
          closeButton: true,
          className: "bg-green-500 text-white",
        });
        setInviteEmail("");
        setIsInviteModalOpen(false);
      }
    } catch (error) {
      console.error("Invite employee failed", error);
      toast.error("Lỗi", {
        description: "Có lỗi xảy ra, vui lòng thử lại.",
        closeButton: true,
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleCancelInvite = () => {
    setInviteEmail("");
    setIsInviteModalOpen(false);
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
        {company.coverImage && (
          <img
            src={company.coverImage || "/placeholder.svg"}
            alt={`${company.name} cover`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Company Info */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-16 bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="relative flex-shrink-0">
              <img
                src={company.logo || "/images/career_point_logo.jpg"}
                alt={`${company.name} logo`}
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* Company Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                  <p className="text-lg text-gray-600 mb-3">{convertCompanyType(company.companyType)}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-sm">
                      <Building2 className="w-4 h-4 mr-1" />
                      {convertCompanyIndustry(company.industry)}
                    </Badge>
                    {company.isVerified && (
                      <Badge variant="default" className="text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đã xác minh
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-sm">
                      {convertCompanySize(company.companySize)}
                    </Badge>
                  </div>
                  <p className="text-gray-600">
                    Thành lập năm {company.foundedYear} • {company.companyAge} năm hoạt động
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-col w-full sm:flex-row sm:w-auto sm:gap-2 md:flex-row md:w-auto md:gap-2">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                    <Heart className="w-4 h-4 mr-2" />
                    Yêu thích
                  </Button>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                    <Share2 className="w-4 h-4 mr-2" />
                    Chia sẻ
                  </Button>
                  {isAdminCompany && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 w-full sm:w-auto cursor-pointer"
                      onClick={() => setIsInviteModalOpen(true)}>
                      <Users className="w-4 h-4 mr-2" />
                      Mời nhân viên
                    </Button>
                  )}
                  <Button size="sm" className="w-full sm:w-auto cursor-pointer" onClick={scrollToCompanyJobs}>
                    Xem việc làm ({publishedJobCount})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Mời nhân viên</DialogTitle>
            <DialogDescription>Nhập email của nhân viên bạn muốn mời vào công ty.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nhannvien@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="col-span-3"
                disabled={isInviting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancelInvite} disabled={isInviting}>
              Huỷ
            </Button>
            <Button
              type="button"
              onClick={handleInviteEmployee}
              disabled={isInviting}
              className="bg-green-600 hover:bg-green-700">
              {isInviting ? "Đang gửi..." : "Mời"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
