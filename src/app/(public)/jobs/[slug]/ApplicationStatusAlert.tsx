"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Info } from "lucide-react";

interface ApplicationStatusAlertProps {
  applicationStatus: {
    status: "success" | "error" | "info" | null;
    message: string | null;
  };
}

export default function ApplicationStatusAlert({ applicationStatus }: ApplicationStatusAlertProps) {
  return (
    <AnimatePresence>
      {applicationStatus.status && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mb-6">
          <Alert
            className={
              applicationStatus.status === "success"
                ? "bg-green-50 border-green-200"
                : applicationStatus.status === "error"
                ? "bg-red-50 border-red-200"
                : "bg-blue-50 border-blue-200"
            }>
            {applicationStatus.status === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : applicationStatus.status === "error" ? (
              <XCircle className="h-4 w-4 text-red-600" />
            ) : (
              <Info className="h-4 w-4 text-blue-600" />
            )}
            <AlertTitle
              className={
                applicationStatus.status === "success" ? "text-green-800" : applicationStatus.status === "error" ? "text-red-800" : "text-blue-800"
              }>
              {applicationStatus.status === "success"
                ? "Đã ứng tuyển thành công"
                : applicationStatus.status === "error"
                ? "Đã xảy ra lỗi khi ứng tuyển"
                : "Thông tin"}
            </AlertTitle>
            <AlertDescription
              className={
                applicationStatus.status === "success" ? "text-green-700" : applicationStatus.status === "error" ? "text-red-700" : "text-blue-700"
              }>
              {applicationStatus.message}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
