"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { createJob } from "@/lib/api/jobs";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import StepIndicators from "./StepIndicators";
import PostJobStep1 from "./PostJobStep1";
import PostJobStep2 from "./PostJobStep2";
import PostJobStep3 from "./PostJobStep3";
import { getCompanyForPostingJob } from "@/lib/api/company";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export type FormData = {
  title: string;
  description: string;
  company: string;
  companyName: string;
  location: string;
  salary: string;
  experience: string;
  skills: string[];
  jobType: string;
  benefits: string[];
  applicationDeadline: string;
};

export default function PostJobForm() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ message: string; slug: string } | null>(null);
  const [formTouched, setFormTouched] = useState(false);
  const [companyDefault, setCompanyDefault] = useState<string>("");
  const [locationDefault, setLocationDefault] = useState<string>("");
  const userProfile = useSelector((state: RootState) => state.user.userProfile);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    company: "",
    companyName: companyDefault,
    location: "",
    salary: "",
    experience: "",
    skills: [],
    jobType: "",
    benefits: [],
    applicationDeadline: "",
  });

  const companyId = (userProfile as any)?.companies[0];
  // console.log(companyId);
  useEffect(() => {
    if (!authLoading && user && user.role !== "recruiter") {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchCompanyForPostingJob = async () => {
      if (user?.role === "recruiter" && companyId) {
        try {
          const response = await getCompanyForPostingJob(companyId, user?.accessToken);
          if (response?.success) {
            const companyName = response?.companyName || "";
            setCompanyDefault(companyName);

            let addressString = "";
            const address = response?.companyAddress;
            if (address) {
              const addressParts = [address?.street, address?.ward, address?.district, address?.city].filter(Boolean);
              addressString = addressParts.join(", ");
              setLocationDefault(addressString);
            }

            setFormData((prev) => ({
              ...prev,
              company: companyId,
              companyName: companyName,
              location: prev.location || addressString,
            }));
          }
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      }
    };

    fetchCompanyForPostingJob();
  }, [user, companyId]);

  // Validate step 1
  const validateStep1 = () => {
    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.salary ||
      !formData.experience ||
      formData.skills.length === 0 ||
      !formData.jobType
    ) {
      setError("Hãy điền đầy đủ thông tin");
      return false;
    }

    // if (isNaN(Number(formData.salary))) {
    //   setError("Salary must be a valid number");
    //   return false;
    // }

    if (new Date(formData.applicationDeadline) < new Date()) {
      setError("Application deadline must be in the future");
      return false;
    }

    if (formData.title.length < 5) {
      setError("Job title must be at least 5 characters");
      return false;
    }

    setError(null);
    return true;
  };

  // Validate step 2
  const validateStep2 = () => {
    const plainTextDescription = formData.description.replace(/<[^>]*>/g, "").trim();
    if (!plainTextDescription || plainTextDescription.length > 2000) {
      setError("Mô tả không vượt quá 2000 ký tự");
      return false;
    }

    setError(null);
    return true;
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (!user || !user.accessToken) {
        throw new Error("You must be logged in to post a job");
      }

      const jobData = {
        ...formData,
        salary: Number(formData.salary),
      };

      const response = await createJob(jobData, user.accessToken);
      if (!response.success) {
        throw new Error(response.message);
      }

      setSuccess({
        message: "Job posted successfully!",
        slug: response.newJob.slug,
      });

      // Reset form and go back to step 1
      setFormData({
        title: "",
        description: "",
        company: companyId,
        companyName: companyDefault,
        location: locationDefault,
        salary: "",
        experience: "",
        skills: [],
        jobType: "",
        benefits: [],
        applicationDeadline: "",
      });
      setCurrentStep(1);
      setFormTouched(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still checking auth state, show loading
  if (authLoading) {
    return (
      <div className="container mx-auto py-16 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!user || user.role !== "recruiter" || !companyId) {
    let message =
      "Chỉ tài khoản nhà tuyển dụng mới có thể đăng tin tuyển dụng. Vui lòng đăng nhập bằng tài khoản nhà tuyển dụng.";
    let buttonText = "Đăng nhập";
    let buttonAction = () => router.push("/login");

    if (user && user.role === "recruiter" && !companyId) {
      message = "Chỉ có thể đăng tin khi bạn đã tham gia công ty. Hãy tham gia hoặc tạo công ty trước.";
      buttonText = "Tham gia công ty";
      buttonAction = () => router.push("/companies");
    }

    return (
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg border-blue-100 bg-white/95 backdrop-blur-xl">
            <div className="p-10 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}>
                <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-6" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-500 text-transparent bg-clip-text pb-1">
                Không có quyền truy cập
              </h1>
              <p className="text-muted-foreground text-lg mb-8">{message}</p>
              <Button
                size="lg"
                onClick={buttonAction}
                className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer">
                {buttonText}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text pb-1">
          Đăng tuyển dụng mới
        </h1>
        <p className="text-center text-muted-foreground mb-8">Điền thông tin bên dưới để đăng tuyển dụng mới</p>
      </motion.div>

      <div className="mx-auto">
        {/* <StepIndicators currentStep={currentStep} /> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="shadow-lg border-blue-100/60 overflow-hidden bg-white/95 backdrop-blur-xl">
            {/* <div className="h-1.5 bg-gradient-to-r from-blue-600 to-green-500"></div> */}

            <form onSubmit={(e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}>
                    <PostJobStep1
                      formData={formData}
                      setFormData={setFormData}
                      setFormTouched={setFormTouched}
                      error={error}
                      success={success}
                      setSuccess={setSuccess}
                      onNext={handleNextStep}
                      onCancel={() => router.back()}
                      companyDefault={companyDefault}
                      locationDefault={locationDefault}
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}>
                    <PostJobStep2
                      formData={formData}
                      setFormData={setFormData}
                      setFormTouched={setFormTouched}
                      error={error}
                      onNext={handleNextStep}
                      onPrevious={handlePreviousStep}
                    />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}>
                    <PostJobStep3
                      formData={formData}
                      error={error}
                      isSubmitting={isSubmitting}
                      formTouched={formTouched}
                      onSubmit={handleSubmit}
                      onPrevious={handlePreviousStep}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
