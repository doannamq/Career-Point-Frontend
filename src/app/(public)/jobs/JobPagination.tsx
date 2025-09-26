"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export default function JobPagination({ currentPage, totalPages, handlePageChange }: JobPaginationProps) {
  return (
    <motion.div
      className="flex items-center justify-center space-x-2 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 px-3 cursor-pointer">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Trước
      </Button>

      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            // Show first page, last page, current page, and pages around current page
            return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
          })
          .map((page, i, array) => {
            // Add ellipsis where needed
            if (i > 0 && array[i - 1] !== page - 1) {
              return (
                <React.Fragment key={`ellipsis-${page}`}>
                  <span className="px-2 text-muted-foreground">...</span>
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="h-9 w-9 cursor-pointer">
                    {page}
                  </Button>
                </React.Fragment>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="h-9 w-9 cursor-pointer">
                {page}
              </Button>
            );
          })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 px-3 cursor-pointer">
        Sau
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </motion.div>
  );
}
