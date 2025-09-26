"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText, ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import type { FormData } from "./PostJobForm";

interface PostJobStep2Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setFormTouched: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  onNext: () => void;
  onPrevious: () => void;
}

export default function PostJobStep2({ formData, setFormData, setFormTouched, error, onNext, onPrevious }: PostJobStep2Props) {
  const [showTips, setShowTips] = useState(true);

  return (
    <>
      <CardHeader className="pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-full shadow-sm">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text">Mô tả công việc</CardTitle>
            <CardDescription className="text-base">Mô tả chi tiết công việc</CardDescription>
          </div>
        </motion.div>
      </CardHeader>

      <CardContent className="space-y-7 pt-6">
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
                <AlertTitle className="font-semibold">
                  Lỗi
                  <input type="button" value="" />
                </AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="description" className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Mô tả <span className="text-red-500">*</span>
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowTips(!showTips)}
              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200">
              {showTips ? "Hide Tips" : "Show Tips"}
            </Button>
          </div>

          <RichTextEditor
            content={formData.description}
            onChange={(content: string) => {
              setFormData((prev) => ({ ...prev, description: content }));
              setFormTouched(true);
            }}
            placeholder="Describe the job responsibilities, requirements, and benefits..."
            className="transition-all duration-300 border-blue-100/60 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200"
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span>Nhập thông tin chi tiết về công việc: nhiệm vụ, yêu cầu và phúc lợi.</span>
            <span className={`${formData.description.replace(/<[^>]*>/g, "").length > 2000 ? "text-red-500" : "text-green-600"}`}>
              {formData.description.replace(/<[^>]*>/g, "").length} ký tự
            </span>
          </div>
        </motion.div>

        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-5 rounded-xl mt-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium text-base text-blue-700">Gợi ý để mô tả công việc ấn tượng:</h3>
                </div>
                <ul className="text-sm space-y-2 list-disc pl-5 text-blue-900/80">
                  <li>Bắt đầu với tổng quan ngắn gọn về vị trí và công ty của bạn</li>
                  <li>Liệt kê các trách nhiệm chính và công việc hàng ngày</li>
                  <li>Trình bày các bằng cấp và kinh nghiệm yêu cầu</li>
                  <li>Đề cập các kỹ năng hoặc bằng cấp ưu tiên</li>
                  <li>Bổ sung thông tin về văn hóa công ty và quyền lợi</li>
                  <li>Rõ ràng về quy trình nộp hồ sơ và thời gian xử lý</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="flex justify-between pt-4 pb-6 px-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2 h-11 px-5 hover:bg-muted/50 transition-all duration-200 rounded-xl border-blue-100/60 hover:border-blue-300 bg-transparent cursor-pointer">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer">
          Tiếp theo <ArrowRight className="h-4 w-4 animate-pulse-slow" />
        </Button>
      </CardFooter>
    </>
  );
}
