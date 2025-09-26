"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface FloatingApplyButtonProps {
  isVisible: boolean;
  hasApplied: boolean;
  user: any;
  setShowApplyDialog: (show: boolean) => void;
}

export default function FloatingApplyButton({
  isVisible,
  hasApplied,
  user,
  setShowApplyDialog,
}: FloatingApplyButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && !hasApplied && user?.role === "applicant" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowApplyDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group relative overflow-hidden rounded-xl"
            size="lg">
            <span className="relative z-10 flex items-center justify-center gap-2 transition-transform duration-300 group-hover:translate-y-[-2px]">
              <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              Ứng tuyển ngay
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-500 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
