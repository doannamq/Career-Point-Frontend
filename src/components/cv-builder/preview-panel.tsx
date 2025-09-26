"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TemplateRenderer } from "./cv-templates/template-renderer";
import { useCVStore } from "@/lib/store/cv-store";
import { Download, Maximize2, Loader2, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PreviewPanel() {
  const { cvData, selectedTemplate, setPreviewMode } = useCVStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const hasBasicInfo = cvData.personalInfo?.fullName || cvData.personalInfo?.email;
  const hasContent = hasBasicInfo || cvData?.experiences?.length > 0 || cvData?.education?.length > 0;

  const handleDownloadPDF = async () => {
    if (!hasBasicInfo) {
      toast.error("Vui lòng nhập ít nhất tên hoặc email trước khi tải PDF");
      return;
    }

    setIsGeneratingPDF(true);
    toast.loading("Đang tạo file PDF...", { id: "pdf-generation" });

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas-pro")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = document.getElementById("cv-preview");
      if (!element) {
        throw new Error("Không tìm thấy element preview");
      }

      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = cvData.personalInfo.fullName
        ? `${cvData.personalInfo.fullName.replace(/\s+/g, "_")}_CV_${selectedTemplate}.pdf`
        : `CV_${selectedTemplate}.pdf`;

      pdf.save(fileName);
      toast.success("Tải PDF thành công!", { id: "pdf-generation" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại.", { id: "pdf-generation" });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleFullPreview = () => {
    setPreviewMode(true);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Xem trước CV</h3>
            <p className="text-sm text-muted-foreground">
              Template: {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleFullPreview} className="gap-2 bg-transparent">
              <Maximize2 className="w-4 h-4" />
              Xem toàn màn hình
            </Button>
            <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF || !hasBasicInfo} size="sm" className="gap-2">
              {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isGeneratingPDF ? "Đang tạo..." : "Tải PDF"}
            </Button>
          </div>
        </div>
      </div>

      {!hasContent && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Bắt đầu điền thông tin để xem CV của bạn
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                CV sẽ cập nhật real-time khi bạn nhập thông tin ở bên trái
              </p>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div>
            <div id="cv-preview">
              <TemplateRenderer data={cvData} template={selectedTemplate} className="w-full" />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
