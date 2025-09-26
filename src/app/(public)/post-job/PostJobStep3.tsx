"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertCircle,
  ClipboardCheck,
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Sparkles,
} from "lucide-react";
import type { FormData } from "./PostJobForm";
import { useEffect, useState } from "react";
import { getCompanyById } from "@/lib/api/company";

interface PostJobStep3Props {
  formData: FormData;
  error: string | null;
  isSubmitting: boolean;
  formTouched: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onPrevious: () => void;
}

export default function PostJobStep3({
  formData,
  error,
  isSubmitting,
  formTouched,
  onSubmit,
  onPrevious,
}: PostJobStep3Props) {
  const [companyName, setCompanyName] = useState("");
  const companyId = formData.company;
  const handleFormatCompanyName = async () => {
    try {
      const response = await getCompanyById(companyId);
      setCompanyName(response?.company.name);
    } catch (error) {
      console.log("Error format company name", error);
    }
  };

  useEffect(() => {
    handleFormatCompanyName();
  }, [formData.company]);

  return (
    <>
      <CardHeader className="pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-full shadow-sm">
            <ClipboardCheck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text">
              Xem lại tin tuyển dụng
            </CardTitle>
            <CardDescription className="text-base">Xem lại toàn bộ thông tin trước khi đăng</CardDescription>
          </div>
        </motion.div>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        <AnimatePresence>
          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}>
              <Alert variant="destructive" className="mb-6 border-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-semibold">Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8">
          <div className="border border-blue-100/60 rounded-xl p-6 shadow-md bg-gradient-to-r from-white to-blue-50/30 hover:shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
              {formData.title || "Job Title"}
            </h2>
            <div className="flex items-center mt-3 text-muted-foreground">
              <Building className="h-4 w-4 mr-1.5" />
              <span className="mr-6">{companyName || "Company Name"}</span>
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>{formData.location || "Location"}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              <Badge
                variant="secondary"
                className="px-3 py-1 text-sm bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-xl">
                {formData.jobType || "Job Type"}
              </Badge>
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1 text-sm border-blue-200 bg-white rounded-xl">
                  {skill}
                </Badge>
              ))}
            </div>
            {formData.applicationDeadline && (
              <div className="mt-4 flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
                <span>
                  Ứng tuyển trước ngày:{" "}
                  <span className="font-medium">{new Date(formData.applicationDeadline).toLocaleDateString()}</span>
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="space-y-2 bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border border-blue-100 shadow-sm">
              <p className="text-sm font-medium text-blue-600">Lương</p>
              <p className="text-2xl font-medium text-blue-900">${Number(formData.salary || 0).toLocaleString()}</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="space-y-2 bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border border-blue-100 shadow-sm">
              <p className="text-sm font-medium text-blue-600">Kinh nghiệm</p>
              <p className="text-2xl font-medium text-blue-900">{formData.experience || "Not specified"}</p>
            </motion.div>
          </div>

          {formData.benefits.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                Phúc lợi
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}>
                    <div className="bg-white border border-blue-100 rounded-xl p-3 text-sm flex items-center gap-2 shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {benefit}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-medium text-lg flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Mô tả công việc
            </h3>
            <div
              className="border border-blue-100/60 rounded-xl p-6 bg-white shadow-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: formData.description || "<p class='text-gray-500 italic'>No description provided.</p>",
              }}
            />
          </div>
        </motion.div>
      </CardContent>

      <CardFooter className="flex justify-between pt-4 pb-6 px-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2 h-11 px-5 hover:bg-muted/50 transition-all duration-200 rounded-xl border-blue-100/60 hover:border-blue-300 bg-transparent cursor-pointer">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={onSubmit}
                className={`h-11 px-6 rounded-xl ${
                  isSubmitting
                    ? "bg-muted cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30"
                } transition-all duration-300 relative overflow-hidden group cursor-pointer`}>
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Đang đăng...
                    </>
                  ) : (
                    <>
                      Đăng việc
                      <CheckCircle2 className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                    </>
                  )}
                </span>
                {!isSubmitting && (
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    animate={{ opacity: formTouched ? 0 : 0 }}
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Post your job listing</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </>
  );
}
