import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ViewPDFProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  resumeUrl: string;
  resumeFileName: string;
}

const ViewPDF = ({ showModal, setShowModal, resumeUrl, resumeFileName }: ViewPDFProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleDownload = async () => {
    const response = await fetch(resumeUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = resumeFileName || "resume.pdf"; // tên file khi tải về
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[1000px] h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Resume Preview</DialogTitle>
          <DialogClose />
          <DialogDescription>Xem và tải xuống hồ sơ ứng viên.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <Document file={resumeUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={1.3}
              />
            ))}
          </Document>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button autoFocus className="cursor-pointer" onClick={handleDownload}>
            Download CV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPDF;
