"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { CVData } from "@/types/cv";

export default function CVPreviewPage() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("cvData");
    if (savedData) {
      setCvData(JSON.parse(savedData));
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (!cvData) return;

    setIsGeneratingPDF(true);

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas-pro")).default;
      const jsPDF = (await import("jspdf")).jsPDF;

      const element = document.getElementById("cv-content");
      if (!element) {
        throw new Error("CV content not found");
      }

      // Generate canvas from HTML
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a3");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Download PDF
      const fileName = `CV_${cvData.personalInfo.fullName.replace(/\s+/g, "_") || "CV"}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!cvData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Không tìm thấy dữ liệu CV</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Vui lòng quay lại trang tạo CV để nhập thông tin.</p>
          <Link href="/cv-builder">
            <Button>Tạo CV mới</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/cv-builder">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại chỉnh sửa
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Xem trước CV</h1>
          </div>
          <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="flex items-center gap-2">
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tạo PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Tải PDF
              </>
            )}
          </Button>
        </div>

        {/* CV Preview */}
        <div className="max-w-4xl mx-auto">
          <div id="cv-content" className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
              <h1 className="text-4xl font-bold mb-2">{cvData.personalInfo.fullName}</h1>
              <div className="flex flex-wrap gap-6 text-blue-100">
                {cvData.personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✉</span>
                    <span>{cvData.personalInfo.email}</span>
                  </div>
                )}
                {cvData.personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">☎</span>
                    <span>{cvData.personalInfo.phone}</span>
                  </div>
                )}
                {cvData.personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⌂</span>
                    <span>{cvData.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Summary */}
              {cvData.personalInfo.summary && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
                    Giới thiệu bản thân
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{cvData.personalInfo.summary}</p>
                </section>
              )}

              {/* Experience */}
              {cvData.experiences.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
                    Kinh nghiệm làm việc
                  </h2>
                  <div className="space-y-6">
                    {cvData.experiences.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-blue-600 pl-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">{exp.jobTitle}</h3>
                          <span className="text-blue-600 font-medium">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </span>
                        </div>
                        <h4 className="text-lg text-gray-600 mb-3 font-medium">{exp.company}</h4>
                        {exp.description && (
                          <div className="text-gray-700 leading-relaxed">
                            {exp.description.split("\n").map((line, index) => (
                              <p key={index} className="mb-2">
                                {line}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {cvData.education.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Học vấn</h2>
                  <div className="space-y-6">
                    {cvData.education.map((edu) => (
                      <div key={edu.id} className="border-l-4 border-green-600 pl-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
                          <span className="text-green-600 font-medium">
                            {edu.startDate} - {edu.endDate || "Present"}
                          </span>
                        </div>
                        <h4 className="text-lg text-gray-600 mb-3 font-medium">{edu.institution}</h4>
                        {edu.description && (
                          <div className="text-gray-700 leading-relaxed">
                            {edu.description.split("\n").map((line, index) => (
                              <p key={index} className="mb-2">
                                {line}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {cvData.skills.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Kỹ năng</h2>
                  <div className="flex flex-wrap gap-3">
                    {cvData.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
