"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  BookmarkIcon,
  Clock,
  AlertCircle,
  Plus,
  X,
  Building,
  Globe,
  Users,
  CheckCircle2,
  Upload,
  Edit,
  Save,
  Trash2,
  Calendar,
  GraduationCap,
  Star,
  ChevronRight,
  ArrowRight,
  Eye,
  Sparkles,
  Zap,
  Filter,
} from "lucide-react";
import { getProfile, getProfileById, updateProfile, uploadResume } from "@/lib/api/user";
import { getApplicantsForJobs, getMyApplications } from "@/lib/api/application";
import { getSavedJobs } from "@/lib/api/save-job";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NavigationLink } from "@/components/ui/navigation-link";
import { getMyPostedJob } from "@/lib/api/jobs";
import ApplicantCard from "@/components/ApplicantCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import ViewPDF from "@/components/ViewPDF";
import { formatCompanyAddress } from "@/helpers/formatCompanyAddress";
import { Applicant, Job } from "@/types/job";
import { getCompanyById } from "@/lib/api/company";
import { Company } from "@/types/company";
import { convertCompanyIndustry } from "@/helpers/convertCompanyIndustry";

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface ProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  bio: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  company: string;
  companyWebsite: string;
  companyDescription: string;
  industry: string;
  resumeUrl: string;
  resumeFileName: string;
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [showEditExperienceModal, setShowEditExperienceModal] = useState(false);
  const [showAddEducationModal, setShowAddEducationModal] = useState(false);
  const [showEditEducationModal, setShowEditEducationModal] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<any>(null);
  const [currentEducation, setCurrentEducation] = useState<any>(null);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    bio: "",
    skills: [],
    experience: [],
    education: [],
    company: "",
    companyWebsite: "",
    companyDescription: "",
    industry: "",
    resumeUrl: "",
    resumeFileName: "",
  });
  const [originalProfileData, setOriginalProfileData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const userProfile = useSelector((state: RootState) => state.user.userProfile);
  const userCompanyId = userProfile?.companies[0];
  const [companyData, setCompanyData] = useState<Company>();

  useEffect(() => {
    if (user) {
      getProfile(user.accessToken).then((res) => {
        setProfileData(res.data);
        calculateProfileCompleteness(res.data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && userCompanyId) {
      getCompanyById(userCompanyId).then((res) => {
        setCompanyData(res.company);
      });
    }
  }, [user, userCompanyId]);

  // Calculate profile completeness
  const calculateProfileCompleteness = (data: any) => {
    let totalFields = 0;
    let completedFields = 0;

    // Personal info fields
    const personalFields = ["name", "email", "phoneNumber", "location", "bio"];
    totalFields += personalFields.length;
    personalFields.forEach((field) => {
      if (data[field] && data[field].trim() !== "") {
        completedFields++;
      }
    });

    // Skills
    totalFields += 1; // Count skills as one field
    if (data.skills && data.skills.length > 0) {
      completedFields++;
    }

    // Experience
    totalFields += 1; // Count experience as one field
    if (data.experience && data.experience.length > 0) {
      completedFields++;
    }

    // Education
    totalFields += 1; // Count education as one field
    if (data.education && data.education.length > 0) {
      completedFields++;
    }

    // For recruiters, add company fields
    if (user?.role === "recruiter") {
      const companyFields = ["company", "companyWebsite", "companyDescription", "industry"];
      totalFields += companyFields.length;
      companyFields.forEach((field) => {
        if (data[field] && data[field].trim() !== "") {
          completedFields++;
        }
      });
    }

    const percentage = Math.round((completedFields / totalFields) * 100);
    setProfileCompleteness(percentage);
  };

  // Mock job applications data
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user) {
      getMyApplications(user.accessToken).then((res) => {
        setApplications(res.applications);
      });
    }
  }, [user]);

  // posted jobs data
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [applicantsByJob, setApplicantsByJob] = useState<{ [jobId: string]: Applicant[] }>({});
  const [applicantsCountByJob, setApplicantsCountByJob] = useState<{ [jobId: string]: number }>({});

  useEffect(() => {
    if (user) {
      getMyPostedJob(user.accessToken).then((res) => {
        setPostedJobs(res.jobs);
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchApplicantsCount = async () => {
      if (user && postedJobs?.length > 0) {
        const jobIds = postedJobs.map((job) => job._id);
        try {
          const data = await getApplicantsForJobs(user.accessToken, jobIds);
          setApplicantsCountByJob(data.applicantsCountByJob || {});
          setApplicantsByJob(data.applicantsByJob || {});
        } catch (error) {
          setApplicantsCountByJob({});
          setApplicantsByJob({});
        }
      }
    };
    fetchApplicantsCount();
  }, [user, postedJobs]);

  // saved jobs data
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    if (user) {
      getSavedJobs(user.accessToken).then((res) => {
        setSavedJobs(res.data.savedJobs);
      });
    }
  }, [user]);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle skill addition
  const [newSkill, setNewSkill] = useState("");
  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData?.skills.includes(newSkill.trim())) {
      setProfileData((prev: any) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  // Handle skill removal
  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Handle experience form input changes
  const handleExperienceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle education form input changes
  const handleEducationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle add experience
  const handleAddExperience = () => {
    // Validate required fields
    if (!newExperience.title.trim()) {
      setSaveError("Job title is required");
      return;
    }

    if (!newExperience.company.trim()) {
      setSaveError("Company name is required");
      return;
    }

    if (!newExperience.startDate.trim()) {
      setSaveError("Start date is required");
      return;
    }

    const experienceToAdd = {
      id: Date.now().toString(),
      ...newExperience,
    };

    setProfileData((prev: any) => ({
      ...prev,
      experience: [...prev.experience, experienceToAdd],
    }));

    setNewExperience({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    });

    setShowAddExperienceModal(false);
    setSaveSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleOpenAddExperienceModal = () => {
    setNewExperience({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setShowAddExperienceModal(true);
  };

  const handleOpenAddEducationModal = () => {
    setNewEducation({
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
    });
    setShowAddEducationModal(true);
  };

  // Handle edit experience
  const handleEditExperience = () => {
    // Validate required fields
    if (!newExperience.title.trim()) {
      setSaveError("Job title is required");
      return;
    }

    if (!newExperience.company.trim()) {
      setSaveError("Company name is required");
      return;
    }

    if (!newExperience.startDate.trim()) {
      setSaveError("Start date is required");
      return;
    }

    setProfileData((prev: any) => ({
      ...prev,
      experience: prev.experience.map((exp: any) =>
        exp.id === currentExperience.id ? { ...newExperience, id: currentExperience.id } : exp
      ),
    }));

    setShowEditExperienceModal(false);
    setSaveSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Handle add education
  const handleAddEducation = () => {
    // Validate required fields
    if (!newEducation.degree.trim()) {
      setSaveError("Degree is required");
      return;
    }

    if (!newEducation.institution.trim()) {
      setSaveError("Institution name is required");
      return;
    }

    if (!newEducation.startDate.trim()) {
      setSaveError("Start date is required");
      return;
    }

    const educationToAdd = {
      id: Date.now().toString(),
      ...newEducation,
    };

    setProfileData((prev: any) => ({
      ...prev,
      education: [...prev.education, educationToAdd],
    }));

    setNewEducation({
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
    });

    setShowAddEducationModal(false);
    setSaveSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Handle edit education
  const handleEditEducation = () => {
    // Validate required fields
    if (!newEducation.degree.trim()) {
      setSaveError("Degree is required");
      return;
    }

    if (!newEducation.institution.trim()) {
      setSaveError("Institution name is required");
      return;
    }

    if (!newEducation.startDate.trim()) {
      setSaveError("Start date is required");
      return;
    }

    setProfileData((prev: any) => ({
      ...prev,
      education: prev.education.map((edu: any) =>
        edu.id === currentEducation.id ? { ...newEducation, id: currentEducation.id } : edu
      ),
    }));

    setShowEditEducationModal(false);
    setSaveSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Handle delete experience
  const handleDeleteExperience = (experienceId: any) => {
    setProfileData((prev: any) => ({
      ...prev,
      experience: prev.experience.filter((exp: any) => exp._id !== experienceId),
    }));

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Handle delete education
  const handleDeleteEducation = (educationId: any) => {
    setProfileData((prev: any) => ({
      ...prev,
      education: prev.education.filter((edu: any) => edu._id !== educationId),
    }));

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Open edit experience modal
  const openEditExperienceModal = (experience: any) => {
    setCurrentExperience(experience);
    setNewExperience({
      ...experience,
    });
    setShowEditExperienceModal(true);
  };

  // Open edit education modal
  const openEditEducationModal = (education: any) => {
    setCurrentEducation(education);
    setNewEducation({
      ...education,
    });
    setShowEditEducationModal(true);
  };

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

  const handleUploadResume = async () => {
    if (!resumeFile || !user) return;

    try {
      setIsUploading(true);
      const response = await uploadResume(user.accessToken, resumeFile);

      if (response.success) {
        // Cập nhật UI ngay lập tức
        setProfileData((prev) => ({
          ...prev,
          resumeUrl: response.resumeUrl,
          resumeFileName: response.resumeFileName,
        }));
        setSaveSuccess(true);
        setResumeFile(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Reset success message sau 3 giây
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setSaveError(response.message || "Failed to upload resume. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      setSaveError("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      if (user) {
        // Make sure to include experience and education arrays in the update
        const dataToUpdate = {
          ...profileData,
          experience: profileData?.experience,
          education: profileData?.education,
        };

        const response = await updateProfile(user.accessToken, dataToUpdate);

        if (response.success) {
          setSaveSuccess(true);
          setIsEditing(false);
          calculateProfileCompleteness(profileData);

          // Reset success message after 3 seconds
          setTimeout(() => {
            setSaveSuccess(false);
          }, 3000);
        } else {
          setSaveError(response.message || "Failed to save profile. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveError("Failed to save profile. Please try again.");
    }
  };

  // If still loading, show loading spinner
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    );
  }

  // If user is not logged in, don't render anything (redirect happens in useEffect)
  if (!user) {
    return null;
  }

  // Determine if user is an applicant or recruiter
  const isApplicant = user.role === "applicant";
  const isRecruiter = user.role === "recruiter";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Hồ sơ của tôi
              </h1>
              <p className="text-muted-foreground mt-1">Quản lý thông tin cá nhân và chuyên môn của bạn</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{profileData?.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completeness */}
          <motion.div
            className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Hoàn thiện hồ sơ
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={profileCompleteness} className="w-48 h-2" />
                  <span className="text-sm font-medium">{profileCompleteness}%</span>
                </div>
              </div>
              <div>
                {profileCompleteness < 100 && (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
                      onClick={() => {
                        setIsEditing(true);
                        setActiveTab(isApplicant ? "professional" : "company");
                      }}>
                      Hoàn thiện ngay
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Success message */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}>
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">Profile updated successfully!</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {saveError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}>
                <Alert className="mb-6" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{saveError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto bg-muted/50 p-1 rounded-lg">
            <TabsTrigger
              value="personal"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Thông tin cá nhân</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>

            {isApplicant && (
              <>
                <TabsTrigger
                  value="professional"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Chuyên môn</span>
                  <span className="sm:hidden">Pro</span>
                </TabsTrigger>
                <TabsTrigger
                  value="applications"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Đơn ứng tuyển</span>
                  <span className="sm:hidden">Apps</span>
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <BookmarkIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Việc đã lưu</span>
                  <span className="sm:hidden">Saved</span>
                </TabsTrigger>
              </>
            )}

            {isRecruiter && (
              <>
                <TabsTrigger
                  value="company"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Công ty</span>
                  <span className="sm:hidden">Co.</span>
                </TabsTrigger>
                <TabsTrigger
                  value="jobs"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Việc đã đăng</span>
                  <span className="sm:hidden">Jobs</span>
                </TabsTrigger>
                <TabsTrigger
                  value="applicants"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Ứng viên</span>
                  <span className="sm:hidden">Apps</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6">
              <motion.div variants={itemVariants}>
                <Card className="border-muted/80 overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between bg-muted/10">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Thông tin cá nhân
                      </CardTitle>
                      <CardDescription>Quản lý thông tin cá nhân của bạn</CardDescription>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (isEditing) {
                            handleSaveProfile();
                          } else {
                            setOriginalProfileData({ ...profileData });
                            setIsEditing(true);
                          }
                        }}
                        className={`flex items-center gap-1 ${
                          isEditing
                            ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm"
                            : "border-primary/30 text-primary hover:bg-primary/5"
                        }`}>
                        {isEditing ? (
                          <>
                            <Save className="h-4 w-4" />
                            Lưu
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4" />
                            Chỉnh sửa hồ sơ
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          Họ tên
                        </Label>
                        {isEditing ? (
                          <motion.div
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}>
                            <Input
                              id="name"
                              name="name"
                              value={profileData?.name}
                              onChange={handleInputChange}
                              className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-2 py-2 border-b border-dashed border-muted">
                            <span>{profileData?.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          Email
                        </Label>
                        {isEditing ? (
                          <motion.div
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={profileData?.email}
                              onChange={handleInputChange}
                              className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-2 py-2 border-b border-dashed border-muted">
                            <span>{profileData?.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          Điện thoại
                        </Label>
                        {isEditing ? (
                          <motion.div
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}>
                            <Input
                              id="phoneNumber"
                              name="phoneNumber"
                              value={profileData?.phoneNumber}
                              onChange={handleInputChange}
                              className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-2 py-2 border-b border-dashed border-muted">
                            <span>{profileData?.phoneNumber || "Chưa có số điện thoại"}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          Địa chỉ
                        </Label>
                        {isEditing ? (
                          <motion.div
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}>
                            <Input
                              id="location"
                              name="location"
                              value={profileData?.location}
                              onChange={handleInputChange}
                              className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-2 py-2 border-b border-dashed border-muted">
                            <span>{profileData?.location || "Chưa có địa chỉ"}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        Tiểu sử
                      </Label>
                      {isEditing ? (
                        <motion.div
                          initial={{ y: 5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}>
                          <Textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={profileData?.bio}
                            onChange={handleInputChange}
                            className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                            placeholder="Tell us about yourself..."
                          />
                        </motion.div>
                      ) : (
                        <div className="py-2 border-b border-dashed border-muted">
                          <p>{profileData?.bio || "Chưa có tiểu sử"}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter className="flex justify-end gap-2 bg-muted/5 py-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setProfileData(originalProfileData);
                            setIsEditing(false);
                          }}
                          className="border-muted-foreground/30">
                          Huỷ
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                          Lưu
                        </Button>
                      </motion.div>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Professional Information Tab (Applicant) */}
          {isApplicant && (
            <TabsContent value="professional">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Card className="border-muted/80 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/10">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          Thông tin nghề nghiệp
                        </CardTitle>
                        <CardDescription>Quản lý kỹ năng, kinh nghiệm và giáo dục của bạn</CardDescription>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={isEditing ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (isEditing) {
                              handleSaveProfile();
                            } else {
                              setOriginalProfileData({ ...profileData });
                              setIsEditing(true);
                            }
                          }}
                          className={`flex items-center gap-1 ${
                            isEditing
                              ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm"
                              : "border-primary/30 text-primary hover:bg-primary/5"
                          }`}>
                          {isEditing ? (
                            <>
                              <Save className="h-4 w-4" />
                              Lưu
                            </>
                          ) : (
                            <>
                              <Edit className="h-4 w-4" />
                              Chỉnh sửa
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-6">
                      {/* Skills Section */}
                      <motion.div className="space-y-4" variants={itemVariants}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Star className="h-5 w-5 text-amber-500" />
                            Kỹ năng
                          </h3>
                          {isEditing && (
                            <div className="flex gap-2">
                              <Input
                                placeholder="Thêm kỹ năng"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="w-40 md:w-auto transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddSkill();
                                  }
                                }}
                              />
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleAddSkill}
                                  className="flex items-center gap-1 border-primary/30 text-primary hover:bg-primary/5 bg-transparent">
                                  <Plus className="h-4 w-4" />
                                  Thêm
                                </Button>
                              </motion.div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <AnimatePresence>
                            {profileData?.skills.map((skill, index) => (
                              <motion.div
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="inline-block"
                                layout>
                                <Badge
                                  variant="secondary"
                                  className={`flex items-center gap-1 py-1.5 px-3 ${
                                    index % 5 === 0
                                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                      : index % 5 === 1
                                      ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                      : index % 5 === 2
                                      ? "bg-purple-50 text-purple-600 hover:bg-purple-100"
                                      : index % 5 === 3
                                      ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                      : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                  }`}>
                                  {skill}
                                  {isEditing && (
                                    <motion.button
                                      onClick={() => handleRemoveSkill(skill)}
                                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}>
                                      <X className="h-3 w-3" />
                                      <span className="sr-only">Xoá {skill}</span>
                                    </motion.button>
                                  )}
                                </Badge>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          {profileData?.skills.length === 0 && !isEditing && (
                            <p className="text-sm text-muted-foreground">Chưa có kỹ năng nào được thêm.</p>
                          )}
                        </div>
                      </motion.div>

                      <Separator className="bg-muted/50" />

                      {/* Experience Section */}
                      <motion.div className="space-y-4" variants={itemVariants}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-blue-500" />
                            Kinh nghiệm
                          </h3>
                          {isEditing && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
                                onClick={handleOpenAddExperienceModal}>
                                <Plus className="h-4 w-4" />
                                Thêm kinh nghiệm
                              </Button>
                            </motion.div>
                          )}
                        </div>
                        <div className="space-y-6">
                          <AnimatePresence>
                            {profileData?.experience.map((exp: any, index) => (
                              <motion.div
                                key={exp.id || index}
                                className="p-4 rounded-lg border border-muted/80 hover:border-primary/20 hover:bg-muted/5 transition-colors duration-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                layout>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium text-primary">{exp.title}</h4>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                      <Building className="h-3.5 w-3.5" />
                                      {exp.company} • {exp.location}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {exp.startDate} - {exp.endDate || "Hiện tại"}
                                    </div>
                                  </div>
                                  {isEditing && (
                                    <div className="flex gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={() => openEditExperienceModal(exp)}
                                              className="p-1.5 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                              <Edit className="h-3.5 w-3.5" />
                                              <span className="sr-only">Chỉnh sửa</span>
                                            </motion.button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs">Chỉnh sửa kinh nghiệm</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={() => handleDeleteExperience(exp._id)}
                                              className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors">
                                              <Trash2 className="h-3.5 w-3.5" />
                                              <span className="sr-only">Delete</span>
                                            </motion.button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs">Xoá kinh nghiệm</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  )}
                                </div>
                                {exp.description && <p className="text-sm mt-3">{exp.description}</p>}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          {profileData?.experience.length === 0 && (
                            <div className="text-center py-8 border border-dashed rounded-lg">
                              <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                              <h4 className="text-sm font-medium mb-1">Chưa có kinh nghiệm làm việc nào được thêm.</h4>
                              <p className="text-sm text-muted-foreground mb-4">
                                Thêm kinh nghiệm làm việc của bạn để giới thiệu hành trình nghề nghiệp
                              </p>
                              {isEditing && (
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleOpenAddExperienceModal}
                                    className="border-primary/30 text-primary hover:bg-primary/5 bg-transparent">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Experience
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>

                      <Separator className="bg-muted/50" />

                      {/* Education Section */}
                      <motion.div className="space-y-4" variants={itemVariants}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-emerald-500" />
                            Học vấn
                          </h3>
                          {isEditing && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
                                onClick={handleOpenAddEducationModal}>
                                <Plus className="h-4 w-4" />
                                Thêm học vấn
                              </Button>
                            </motion.div>
                          )}
                        </div>
                        <div className="space-y-6">
                          <AnimatePresence>
                            {profileData?.education.map((edu: any, index) => (
                              <motion.div
                                key={edu.id || index}
                                className="p-4 rounded-lg border border-muted/80 hover:border-primary/20 hover:bg-muted/5 transition-colors duration-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                layout>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium text-primary">{edu.degree}</h4>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                      <Building className="h-3.5 w-3.5" />
                                      {edu.institution} • {edu.location}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {edu.startDate} - {edu.endDate || "Hiện tại"}
                                    </div>
                                  </div>
                                  {isEditing && (
                                    <div className="flex gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={() => openEditEducationModal(edu)}
                                              className="p-1.5 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                              <Edit className="h-3.5 w-3.5" />
                                              <span className="sr-only">Chỉnh sửa</span>
                                            </motion.button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs">Chỉnh sửa học vấn</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={() => handleDeleteEducation(edu._id)}
                                              className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors">
                                              <Trash2 className="h-3.5 w-3.5" />
                                              <span className="sr-only">Xoá</span>
                                            </motion.button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs">Xoá học vấn</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          {profileData?.education.length === 0 && (
                            <div className="text-center py-8 border border-dashed rounded-lg">
                              <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                              <h4 className="text-sm font-medium mb-1">Chưa có học vấn nào được thêm.</h4>
                              <p className="text-sm text-muted-foreground mb-4">
                                Thêm thông tin học vấn của bạn để làm nổi bật trình độ của mình
                              </p>
                              {isEditing && (
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleOpenAddEducationModal}
                                    className="border-primary/30 text-primary hover:bg-primary/5 bg-transparent">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Thêm học vấn
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>

                      <Separator className="bg-muted/50" />

                      {/* Resume Section */}
                      <motion.div className="space-y-4" variants={itemVariants}>
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <FileText className="h-5 w-5 text-purple-500" />
                          Resume/CV
                        </h3>
                        {profileData?.resumeUrl ? (
                          <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gradient-to-r from-primary/5 to-transparent">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                              <FileText className="h-8 w-8 text-green-600" />
                            </div>
                            <h4 className="font-medium mb-2">Tải lên CV của bạn</h4>
                            <p className="text-sm text-muted-foreground mb-4">{profileData.resumeFileName}</p>

                            <div className="flex gap-2">
                              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                  onClick={() => setShowModal(true)}
                                  variant="outline"
                                  className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  Xem CV
                                </Button>
                              </motion.div>
                            </div>
                            <ViewPDF
                              showModal={showModal}
                              setShowModal={setShowModal}
                              resumeUrl={profileData?.resumeUrl}
                              resumeFileName={profileData?.resumeFileName}
                            />
                          </div>
                        ) : (
                          <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gradient-to-r from-primary/5 to-transparent">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <FileText className="h-8 w-8 text-primary" />
                            </div>
                            <h4 className="font-medium mb-2">Tải lên CV của bạn</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Các định dạng được hỗ trợ: PDF, DOCX, RTF (Tối đa 5MB)
                            </p>

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileSelect}
                              className="hidden"
                            />

                            {resumeFile && (
                              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700">Đã chọn: {resumeFile.name}</p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                  onClick={() => fileInputRef.current?.click()}
                                  variant="outline"
                                  className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Chọn tệp
                                </Button>
                              </motion.div>

                              {resumeFile && (
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                  <Button
                                    onClick={handleUploadResume}
                                    disabled={isUploading}
                                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                                    <Upload className="h-4 w-4" />
                                    {isUploading ? "Đang tải lên..." : "Tải lên CV"}
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </CardContent>
                    {isEditing && (
                      <CardFooter className="flex justify-end gap-2 bg-muted/5 py-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setProfileData(originalProfileData);
                              setIsEditing(false);
                            }}
                            className="border-muted-foreground/30">
                            Huỷ
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={handleSaveProfile}
                            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                            Lưu thay đổi
                          </Button>
                        </motion.div>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          )}

          {/* Applications Tab (Applicant) */}
          {isApplicant && (
            <TabsContent value="applications">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Card className="border-muted/80 overflow-hidden">
                    <CardHeader className="bg-muted/10">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Việc làm đã ứng tuyển
                      </CardTitle>
                      <CardDescription>Theo dõi trạng thái đơn ứng tuyển của bạn</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {applications.length === 0 ? (
                        <motion.div
                          className="text-center py-12 border border-dashed rounded-lg"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}>
                          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Chưa có đơn ứng tuyển nào</h3>
                          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Bạn chưa ứng tuyển vào bất kỳ công việc nào. Hãy bắt đầu khám phá các cơ hội!
                          </p>
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                              onClick={() => router.push("/jobs")}
                              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                              <Briefcase className="h-4 w-4 mr-2" />
                              Khám phá việc làm
                            </Button>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-muted-foreground">
                              Đang hiển thị <span className="font-medium">{applications.length}</span> đơn ứng tuyển
                            </p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="text-xs h-8 bg-transparent">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Gần đây
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs h-8 bg-transparent">
                                <Filter className="h-3.5 w-3.5 mr-1" />
                                Lọc
                              </Button>
                            </div>
                          </div>

                          <AnimatePresence>
                            {applications.map((app: any, index) => (
                              <motion.div
                                key={app.id}
                                className="border rounded-lg overflow-hidden hover:border-primary/20 hover:shadow-sm transition-all duration-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}>
                                <div className="p-4">
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                      <h4 className="font-medium text-primary">{app.jobTitle}</h4>
                                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <Building className="h-3.5 w-3.5" />
                                        {app.companyName} • {app.location}
                                      </div>
                                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Đã ứng tuyển vào ngày {new Date(app.appliedDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Badge
                                        variant={
                                          app.status === "In Review"
                                            ? "outline"
                                            : app.status === "Interview Scheduled"
                                            ? "secondary"
                                            : app.status === "Rejected"
                                            ? "destructive"
                                            : "default"
                                        }
                                        className={
                                          app.status === "In Review"
                                            ? "bg-blue-50 text-blue-600 border-blue-200"
                                            : app.status === "Interview Scheduled"
                                            ? "bg-green-50 text-green-600 border-green-200"
                                            : app.status === "Rejected"
                                            ? ""
                                            : "bg-amber-50 text-amber-600 border-amber-200"
                                        }>
                                        {app.status}
                                      </Badge>
                                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="border-primary/30 text-primary hover:bg-primary/5 bg-transparent">
                                          <NavigationLink
                                            href={`/jobs/${app.jobSlug}`}
                                            className="flex items-center"
                                            prefetch={true}>
                                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                                            Xem việc làm
                                          </NavigationLink>
                                        </Button>
                                      </motion.div>
                                    </div>
                                  </div>
                                </div>
                                {app.status === "Interview Scheduled" && (
                                  <div className="bg-green-50 p-3 border-t border-green-100 flex items-center justify-between">
                                    <div className="flex items-center text-green-700 text-sm">
                                      <Calendar className="h-4 w-4 mr-2 text-green-600" />
                                      Phỏng vấn đã được lên lịch vào {new Date().toLocaleDateString()} lúc 10:00 AM
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 border-green-200 text-green-700 bg-transparent">
                                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                      Thêm vào lịch
                                    </Button>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          )}

          {/* Saved Jobs Tab (Applicant) */}
          {isApplicant && (
            <TabsContent value="saved">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Card className="border-muted/80 overflow-hidden">
                    <CardHeader className="bg-muted/10">
                      <CardTitle className="flex items-center gap-2">
                        <BookmarkIcon className="h-5 w-5 text-primary" />
                        Việc làm đã lưu
                      </CardTitle>
                      <CardDescription>Các công việc bạn đã lưu để xem sau</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {savedJobs?.length === 0 ? (
                        <motion.div
                          className="text-center py-12 border border-dashed rounded-lg"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}>
                          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                            <BookmarkIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Chưa có việc làm đã lưu</h3>
                          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Bạn chưa lưu việc làm nào. Hãy lưu việc làm để ứng tuyển sau.
                          </p>
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                              onClick={() => router.push("/jobs")}
                              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                              <Briefcase className="h-4 w-4 mr-2" />
                              Khám phá việc làm
                            </Button>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-muted-foreground">
                              Đang hiển thị <span className="font-medium">{savedJobs.length}</span> việc làm đã lưu
                            </p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="text-xs h-8 bg-transparent">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Gần đây
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs h-8 bg-transparent">
                                <Filter className="h-3.5 w-3.5 mr-1" />
                                Lọc
                              </Button>
                            </div>
                          </div>

                          <AnimatePresence>
                            {savedJobs?.map((job: any, index) => (
                              <motion.div
                                key={job.id}
                                className="border rounded-lg overflow-hidden hover:border-primary/20 hover:shadow-sm transition-all duration-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}>
                                <div className="p-4">
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                      <h4 className="font-medium text-primary">{job.title}</h4>
                                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <Building className="h-3.5 w-3.5" />
                                        {job.companyName} • {job.location}
                                      </div>
                                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Đã lưu {new Date(job.savedDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="border-primary/30 text-primary hover:bg-primary/5 bg-transparent">
                                          <NavigationLink
                                            href={`/jobs/${job.slug}`}
                                            className="flex items-center"
                                            prefetch={true}>
                                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                                            Xem việc làm
                                          </NavigationLink>
                                        </Button>
                                      </motion.div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          )}

          {/* Company Tab (Recruiter) */}
          {isRecruiter && (
            <TabsContent value="company">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Card className="border-muted/80 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/10">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="h-5 w-5 text-primary" />
                          Thông tin công ty
                        </CardTitle>
                        <CardDescription>Quản lý thông tin công ty của bạn</CardDescription>
                      </div>
                      <div className="flex gap-2 items-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <NavigationLink href={`/companies/${companyData?._id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 border-primary/30 text-primary hover:bg-primary/5 bg-transparent cursor-pointer">
                              Xem trang công ty
                            </Button>
                          </NavigationLink>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant={isEditing ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (isEditing) {
                                handleSaveProfile();
                              } else {
                                setOriginalProfileData({ ...profileData });
                                setIsEditing(true);
                              }
                            }}
                            className={`flex items-center gap-1 cursor-pointer ${
                              isEditing
                                ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm"
                                : "border-primary/30 text-primary hover:bg-primary/5"
                            }`}>
                            {isEditing ? (
                              <>
                                <Save className="h-4 w-4" />
                                Lưu thay đổi
                              </>
                            ) : (
                              <>
                                <Edit className="h-4 w-4" />
                                Chỉnh sửa
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-sm font-medium flex items-center gap-1">
                            <Building className="h-3.5 w-3.5 text-muted-foreground" />
                            Tên công ty
                          </Label>
                          {isEditing ? (
                            <motion.div
                              initial={{ y: 5, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.3 }}>
                              <Input
                                id="company"
                                name="company"
                                value={companyData?.name}
                                onChange={handleInputChange}
                                className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                            </motion.div>
                          ) : (
                            <div className="flex items-center gap-2 py-2 border-b border-dashed border-muted">
                              <span>{companyData?.name}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="companyWebsite" className="text-sm font-medium flex items-center gap-1">
                            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                            Trang web
                          </Label>
                          {isEditing ? (
                            <motion.div
                              initial={{ y: 5, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.3 }}>
                              <Input
                                id="companyWebsite"
                                name="companyWebsite"
                                value={companyData?.contact?.website}
                                onChange={handleInputChange}
                                className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                            </motion.div>
                          ) : (
                            <div className="flex items-center gap-2 py-2 border-b border-dashed border-muted">
                              <span>{companyData?.contact?.website}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="industry" className="text-sm font-medium flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                            Ngành nghề
                          </Label>
                          {isEditing ? (
                            <motion.div
                              initial={{ y: 5, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.3 }}>
                              <Input
                                id="industry"
                                name="industry"
                                value={convertCompanyIndustry(companyData?.industry as string)}
                                onChange={handleInputChange}
                                className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                            </motion.div>
                          ) : (
                            <div className="flex items-center gap-2 py-2 border-b border-dashed border-muted">
                              <span>{convertCompanyIndustry(companyData?.industry as string)}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            Địa chỉ
                          </Label>
                          {isEditing ? (
                            <motion.div
                              initial={{ y: 5, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.3 }}>
                              <Input
                                id="location"
                                name="location"
                                value={companyData?.fullAddress}
                                onChange={handleInputChange}
                                className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                            </motion.div>
                          ) : (
                            <div className="flex items-center gap-2 py-2 border-b border-dashed border-muted">
                              <span>{companyData?.fullAddress || "Không có địa chỉ"}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyDescription" className="text-sm font-medium flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          Mô tả
                        </Label>
                        {isEditing ? (
                          <motion.div
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}>
                            <Textarea
                              id="companyDescription"
                              name="companyDescription"
                              rows={4}
                              value={companyData?.description}
                              onChange={handleInputChange}
                              className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                              placeholder="Describe your company..."
                            />
                          </motion.div>
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: companyData?.description || "<p class='text-gray-500 italic'>Chưa có mô tả</p>",
                            }}
                          />
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <Building className="h-5 w-5 text-blue-500" />
                          Logo công ty
                        </h3>
                        <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gradient-to-r from-primary/5 to-transparent">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Building className="h-8 w-8 text-primary" />
                          </div>
                          <h4 className="font-medium mb-2">Tải lên logo công ty</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Kích thước đề xuất: 400x400px (Tối đa 2MB)
                          </p>
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                              <Upload className="h-4 w-4" />
                              Tải logo
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                    {isEditing && (
                      <CardFooter className="flex justify-end gap-2 bg-muted/5 py-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setProfileData(originalProfileData);
                              setIsEditing(false);
                            }}
                            className="border-muted-foreground/30">
                            Huỷ
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={handleSaveProfile}
                            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                            Lưu
                          </Button>
                        </motion.div>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          )}

          {/* Posted Jobs Tab (Recruiter) */}
          {isRecruiter && (
            <TabsContent value="jobs">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Card className="border-muted/80 overflow-hidden bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/10">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          Việc làm đã đăng
                        </CardTitle>
                        <CardDescription>Quản lý việc đã đăng của công ty</CardDescription>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => router.push("/post-job")}
                          className="flex items-center gap-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                          <Plus className="h-4 w-4" />
                          Đăng việc mới
                        </Button>
                      </motion.div>
                    </CardHeader>
                    <CardContent className="pt-6 bg-gray-100">
                      {postedJobs?.length === 0 ? (
                        <motion.div
                          className="text-center py-12 border border-dashed rounded-lg"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}>
                          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Chưa có việc làm nào được đăng</h3>
                          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Bạn chưa đăng bất kỳ việc làm nào. Hãy tạo danh sách việc làm đầu tiên của bạn!
                          </p>
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                              <NavigationLink href={`/post-job`} className="flex items-center">
                                <Plus className="h-4 w-4 mr-2" />
                                Đăng việc mới
                              </NavigationLink>
                            </Button>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          <AnimatePresence>
                            {postedJobs?.map((job: any, index) => (
                              <motion.div
                                key={job._id}
                                className=" rounded-lg overflow-hidden hover:border-primary/20 hover:shadow-sm transition-all duration-200 bg-white"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}>
                                <div className="p-4">
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-primary">{job.title}</h4>
                                        <Badge
                                          variant={job.status === "Active" ? "secondary" : "outline"}
                                          className={
                                            job.status === "Active" ? "bg-green-50 text-green-600 border-green-200" : ""
                                          }>
                                          {job.status}
                                        </Badge>
                                      </div>
                                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {formatCompanyAddress(job.location)}
                                      </div>
                                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Đăng vào ngày {new Date(job.createdAt).toLocaleDateString()}
                                      </div>
                                      <div className="text-sm font-medium mt-2 flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5 text-primary" />
                                        <span className="text-primary">{applicantsCountByJob[job._id] ?? 0}</span> ứng
                                        viên
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => router.push(`/jobs/${job.id}/applicants`)}
                                          className="border-primary/30 text-primary hover:bg-primary/5">
                                          <Users className="h-3.5 w-3.5 mr-1.5" />
                                          View Applicants
                                        </Button>
                                      </motion.div> */}
                                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => router.push(`/jobs/${job.id}/edit`)}>
                                          <Edit className="h-3.5 w-3.5 mr-1.5" />
                                          Chỉnh sửa
                                        </Button>
                                      </motion.div>
                                      {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant={job.status === "Published" ? "destructive" : "default"}
                                          size="sm"
                                          className={
                                            job.status !== "Published"
                                              ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm"
                                              : ""
                                          }>
                                          {job.status === "Published" ? (
                                            <>
                                              <X className="h-3.5 w-3.5 mr-1.5" />
                                              Đóng việc
                                            </>
                                          ) : (
                                            <>
                                              <Zap className="h-3.5 w-3.5 mr-1.5" />
                                              Mở lại việc
                                            </>
                                          )}
                                        </Button>
                                      </motion.div> */}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          )}

          {/* Applicants Tab (Recruiter) */}
          {isRecruiter && (
            <TabsContent value="applicants">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Card className="border-muted/80 overflow-hidden bg-gray-100">
                    <CardHeader className="bg-muted/10">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Ứng viên
                      </CardTitle>
                      <CardDescription>Quản lý ứng viên cho các danh sách việc làm của bạn</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <AnimatePresence>
                          {postedJobs?.map((job: any, index) => {
                            const applicants = applicantsByJob[job._id] || [];
                            return (
                              <motion.div
                                key={job._id}
                                className="border rounded-lg overflow-hidden bg-white"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}>
                                <div className="p-4 bg-muted/5 border-b border-b-gray-100">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <h4 className="font-medium text-blue-600 flex items-center gap-2">{job.title}</h4>
                                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {formatCompanyAddress(job.location)}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" />
                                        {applicants.length} ứng viên
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {applicants.length > 0 ? (
                                  <div className="p-4 space-y-4">
                                    <ApplicantCard applicants={applicants} />
                                  </div>
                                ) : (
                                  <div className="text-center py-6">
                                    <p className="text-muted-foreground">Chưa có ứng viên nào cho công việc này.</p>
                                  </div>
                                )}

                                <div className="p-4 border-t bg-muted/5">
                                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
                                      onClick={() => router.push(`/jobs/${job.slug}/applicants`)}>
                                      <Users className="h-3.5 w-3.5 mr-1.5" />
                                      Xem tất cả ứng viên
                                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                                    </Button>
                                  </motion.div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          )}
        </Tabs>

        {/* Add Experience Modal */}
        <Dialog open={showAddExperienceModal} onOpenChange={setShowAddExperienceModal}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Thêm kinh nghiệm
              </DialogTitle>
              <DialogDescription>Thêm chi tiết kinh nghiệm làm việc của bạn bên dưới.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center">
                    Vị trí <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newExperience.title}
                    onChange={handleExperienceInputChange}
                    placeholder="e.g. Software Engineer"
                    required
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center">
                    Công ty <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={newExperience.company}
                    onChange={handleExperienceInputChange}
                    placeholder="e.g. Tech Solutions Inc."
                    required
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Địa chỉ</Label>
                <Input
                  id="location"
                  name="location"
                  value={newExperience.location}
                  onChange={handleExperienceInputChange}
                  placeholder="e.g. New York, NY"
                  className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center">
                    Ngày bắt đầu <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    value={newExperience.startDate}
                    onChange={handleExperienceInputChange}
                    placeholder="e.g. Jan 2020"
                    required
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    value={newExperience.endDate}
                    onChange={handleExperienceInputChange}
                    placeholder="e.g. Present"
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={newExperience.description}
                  onChange={handleExperienceInputChange}
                  placeholder="Describe your responsibilities and achievements"
                  className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setNewExperience({
                    title: "",
                    company: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  });
                  setShowAddExperienceModal(false);
                }}
                className="border-muted-foreground/30">
                Cancel
              </Button>
              <Button
                onClick={handleAddExperience}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                Thêm kinh nghiệm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Experience Modal */}
        <Dialog open={showEditExperienceModal} onOpenChange={setShowEditExperienceModal}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Chỉnh sửa kinh nghiệm
              </DialogTitle>
              <DialogDescription>Cập nhật thông tin kinh nghiệm làm việc của bạn.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Vị trí</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={newExperience.title}
                    onChange={handleExperienceInputChange}
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Công ty</Label>
                  <Input
                    id="edit-company"
                    name="company"
                    value={newExperience.company}
                    onChange={handleExperienceInputChange}
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Địa chỉ</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={newExperience.location}
                  onChange={handleExperienceInputChange}
                  className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Ngày bắt đầu</Label>
                  <Input
                    id="edit-startDate"
                    name="startDate"
                    value={newExperience.startDate}
                    onChange={handleExperienceInputChange}
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">Ngày kết thúc</Label>
                  <Input
                    id="edit-endDate"
                    name="endDate"
                    value={newExperience.endDate}
                    onChange={handleExperienceInputChange}
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  value={newExperience.description}
                  onChange={handleExperienceInputChange}
                  className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setNewExperience({
                    title: "",
                    company: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  });
                  setShowEditExperienceModal(false);
                }}
                className="border-muted-foreground/30">
                Cancel
              </Button>
              <Button
                onClick={handleEditExperience}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Education Modal */}
        <Dialog open={showAddEducationModal} onOpenChange={setShowAddEducationModal}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Thêm học vấn
              </DialogTitle>
              <DialogDescription>Thêm thông tin học vấn của bạn bên dưới.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="degree" className="flex items-center">
                  Bằng cấp <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="degree"
                  name="degree"
                  value={newEducation.degree}
                  onChange={handleEducationInputChange}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  required
                  className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution" className="flex items-center">
                  Trường <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="institution"
                  name="institution"
                  value={newEducation.institution}
                  onChange={handleEducationInputChange}
                  placeholder="e.g. University of Technology"
                  required
                  className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-location">Địa chỉ</Label>
                <Input
                  id="edu-location"
                  name="location"
                  value={newEducation.location}
                  onChange={handleEducationInputChange}
                  placeholder="e.g. New York, NY"
                  className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edu-startDate" className="flex items-center">
                    Năm bắt đầu <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="edu-startDate"
                    name="startDate"
                    value={newEducation.startDate}
                    onChange={handleEducationInputChange}
                    placeholder="e.g. 2015"
                    required
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edu-endDate">Năm kết thúc</Label>
                  <Input
                    id="edu-endDate"
                    name="endDate"
                    value={newEducation.endDate}
                    onChange={handleEducationInputChange}
                    placeholder="e.g. 2019"
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setNewEducation({
                    degree: "",
                    institution: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                  });
                  setShowAddEducationModal(false);
                }}
                className="border-muted-foreground/30">
                Hủy
              </Button>
              <Button
                onClick={handleAddEducation}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                Thêm học vấn
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Education Modal */}
        <Dialog open={showEditEducationModal} onOpenChange={setShowEditEducationModal}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Chỉnh sửa học vấn
              </DialogTitle>
              <DialogDescription>Cập nhật thông tin học vấn của bạn.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-degree">Bằng cấp</Label>
                <Input
                  id="edit-degree"
                  name="degree"
                  value={newEducation.degree}
                  onChange={handleEducationInputChange}
                  className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-institution">Trường</Label>
                <Input
                  id="edit-institution"
                  name="institution"
                  value={newEducation.institution}
                  onChange={handleEducationInputChange}
                  className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-edu-location">Địa chỉ</Label>
                <Input
                  id="edit-edu-location"
                  name="location"
                  value={newEducation.location}
                  onChange={handleEducationInputChange}
                  className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-edu-startDate">Năm bắt đầu</Label>
                  <Input
                    id="edit-edu-startDate"
                    name="startDate"
                    value={newEducation.startDate}
                    onChange={handleEducationInputChange}
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-edu-endDate">Năm kết thúc</Label>
                  <Input
                    id="edit-edu-endDate"
                    name="endDate"
                    value={newEducation.endDate}
                    onChange={handleEducationInputChange}
                    className="transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setNewEducation({
                    degree: "",
                    institution: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                  });
                  setShowEditEducationModal(false);
                }}
                className="border-muted-foreground/30">
                Hủy
              </Button>
              <Button
                onClick={handleEditEducation}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
