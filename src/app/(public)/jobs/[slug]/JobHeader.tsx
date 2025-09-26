"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Building, MapPin, Share2, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { formatCompanyAddress } from "@/helpers/formatCompanyAddress";
import { convertJobType } from "@/helpers/converJobType";
import { Job } from "@/types/job";

interface JobHeaderProps {
  job: Job;
  companyName: string;
  companyAddress: string;
  isJobSaved: boolean;
  isSaving: Record<string, boolean>;
  handleShare: () => void;
  handleSaveToggle: (jobId: string) => void;
}

export default function JobHeader({
  job,
  companyName,
  companyAddress,
  isJobSaved,
  isSaving,
  handleShare,
  handleSaveToggle,
}: JobHeaderProps) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <>
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-700 leading-tight mb-3">{job.title}</h1>
            <div className="flex items-center mt-3 text-slate-600">
              <div className="flex items-center bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 rounded-full border border-emerald-200/60 mr-6">
                <Building className="h-4 w-4 mr-2 text-emerald-600" />
                <span className="font-medium hover:text-emerald-700 transition-colors duration-200">
                  <Link href={`/companies/${job.company.toLowerCase().replace(/\s+/g, "-")}`}>{companyName}</Link>
                </span>
              </div>
              <div className="flex items-center bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-1.5 rounded-full border border-rose-200/60">
                <MapPin className="h-4 w-4 mr-2 text-rose-600" />
                <span className="font-medium">{formatCompanyAddress(companyAddress)}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex gap-3 ml-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-2 hover:border-amber-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 group rounded-xl px-4 py-2.5 bg-white border-2 border-amber-200/60 shadow-sm hover:shadow-md cursor-pointer">
                    <Share2 className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium text-amber-700 group-hover:translate-x-0.5 transition-transform duration-200">
                      Chia sẻ
                    </span>
                  </Button>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveToggle(job._id)}
                    className={`flex items-center gap-2 transition-all duration-300 group rounded-xl px-4 py-2.5 cursor-pointer shadow-sm hover:shadow-md border-2 ${
                      isJobSaved
                        ? "border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100"
                        : "border-purple-200/60 bg-white hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50"
                    }`}
                    disabled={isSaving[job._id]}>
                    {isSaving[job._id] ? (
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                    ) : isJobSaved ? (
                      <BookmarkCheck className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                    ) : (
                      <Bookmark className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                    )}
                    <span className="font-medium text-purple-700 group-hover:translate-x-0.5 transition-transform duration-200">
                      {isJobSaved ? "Đã lưu" : "Lưu"}
                    </span>
                  </Button>
                </TooltipTrigger>
                {/* <TooltipContent>
                  <p>{isJobSaved ? "Remove from saved jobs" : "Save this job for later"}</p>
                </TooltipContent> */}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 hover:from-blue-200 hover:to-cyan-200 transition-all duration-200 rounded-xl px-4 py-2 font-medium border border-blue-200/60 shadow-sm">
            {convertJobType(job.jobType)}
          </Badge>
          {job.skills.map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-xl px-3 py-1.5 border-slate-300/60 text-slate-700 font-medium shadow-sm hover:shadow-md hover:border-slate-400/60">
              {skill}
            </Badge>
          ))}
        </div>
      </motion.div>

      <div className="relative my-8">
        <Separator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent"></div>
      </div>

      {/* Mobile action buttons */}
      <motion.div variants={itemVariants} className="flex gap-3 mt-8 md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 hover:border-amber-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 group rounded-xl px-4 py-2.5 bg-white border-2 border-amber-200/60">
          <Share2 className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium text-amber-700 group-hover:translate-x-0.5 transition-transform duration-200">
            Chia sẻ
          </span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSaveToggle(job._id)}
          className={`flex-1 flex items-center justify-center gap-2 transition-all duration-300 group rounded-xl px-4 py-2.5 border-2 ${
            isJobSaved
              ? "border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100"
              : "border-purple-200/60 bg-white hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50"
          }`}
          disabled={isSaving[job._id]}>
          {isSaving[job._id] ? (
            <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
          ) : isJobSaved ? (
            <BookmarkCheck className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
          ) : (
            <Bookmark className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
          )}
          <span className="font-medium text-purple-700 group-hover:translate-x-0.5 transition-transform duration-200">
            {isJobSaved ? "Đã lưu" : "Lưu"}
          </span>
        </Button>
      </motion.div>
    </>
  );
}
