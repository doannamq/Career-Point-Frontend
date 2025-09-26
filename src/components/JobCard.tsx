"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth-context";
import {
  Bookmark,
  BookmarkCheck,
  Clock,
  MapPin,
  Building2,
  CheckCircle,
  Banknote,
  Crown,
  Star,
  Flame,
} from "lucide-react";
import { TfiBriefcase } from "react-icons/tfi";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { NavigationLink } from "@/components/ui/navigation-link";
import { formatSalary, getTimeAgo } from "@/lib/api/jobs";
import { useState } from "react";
import { formatCompanyAddress } from "@/helpers/formatCompanyAddress";
import { convertJobType } from "@/helpers/converJobType";
import type { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  isApplied: boolean;
  applicantCount: number;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void | Promise<void>;
}

const JobCard: React.FC<JobCardProps> = ({ job, isApplied, applicantCount, isSaved, onToggleSave }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.accessToken) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      await onToggleSave(job.jobId);
    } catch (err) {
      console.error("Toggle save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType.toLowerCase()) {
      case "full-time":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "part-time":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "contract":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "internship":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "remote":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSkillColor = (index: number) => {
    const colors = [
      "bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100",
      "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
      "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100",
      "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
      "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100",
    ];
    return colors[index % colors.length];
  };

  const getCardStyling = () => {
    if (job.isFeatured) {
      return "border-2 border-gradient-to-r bg-gradient-to-br from-amber-50/50 to-orange-50/30 shadow-lg";
    } else if (job.isHot) {
      return "border-2 border-gradient-to-r bg-gradient-to-br from-red-50/50 to-pink-50/30 shadow-lg";
    }
    return "border-muted/80";
  };

  const getTitleStyling = () => {
    if (job.isFeatured) {
      return "text-amber-900";
    } else if (job.isHot) {
      return "text-red-900";
    }
    return "";
  };

  const getButtonStyling = () => {
    if (job.isFeatured) {
      return "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md";
    } else if (job.isHot) {
      return "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md";
    }
    return "bg-gradient-to-r from-primary to-primary/90 hover:from-emerald-500 hover:to-teal-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}>
      <Card
        key={job.jobId}
        className={`w-full transition-all duration-300 group overflow-hidden relative ${getCardStyling()}
        ${isHovered ? "shadow-lg border-primary/20" : "hover:shadow-md"}`}>
        {job.isFeatured && (
          <div className="absolute top-0 right-0 z-10">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Nổi bật
            </div>
          </div>
        )}
        {!job.isFeatured && job.isHot && (
          <div className="absolute top-0 right-0 z-10">
            <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1">
              <Flame className="h-3 w-3" />
              Hot
            </div>
          </div>
        )}
        <CardContent className="p-0">
          <NavigationLink href={`/jobs/${job.slug}`} className="block" prefetch={true}>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left content */}
                <div className="space-y-3 flex-1">
                  {/* Title + Save */}
                  <div className="flex items-start justify-between">
                    <motion.h3
                      className={`font-semibold text-lg group-hover:text-primary transition-colors flex items-center gap-2 ${getTitleStyling()}`}
                      whileHover={{ x: 3 }}>
                      {job.isFeatured && <Star className="h-5 w-5 text-amber-500 fill-amber-500" />}
                      {!job.isFeatured && job.isHot && <Flame className="h-5 w-5 text-red-500 fill-red-500" />}
                      {job.title}
                    </motion.h3>

                    {/* Save button (desktop) */}
                    <div className="hidden md:block">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              whileHover={{ scale: 1.1 }}
                              className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer ${
                                isSaved ? "bg-green-100 hover:bg-green-200" : "hover:bg-slate-100"
                              }`}
                              onClick={handleSaveClick}
                              disabled={loading}>
                              {isSaved ? (
                                <BookmarkCheck className="h-4 w-4 text-green-600" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                              <span className="sr-only">{isSaved ? "Unsave job" : "Save job"}</span>
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="bg-slate-900 text-white">
                            <p>{isSaved ? "Bỏ lưu" : "Lưu"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Job info */}
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
                    <motion.div className="flex items-center hover:text-primary">
                      <Building2 className="mr-1.5 h-4 w-4 text-slate-500" />
                      {job.companyName}
                    </motion.div>
                    <motion.div className="flex items-center hover:text-primary">
                      <MapPin className="mr-1.5 h-4 w-4 text-rose-500" />
                      {formatCompanyAddress(job.location)}
                    </motion.div>
                    <motion.div className="flex items-center hover:text-primary">
                      <Banknote className="mr-1.5 h-4 w-4 text-emerald-500" />
                      {formatSalary(job.salary)}
                    </motion.div>
                    <motion.div className="flex items-center hover:text-primary">
                      <Clock className="mr-1.5 h-4 w-4 text-blue-500" />
                      {getTimeAgo(job.createdAt)}
                    </motion.div>
                    {/* {job.experienceLevel && (
                      <motion.div className="flex items-center hover:text-primary" whileHover={{ scale: 1.05, x: 2 }}>
                        {getExperienceIcon()}
                        <span className="ml-1.5">{job.experienceLevel}</span>
                      </motion.div>
                    )} */}
                  </div>

                  {/* Description */}
                  <p className="text-sm line-clamp-2 group-hover:line-clamp-3 transition-all duration-300">
                    {job.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="secondary" className={`rounded-full ${getJobTypeColor(job.jobType)}`}>
                      <TfiBriefcase className="h-3 w-3 mr-1" />
                      {convertJobType(job.jobType)}
                    </Badge>

                    {job.skills.slice(0, 3).map((skill, index) => (
                      <motion.div key={index} whileHover={{ scale: 1.05 }}>
                        <Badge variant="outline" className={`rounded-full ${getSkillColor(index)}`}>
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}

                    {job.skills.length > 3 && (
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="outline" className="rounded-full bg-slate-50 hover:bg-slate-100">
                          +{job.skills.length - 3}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Right buttons */}
                <div className="flex md:flex-col gap-2 md:min-w-[120px] md:items-end">
                  {isApplied ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="w-full bg-green-50 text-green-700 border-green-200"
                      onClick={(e) => e.preventDefault()}>
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      Đã ứng tuyển
                    </Button>
                  ) : (
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                      <Button
                        size="sm"
                        className={`w-full cursor-pointer ${getButtonStyling()}`}
                        onClick={(e) => e.preventDefault()}>
                        Ứng tuyển ngay
                        <svg
                          className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"></path>{" "}
                        </svg>
                      </Button>
                    </motion.div>
                  )}

                  {/* Save button (mobile) */}
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 md:w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 md:w-full md:hidden ${
                        isSaved ? "bg-green-50 text-green-700 border-green-200" : "hover:bg-slate-50"
                      }`}
                      onClick={handleSaveClick}
                      disabled={loading}>
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-2 text-green-600" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </NavigationLink>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobCard;
