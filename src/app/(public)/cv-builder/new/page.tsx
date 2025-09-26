"use client";

import { FormSidebar } from "@/components/cv-builder/form-sidebar";
import { FullPreviewModal } from "@/components/cv-builder/full-preview-modal";
import { PreviewPanel } from "@/components/cv-builder/preview-panel";
import { Button } from "@/components/ui/button";
import { CVStorage } from "@/lib/cv-storage";
import { useCVStore } from "@/lib/store/cv-store";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CVBuilderNewPage() {
  const { cvData, isDirty, resetCV, loadCV } = useCVStore();
  const [isSaving, setIsSaving] = useState(false);
  const [editingCVId, setEditingCVId] = useState<string | null>(null);

  useEffect(() => {
    const editingId = localStorage.getItem("editingCVId");
    if (editingId) {
      setEditingCVId(editingId);
      const savedCV = CVStorage.getCV(editingId);
      if (savedCV) {
        loadCV(savedCV.data);
      }
    }
  }, [loadCV]);

  const handleSaveCV = async () => {
    if (!cvData.personalInfo.fullName && !cvData.personalInfo.email) {
      alert("Vui lòng nhập ít nhất tên hoặc email để lưu CV");
      return;
    }

    setIsSaving(true);
    try {
      if (editingCVId) {
        CVStorage.updateCV(editingCVId, cvData);
        loadCV({ ...cvData });
        alert("CV đã được cập nhật thành công!");
      } else {
        const newId = CVStorage.saveCV(cvData);
        setEditingCVId(newId);
        localStorage.setItem("editingCVId", newId);
        loadCV({ ...cvData, id: newId });
        alert("CV đã được lưu thành công!");
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      alert("Có lỗi xảy ra khi lưu CV. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={"/cv-builder/my-cvs"}>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                CV của tôi
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{editingCVId ? "Chỉnh sửa CV" : "Tạo CV mới"}</h1>
              <p className="text-sm text-muted-foreground">
                Điền thông tin bên trái và xem CV cập nhật real-time bên phải
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Có thay đổi chưa lưu</span>
            )}
            <Button onClick={handleSaveCV} disabled={isSaving} variant="outline" className="gap-2 bg-transparent">
              <Save className="w-4 h-4" />
              {isSaving ? "Đang lưu..." : "Lưu CV"}
            </Button>
            <Button onClick={resetCV} disabled={isSaving} variant="outline" className="gap-2 bg-transparent">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r bg-card">
          <FormSidebar />
        </div>
        <div className="w-1/2">
          <PreviewPanel />
        </div>
      </div>

      <FullPreviewModal />
    </div>
  );
}
