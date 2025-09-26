"use client";

import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Upload, Loader2, FileText, X, RefreshCw } from "lucide-react";

export type Job = {
  _id: string;
  title: string;
  companyName: string;
};

interface JobApplicationDialogProps {
  showApplyDialog: boolean;
  setShowApplyDialog: (show: boolean) => void;
  job: Job;
  coverLetter: string;
  setCoverLetter: (letter: string) => void;
  resumeFile: File | null;
  resumeUrl?: string; // ✅ có thể undefined
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  handleApply: () => void;
  isApplying: boolean;
}

export default function JobApplicationDialog({
  showApplyDialog,
  setShowApplyDialog,
  job,
  coverLetter,
  setCoverLetter,
  resumeFile,
  resumeUrl,
  handleFileSelect,
  handleRemoveFile,
  handleApply,
  isApplying,
}: JobApplicationDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-blue-600" /> Ứng tuyển vị trí {job.title}
          </DialogTitle>
          <DialogDescription>
            Hoàn thành việc ứng tuyển vị trí <span className="font-semibold text-blue-400">{job.title}</span> tại{" "}
            <span className="font-semibold text-green-400">{job.companyName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="cover-letter">Thư ứng tuyển (Tuỳ chọn)</Label>
            <Textarea
              id="cover-letter"
              placeholder="Hãy cho nhà tuyển dụng biết lý do vì sao bạn phù hợp với vị trí này..."
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="resize-none focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
            />
          </div>

          {/* Resume Section */}
          <div className="space-y-2">
            <Label>CV / Sơ yếu lý lịch</Label>

            {resumeFile ? (
              // ✅ Hiển thị khi user chọn upload file mới
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{resumeFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : resumeUrl ? (
              // ✅ Hiển thị CV có sẵn trong profile
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-sm truncate max-w-[200px]">
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline">
                        Xem CV của bạn
                      </a>
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer">
                  <RefreshCw className="h-4 w-4" /> Chọn CV khác
                </Button>
              </div>
            ) : (
              // ✅ Khi chưa có CV trong profile
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200"
                onClick={() => fileInputRef.current?.click()}>
                <Upload className="mx-auto h-5 w-5 text-blue-600 mb-2" />
                <p className="text-sm text-muted-foreground">Tải lên CV của bạn (PDF/DOC/DOCX)</p>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setShowApplyDialog(false)}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-200 cursor-pointer">
            Huỷ
          </Button>
          <Button
            onClick={handleApply}
            disabled={isApplying}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg shadow-blue-500/25 transition-all duration-300 group relative overflow-hidden rounded-xl">
            <span className="relative z-10 flex items-center justify-center gap-2 transition-transform duration-300 group-hover:translate-x-1 cursor-pointer">
              {isApplying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  Gửi đơn ứng tuyển
                </>
              )}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-500 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
