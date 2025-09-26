"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { MapPin, Clock, Calendar, CheckCircle2, Send, Mail, Phone, Loader2, Banknote, BellRing } from "lucide-react";
import { AiOutlineContainer } from "react-icons/ai";
import { TfiBriefcase } from "react-icons/tfi";
import { formatSalary, formatDate } from "@/lib/api/jobs";
import { convertJobType } from "@/helpers/converJobType";
import { Job } from "@/types/job";

interface JobSidebarProps {
  job: Job;
  user: any;
  hasApplied: boolean;
  isApplying: boolean;
  setShowApplyDialog: (show: boolean) => void;
  router: any;
  slug: string;
  applyButtonRef: React.RefObject<HTMLDivElement>;
}

export default function JobSidebar({
  job,
  user,
  hasApplied,
  isApplying,
  setShowApplyDialog,
  router,
  slug,
  applyButtonRef,
}: JobSidebarProps) {
  // Calculate progress value based on remaining days
  const deadline = job?.applicationDeadline ? new Date(job.applicationDeadline) : null;
  const publishedDate = job?.updatedAt ? new Date(job.updatedAt) : null;
  const now = new Date();
  const diffDays = deadline ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

  // Calculate progress value
  let progressValue = 0;
  if (deadline && publishedDate && diffDays !== null) {
    const totalDays = Math.ceil((deadline.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24));
    if (totalDays > 0) {
      const daysElapsed = totalDays - diffDays;
      progressValue = Math.max(0, Math.min(100, (daysElapsed / totalDays) * 100));
    }
  }

  return (
    <Card className="sticky top-24 border-2 border-blue-100/60 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 bg-white/95 backdrop-blur-xl">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <AiOutlineContainer className="h-6 w-6" />
          Tóm tắt
        </h2>

        <div className="space-y-4">
          <div className="flex items-start group">
            <Banknote className="h-5 w-5 text-emerald-500 mr-3 mt-0.5" />
            <div>
              <p className="text-md text-muted-foreground">Mức lương</p>
              <p className="font-medium mt-1.5">{formatSalary(job.salary)}</p>
            </div>
          </div>

          <div className="flex items-start group">
            <TfiBriefcase className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
            <div>
              <p className="text-md text-muted-foreground">Loại công việc</p>
              <p className="font-medium mt-1.5">{convertJobType(job.jobType)}</p>
            </div>
          </div>

          <div className="flex items-start group">
            <MapPin className="h-5 w-5 text-rose-500 mr-3 mt-[2px]" />
            <div className="flex-1">
              <p className="text-md text-muted-foreground">Địa điểm</p>
              <p className="font-medium mt-1.5">{job.location}</p>
            </div>
          </div>

          <div className="flex items-start group">
            <Clock className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
            <div>
              <p className="text-md text-muted-foreground">Kinh nghiệm</p>
              <p className="font-medium mt-1.5">{job.experience}</p>
            </div>
          </div>

          <div className="flex items-start group">
            <Calendar className="h-5 w-5 text-sky-500 mr-3 mt-0.5" />
            <div>
              <p className="text-md text-muted-foreground">Ngày đăng</p>
              <p className="font-medium mt-1.5">{formatDate(job.createdAt)}</p>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-blue-100" />

        {/* Application deadline */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <BellRing className="h-5 w-5 text-blue-600" />
            Hạn ứng tuyển: {deadline ? formatDate(job.applicationDeadline) : "Không giới hạn"}
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 font-medium">
              {diffDays && diffDays > 0 ? `${diffDays} ngày còn lại` : "Đã hết hạn ứng tuyển"}
            </p>
            <Progress value={progressValue} className="h-2 mt-2 bg-blue-200 [&>div]:bg-blue-600" />
          </div>
        </div>

        <div className="mt-4" ref={applyButtonRef}>
          {hasApplied ? (
            <Button
              className="w-full bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300"
              size="lg"
              variant="outline"
              disabled>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Đã ứng tuyển
            </Button>
          ) : (
            <>
              {user?.role === "applicant" ? (
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group relative overflow-hidden rounded-xl cursor-pointer"
                    size="lg"
                    onClick={() => setShowApplyDialog(true)}
                    disabled={isApplying}>
                    <span className="relative z-10 flex items-center justify-center gap-2 transition-transform duration-300 group-hover:translate-y-[-2px]">
                      {isApplying ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          Ứng tuyển ngay
                        </>
                      )}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-500 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {user?.role === "recruiter" ? (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" disabled={true}>
                      Ứng tuyển hiện không khả dụng
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      size="lg"
                      onClick={() => router.push(`/login?redirect=/jobs/${slug}`)}>
                      Đăng nhập để ứng tuyển
                    </Button>
                  )}
                  <p className="text-sm text-muted-foreground text-center">
                    {user ? "Chỉ ứng viên mới có thể ứng tuyển" : "Tạo tài khoản hoặc đăng nhập để ứng tuyển"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Contact recruiter */}
        <div className="mt-6 pt-6 border-t border-muted">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-600" />
            Liên hệ với nhà tuyển dụng
          </h3>

          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-blue-100 text-blue-800">HR</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Bộ phận Nhân sự</p>
              <p className="text-sm text-muted-foreground">{job.companyName}</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full hover:border-blue-300 hover:bg-blue-50/80 transition-all duration-200 group bg-transparent cursor-pointer">
            <Mail className="h-4 w-4 mr-2" />
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">Liên hệ</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
