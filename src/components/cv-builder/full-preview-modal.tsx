"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TemplateRenderer } from "./cv-templates/template-renderer";
import { useCVStore } from "@/lib/store/cv-store";
import { X, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function FullPreviewModal() {
  const { cvData, selectedTemplate, isPreviewMode, setPreviewMode } = useCVStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (!cvData.personalInfo.fullName && !cvData.personalInfo.email) {
      toast.error("Vui lòng nhập ít nhất tên hoặc email trước khi tải PDF");
      return;
    }

    setIsGeneratingPDF(true);
    toast.loading("Đang tạo file PDF...", { id: "pdf-generation-modal" });

    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = document.getElementById("cv-full-preview");
      if (!element) {
        throw new Error("Không tìm thấy element preview");
      }

      const canvas = await html2canvas(element, {
        scale: 3,
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
      toast.success("Tạo PDF thành công!", { id: "pdf-generation-modal" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại.", { id: "pdf-generation-modal" });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Dialog open={isPreviewMode} onOpenChange={setPreviewMode}>
      <DialogContent className="sm:max-w-[1000px] h-[95vh] flex flex-col">
        <DialogTitle className="hidden"></DialogTitle>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h2 className="text-xl font-semibold">CV Preview</h2>
              <p className="text-sm text-muted-foreground">
                Template: {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF} size="sm" className="gap-2">
                {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isGeneratingPDF ? "Đang tạo..." : "Tải PDF"}
              </Button>
              {/* <Button variant="outline" size="sm" onClick={() => setPreviewMode(false)}>
                <X className="w-4 h-4" />
              </Button> */}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="mx-auto bg-white rounded-lg shadow-lg">
              <div id="cv-full-preview">
                <TemplateRenderer data={cvData} template={selectedTemplate} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
