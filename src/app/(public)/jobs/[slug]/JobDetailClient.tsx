"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { formatSalary, formatDate, applyForJob, checkAppliedJob } from "@/lib/api/jobs";
import { getSavedJobs, saveUnsaveJob } from "@/lib/api/save-job";
import JobHeader from "./JobHeader";
import JobSidebar from "./JobSidebar";
import JobContent from "./JobContent";
import JobApplicationDialog from "./JobApplicationDialog";
import JobShareDialog from "./JobShareDialog";
import SimilarJobs from "./SimilarJobs";
import FloatingApplyButton from "./FloatingApplyButton";
import ApplicationStatusAlert from "./ApplicationStatusAlert";
import { getCompanyById } from "@/lib/api/company";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Job } from "@/types/job";

interface JobDetailClientProps {
  job: Job;
  slug: string;
}

export default function JobDetailClient({ job: initialJob, slug }: JobDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [job, setJob] = useState<Job>(initialJob);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<{
    status: "success" | "error" | "info" | null;
    message: string | null;
  }>({ status: null, message: null });
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("description");
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const applyButtonRef = useRef<HTMLDivElement | null>(null);
  const userProfile = useSelector((state: RootState) => state.user.userProfile);

  // Track scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;
      const totalScrollable = docHeight - winHeight;
      const progress = Math.min(scrollY / totalScrollable, 1);
      setScrollProgress(progress * 100);

      // Show/hide floating apply button
      if (scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user?.accessToken) return;

      try {
        const response = await getSavedJobs(user.accessToken);
        if (response.data.success) {
          const savedJobIds = response.data.savedJobs.map((savedJob: any) => savedJob.jobId);
          setSavedJobs(savedJobIds);
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, [user]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Vui lòng chọn file PDF, DOC hoặc DOCX");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File không được vượt quá 5MB");
      return;
    }
    setResumeFile(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
  };

  const handleApply = async () => {
    setApplicationStatus({ status: null, message: null });

    if (!user) {
      router.push(`/login?redirect=/jobs/${slug}`);
      return;
    }

    if (user.role !== "applicant") {
      setApplicationStatus({
        status: "info",
        message: "Only applicants can apply for jobs. Please create an applicant account to apply.",
      });
      return;
    }

    if (showApplyDialog) {
      setShowApplyDialog(false);
    }

    // ✅ Validate dữ liệu
    if (!coverLetter && !resumeFile && !userProfile?.resumeUrl) {
      alert("Please provide a cover letter and select or upload a resume.");
      return;
    }

    setIsApplying(true);
    try {
      const response = await applyForJob({
        slug,
        accessToken: user.accessToken,
        coverLetter,
        file: resumeFile || undefined,
        resumeUrl: !resumeFile ? userProfile?.resumeUrl : undefined,
        userName: userProfile?.name as string,
        userEmail: userProfile?.email as string,
        userPhoneNumber: userProfile?.phoneNumber as string,
      });

      console.log("userProfile", userProfile);

      if (response.success) {
        setHasApplied(true);
        setApplicationStatus({
          status: "success",
          message: "Your application has been submitted successfully!",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setApplicationStatus({
          status: "error",
          message: response.message || "Failed to apply for this job. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to apply for job:", error);
      setApplicationStatus({
        status: "error",
        message: "An error occurred while submitting your application. Please try again.",
      });
    } finally {
      setIsApplying(false);
      setCoverLetter("");
      setResumeFile(null);
    }
  };

  // Handle save/unsave job
  const handleSaveToggle = async (jobId: string) => {
    if (!user?.accessToken) {
      router.push(`/login?redirect=/jobs/${slug}`);
      return;
    }

    setIsSaving((prev) => ({ ...prev, [jobId]: true }));

    try {
      const response = await saveUnsaveJob(jobId, user.accessToken);

      if (response.data.success) {
        if (response.data.isSaved) {
          // Job was saved
          setSavedJobs((prev) => [...prev, jobId]);
        } else {
          // Job was unsaved
          setSavedJobs((prev) => prev.filter((id) => id !== jobId));
        }
      }
    } catch (error) {
      console.error("Error toggling job save status:", error);
    } finally {
      setIsSaving((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.company}`,
        url: window.location.href,
      });
    } else {
      // Open share dialog for browsers that don't support Web Share API
      setShowShareDialog(true);
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Check if user has already applied
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  useEffect(() => {
    const checkIfApplied = async () => {
      if (!user || !job) {
        setHasApplied(false);
        return;
      }
      const result = await checkAppliedJob(job.slug, user.accessToken);
      setHasApplied(!!result.applied);
    };

    checkIfApplied();
  }, [user, job.slug]);

  const isJobSaved = job && savedJobs.includes(job._id);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/5 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="border-2 border-blue-100/60 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 bg-white/95 backdrop-blur-xl rounded-lg">
              <div className="p-6 md:p-8">
                {/* Application status alerts */}
                <ApplicationStatusAlert applicationStatus={applicationStatus} />

                {/* Job header */}
                <JobHeader
                  job={job}
                  companyName={job.companyName}
                  companyAddress={job.location}
                  isJobSaved={isJobSaved}
                  isSaving={isSaving}
                  handleShare={handleShare}
                  handleSaveToggle={handleSaveToggle}
                />

                {/* Job content tabs */}
                <JobContent job={job} companyName={job.companyName} activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants}>
            <JobSidebar
              job={job}
              user={user}
              hasApplied={!!hasApplied}
              isApplying={isApplying}
              setShowApplyDialog={setShowApplyDialog}
              router={router}
              slug={slug}
              applyButtonRef={applyButtonRef as React.RefObject<HTMLDivElement>}
            />
          </motion.div>
        </motion.div>

        {/* Similar jobs section */}
        <SimilarJobs job={job} fadeInVariants={fadeInVariants} />
      </div>

      {/* Floating apply button */}
      <FloatingApplyButton
        isVisible={isVisible}
        hasApplied={!!hasApplied}
        user={user}
        setShowApplyDialog={setShowApplyDialog}
      />

      {/* Quick Apply Dialog */}
      <JobApplicationDialog
        showApplyDialog={showApplyDialog}
        setShowApplyDialog={setShowApplyDialog}
        job={job}
        coverLetter={coverLetter}
        setCoverLetter={setCoverLetter}
        resumeFile={resumeFile}
        resumeUrl={userProfile?.resumeUrl}
        handleFileSelect={handleFileSelect}
        handleRemoveFile={handleRemoveFile}
        handleApply={handleApply}
        isApplying={isApplying}
      />

      {/* Share Dialog */}
      <JobShareDialog
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        copyToClipboard={copyToClipboard}
        copySuccess={copySuccess}
      />
    </>
  );
}
