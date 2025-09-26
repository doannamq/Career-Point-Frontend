"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  X,
  Plus,
  Building2,
  MapPin,
  Phone,
  Globe,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  ClipboardCheck,
  Users,
  Calendar,
  Sparkles,
  Mail,
  Hash,
  Briefcase,
  Award,
  ImageIcon,
  Facebook,
  Linkedin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createCompany } from "@/lib/api/company";
import { useAuth } from "@/context/auth-context";
import { fetchProvinces, fetchDistricts, fetchWards } from "@/lib/api/jobs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import RichTextEditor from "@/components/RichTextEditor";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { convertCompanySize } from "@/helpers/convertCompanySize";
import { convertCompanyIndustry } from "@/helpers/convertCompanyIndustry";
import { convertCompanyType } from "@/helpers/convertCompanyType";

const companyFormSchema = z.object({
  // Basic Information
  name: z.string().min(1, "Tên công ty là bắt buộc").max(200, "Tên công ty không được vượt quá 200 ký tự"),
  businessCode: z.string().optional(),
  taxCode: z.string().optional(),
  industry: z.enum(
    [
      "Information Technology",
      "Software Development",
      "E-commerce",
      "Digital Marketing",
      "Finance & Banking",
      "Healthcare",
      "Education & Training",
      "Manufacturing",
      "Retail & Consumer Goods",
      "Construction & Real Estate",
      "Transportation & Logistics",
      "Food & Beverage",
      "Tourism & Hospitality",
      "Media & Entertainment",
      "Consulting",
      "Government & Public Sector",
      "Non-profit",
      "Other",
    ],
    { required_error: "Ngành nghề là bắt buộc" }
  ),
  companySize: z.enum(
    [
      "1-10 employees",
      "11-50 employees",
      "51-200 employees",
      "201-500 employees",
      "501-1000 employees",
      "1000+ employees",
    ],
    {
      required_error: "Quy mô công ty là bắt buộc",
    }
  ),
  companyType: z
    .enum([
      "Limited Liability Company",
      "Joint Stock Company",
      "Sole Proprietorship",
      "100% Foreign-Owned Company",
      "Joint Venture",
      "Representative Office",
      "Branch",
      "Other",
    ])
    .default("Limited Liability Company"),
  description: z.string().max(2000, "Mô tả không được vượt quá 2000 ký tự").optional(),
  foundedYear: z.number().min(1900).max(new Date().getFullYear()).optional(),

  // Address
  address: z.object({
    street: z.string().min(1, "Địa chỉ đường là bắt buộc"),
    ward: z.string().min(1, "Phường/Xã là bắt buộc"),
    district: z.string().min(1, "Quận/Huyện là bắt buộc"),
    city: z.string().min(1, "Tỉnh/Thành phố là bắt buộc"),
    // country: z.string().default("Vietnam"),
  }),

  // Contact
  contact: z.object({
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(1, "Số điện thoại là bắt buộc"),
    website: z.string().url("Website phải là URL hợp lệ").optional().or(z.literal("")),
  }),

  // Media
  logo: z.string().url("Logo phải là URL hợp lệ").optional().or(z.literal("")),
  coverImage: z.string().url("Cover image phải là URL hợp lệ").optional().or(z.literal("")),

  // Social Media
  socialMedia: z
    .object({
      facebook: z.string().optional(),
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      instagram: z.string().optional(),
    })
    .optional(),

  // Additional Info
  workingHours: z.string().optional(),

  // Recruitment Contact
  recruitmentContact: z
    .object({
      name: z.string().optional(),
      email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
      phone: z.string().optional(),
    })
    .optional(),
});

export type CompanyFormData = z.infer<typeof companyFormSchema>;

type Province = {
  id: string;
  name: string;
  type: number;
  typeText: string;
  slug: string;
};

type District = {
  id: string;
  name: string;
  provinceId: string;
  type: number;
  typeText: string;
};

type Ward = {
  id: string;
  name: string;
  districtId: string;
  type: number;
  typeText: string;
};

export default function NewCompanyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ message: string; slug: string } | null>(null);
  const [formTouched, setFormTouched] = useState(false);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");
  const [newTag, setNewTag] = useState("");

  //states cho địa chỉ
  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [wardList, setWardList] = useState<Ward[]>([]);
  const [provinceLoading, setProvinceLoading] = useState(false);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [wardLoading, setWardLoading] = useState(false);
  const [provincePopoverOpen, setProvincePopoverOpen] = useState(false);
  const [districtPopoverOpen, setDistrictPopoverOpen] = useState(false);
  const [wardPopoverOpen, setWardPopoverOpen] = useState(false);
  const [provinceQuery, setProvinceQuery] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");
  const [wardQuery, setWardQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema) as any,
    defaultValues: {
      companyType: "Limited Liability Company",
      address: {
        // country: "Vietnam",
      },
      socialMedia: {},
      recruitmentContact: {},
    },
  });

  // Fetch provinces
  useEffect(() => {
    if (provincePopoverOpen) {
      setProvinceLoading(true);
      fetchProvinces(provinceQuery).then((res) => {
        setProvinceList(res.data || []);
        setProvinceLoading(false);
      });
    }
  }, [provincePopoverOpen, provinceQuery]);

  // Fetch districts
  useEffect(() => {
    if (districtPopoverOpen && selectedProvince) {
      setDistrictLoading(true);
      fetchDistricts(selectedProvince.id, districtQuery).then((res) => {
        setDistrictList(res.data || []);
        setDistrictLoading(false);
      });
    }
  }, [districtPopoverOpen, selectedProvince, districtQuery]);

  // Fetch wards
  useEffect(() => {
    if (wardPopoverOpen && selectedDistrict) {
      setWardLoading(true);
      fetchWards(selectedDistrict.id, wardQuery).then((res) => {
        setWardList(res.data || []);
        setWardLoading(false);
      });
    }
  }, [wardPopoverOpen, selectedDistrict, wardQuery]);

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setIsSubmitting(true);

      // Add benefits and tags to form data
      const formData = {
        ...data,
        benefits,
        tags,
        logo: data?.logo || "",
        coverImage: data?.coverImage || "",
      };

      const response = await createCompany(formData, user?.accessToken as string);

      setSuccess({
        message: "Công ty đã được tạo thành công!",
        slug: "new-company-slug",
      });

      // Reset form
      form.reset();
      setBenefits([]);
      setTags([]);
      setCurrentStep(1);
      setFormTouched(false);

      // Reset địa chỉ
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setProvinceQuery("");
      setDistrictQuery("");
      setWardQuery("");
      setProvinceList([]);
      setDistrictList([]);
      setWardList([]);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error creating company:", error);
      setError("Có lỗi xảy ra khi tạo công ty");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
      setFormTouched(true);
    }
  };

  const removeBenefit = (benefit: string) => {
    setBenefits(benefits.filter((b) => b !== benefit));
    setFormTouched(true);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag("");
      setFormTouched(true);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
    setFormTouched(true);
  };

  // Common benefits options
  const commonBenefits = [
    { name: "Bảo hiểm y tế", icon: <Users className="h-4 w-4" /> },
    { name: "Làm việc từ xa", icon: <Globe className="h-4 w-4" /> },
    { name: "Giờ làm việc linh hoạt", icon: <Calendar className="h-4 w-4" /> },
    { name: "Nghỉ phép có lương", icon: <Calendar className="h-4 w-4" /> },
    { name: "Đào tạo chuyên môn", icon: <Award className="h-4 w-4" /> },
    { name: "Thưởng hiệu suất", icon: <Sparkles className="h-4 w-4" /> },
  ];

  // Validate step 1
  const validateStep1 = () => {
    const values = form.getValues();
    if (!values.name || !values.industry || !values.companySize) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return false;
    }
    setError(null);
    return true;
  };

  // Validate step 2
  const validateStep2 = () => {
    const values = form.getValues();
    if (!values.address?.street || !values.address?.ward || !values.address?.district || !values.address?.city) {
      setError("Vui lòng điền đầy đủ địa chỉ");
      return false;
    }
    if (!values.contact?.email || !values.contact?.phone) {
      setError("Vui lòng điền đầy đủ thông tin liên hệ");
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

  // Render step indicators
  const renderStepIndicators = () => {
    const steps = [
      { number: 1, title: "Basic Information" },
      { number: 2, title: "Address & Contact" },
      { number: 3, title: "Confirm" },
    ];

    return (
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{
                  scale: currentStep >= step.number ? 1 : 0.9,
                  opacity: currentStep >= step.number ? 1 : 0.8,
                }}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center`}>
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-full 
                    ${
                      currentStep >= step.number
                        ? "bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-md shadow-blue-200/50"
                        : "bg-muted text-muted-foreground"
                    } transition-all duration-300`}>
                  {currentStep > step.number ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <span className="text-lg font-medium">{step.number}</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    currentStep >= step.number ? "text-blue-600" : "text-muted-foreground"
                  }`}>
                  {step.title}
                </span>
              </motion.div>

              {index < steps.length - 1 && (
                <div
                  className={`w-20 h-1 mx-1 rounded-full transition-all duration-500 ${
                    currentStep > step.number ? "bg-gradient-to-r from-blue-600 to-green-500" : "bg-muted"
                  }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!user || user.role !== "recruiter") {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg border-blue-100 bg-white/95 backdrop-blur-xl">
            <CardContent className="p-10 text-center">
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
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
                Access Denied
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                You must be logged in as a recruiter to create company. Please log in with a recruiter account.
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/login")}
                className="px-8 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 transition-all duration-300 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
                Log In
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Render step 1 - Basic Information
  const renderStep1 = () => {
    return (
      <>
        <CardHeader className="pb-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-full shadow-sm">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              {/* <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text"> */}
              <CardTitle className="text-2xl text-blue-600">Thông tin công ty</CardTitle>
              <CardDescription className="text-base">Nhập thông tin cơ bản của công ty</CardDescription>
            </div>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-7 pt-6">
          <AnimatePresence>
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}>
                <Alert variant="destructive" className="mb-6 border-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-semibold">Lỗi</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Success Dialog */}
            <Dialog open={!!success} onOpenChange={() => setSuccess(null)}>
              <DialogContent className="max-w-lg bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-gray-800 text-lg font-semibold">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    Đăng ký công ty thành công
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-gray-600 text-sm leading-relaxed">
                    Công ty của bạn đã được đăng ký thành công. Thông tin sẽ được{" "}
                    <span className="font-medium">kiểm duyệt và phê duyệt trong vòng 24 giờ</span>. Sau khi phê duyệt,
                    bạn có thể quản lý thông tin công ty và đăng tin tuyển dụng.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSuccess(null)}
                    className="text-gray-700 border-gray-300 hover:bg-gray-50">
                    Đóng
                  </Button>
                  {/* <Button
                    onClick={() => router.push("/companies")}
                    className="bg-green-600 text-white hover:bg-green-700">
                    Xem danh sách công ty
                  </Button> */}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-2.5">
            <Label htmlFor="name" className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              Tên công ty <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nhập tên công ty"
              {...form.register("name")}
              className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
            />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-2.5">
              <Label htmlFor="businessCode" className="text-base flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-500" />
                Mã số doanh nghiệp
              </Label>
              <Input
                id="businessCode"
                placeholder="Nhập mã số doanh nghiệp"
                {...form.register("businessCode")}
                className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-2.5">
              <Label htmlFor="taxCode" className="text-base flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-500" />
                Mã số thuế
              </Label>
              <Input
                id="taxCode"
                placeholder="Nhập mã số thuế"
                {...form.register("taxCode")}
                className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="space-y-2.5">
              <Label className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" />
                Ngành nghề <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => form.setValue("industry", value as any)}>
                <SelectTrigger className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl">
                  <SelectValue placeholder="Chọn nghành nghề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Information Technology">Công nghệ thông tin</SelectItem>
                  <SelectItem value="Software Development">Phát triển phần mềm</SelectItem>
                  <SelectItem value="E-commerce">Thương mại điện tử</SelectItem>
                  <SelectItem value="Digital Marketing">Marketing số</SelectItem>
                  <SelectItem value="Finance & Banking">Tài chính & Ngân hàng</SelectItem>
                  <SelectItem value="Healthcare">Y tế</SelectItem>
                  <SelectItem value="Education & Training">Giáo dục & Đào tạo</SelectItem>
                  <SelectItem value="Manufacturing">Sản xuất</SelectItem>
                  <SelectItem value="Other">Khác</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.industry && (
                <p className="text-sm text-red-500">{form.formState.errors.industry.message}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="space-y-2.5">
              <Label className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Quy mô công ty <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => form.setValue("companySize", value as any)}>
                <SelectTrigger className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl">
                  <SelectValue placeholder="Chọn quy mô" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10 employees">1-10 nhân viên</SelectItem>
                  <SelectItem value="11-50 employees">11-50 nhân viên</SelectItem>
                  <SelectItem value="51-200 employees">51-200 nhân viên</SelectItem>
                  <SelectItem value="201-500 employees">201-500 nhân viên</SelectItem>
                  <SelectItem value="501-1000 employees">501-1000 nhân viên</SelectItem>
                  <SelectItem value="1000+ employees">1000+ nhân viên</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.companySize && (
                <p className="text-sm text-red-500">{form.formState.errors.companySize.message}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="space-y-2.5">
              <Label className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                Loại hình công ty
              </Label>
              <Select
                onValueChange={(value) => form.setValue("companyType", value as any)}
                defaultValue="Limited Liability Company">
                <SelectTrigger className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Limited Liability Company">Công ty TNHH</SelectItem>
                  <SelectItem value="Joint Stock Company">Công ty Cổ phần</SelectItem>
                  <SelectItem value="Sole Proprietorship">Doanh nghiệp tư nhân</SelectItem>
                  <SelectItem value="100% Foreign-Owned Company">Công ty 100% vốn nước ngoài</SelectItem>
                  <SelectItem value="Joint Venture">Công ty liên doanh</SelectItem>
                  <SelectItem value="Representative Office">Văn phòng đại diện</SelectItem>
                  <SelectItem value="Branch">Chi nhánh</SelectItem>
                  <SelectItem value="Other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="space-y-2.5">
              <Label htmlFor="foundedYear" className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Năm thành lập
              </Label>
              <Input
                id="foundedYear"
                type="number"
                placeholder="2025"
                {...form.register("foundedYear", { valueAsNumber: true })}
                className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="space-y-2.5">
              <Label htmlFor="workingHours" className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Thời gian làm việc
              </Label>
              <Input
                id="workingHours"
                placeholder="e.g., 8:00 AM - 5:00 PM, Thứ 2 - Thứ 6"
                {...form.register("workingHours")}
                className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="space-y-2.5">
            <Label htmlFor="description" className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Mô tả
            </Label>
            <RichTextEditor
              content={form.watch("description") || ""}
              onChange={(value) => form.setValue("description", value)}
              placeholder="Describe your company, mission, and vision..."
              className="min-h-[200px]"
            />
            <p className="text-sm text-muted-foreground">Tối đa 2000 ký tự</p>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between pt-4 pb-6 px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-11 px-5 hover:bg-red-50 transition-all duration-200 rounded-xl border-red-100/60 hover:border-red-300 cursor-pointer">
            Huỷ
          </Button>
          <Button
            type="button"
            onClick={handleNextStep}
            className="flex items-center gap-2 h-11 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer">
            Tiếp theo <ArrowRight className="h-4 w-4 animate-pulse-slow" />
          </Button>
        </CardFooter>
      </>
    );
  };

  // Render step 2 - Address & Contact
  const renderStep2 = () => {
    return (
      <>
        <CardHeader className="pb-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-full shadow-sm">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text">
                Địa chỉ & Liên hệ
              </CardTitle>
              <CardDescription className="text-base">Thông tin địa chỉ và liên hệ của công ty</CardDescription>
            </div>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-7 pt-6">
          <AnimatePresence>
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}>
                <Alert variant="destructive" className="mb-6 border-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-semibold">Lỗi</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Address Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Địa chỉ công ty
            </h3>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-2.5">
              <Label htmlFor="street" className="text-base">
                Địa chỉ đường <span className="text-red-500">*</span>
              </Label>
              <Input
                id="street"
                placeholder="Số nhà, tên đường"
                {...form.register("address.street")}
                className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
              />
              {form.formState.errors.address?.street && (
                <p className="text-sm text-red-500">{form.formState.errors.address.street.message}</p>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Province Popover */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="space-y-2.5">
                <Label className="text-base">
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </Label>
                <Popover open={provincePopoverOpen} onOpenChange={setProvincePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-12 w-full justify-start bg-transparent" type="button">
                      {selectedProvince ? selectedProvince.name : "Chọn Tỉnh/Thành phố"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Tìm tỉnh/thành phố..."
                        value={provinceQuery}
                        onValueChange={setProvinceQuery}
                      />
                      <CommandList>
                        <CommandEmpty>{provinceLoading ? "Đang tải..." : "Không tìm thấy"}</CommandEmpty>
                        <CommandGroup heading="Tỉnh/Thành phố">
                          {provinceList.map((prov) => (
                            <CommandItem
                              key={prov.id}
                              value={prov.name}
                              onSelect={() => {
                                setSelectedProvince(prov);
                                setProvincePopoverOpen(false);
                                setSelectedDistrict(null);
                                setSelectedWard(null);
                                form.setValue("address.city", prov.name);
                                form.setValue("address.district", "");
                                form.setValue("address.ward", "");
                              }}
                              className="flex items-center gap-2 cursor-pointer">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {prov.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {form.formState.errors.address?.city && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.city.message}</p>
                )}
              </motion.div>

              {/* District Popover */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="space-y-2.5">
                <Label className="text-base">
                  Quận/Huyện <span className="text-red-500">*</span>
                </Label>
                <Popover open={districtPopoverOpen} onOpenChange={setDistrictPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start bg-transparent"
                      type="button"
                      disabled={!selectedProvince}>
                      {selectedDistrict ? selectedDistrict.name : "Chọn Quận/Huyện"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Tìm quận/huyện..."
                        value={districtQuery}
                        onValueChange={setDistrictQuery}
                        disabled={!selectedProvince}
                      />
                      <CommandList>
                        <CommandEmpty>{districtLoading ? "Đang tải..." : "Không tìm thấy"}</CommandEmpty>
                        <CommandGroup heading="Quận/Huyện">
                          {districtList.map((dist) => (
                            <CommandItem
                              key={dist.id}
                              value={dist.name}
                              onSelect={() => {
                                setSelectedDistrict(dist);
                                setDistrictPopoverOpen(false);
                                setSelectedWard(null);
                                form.setValue("address.district", dist.name);
                                form.setValue("address.ward", "");
                              }}
                              className="flex items-center gap-2 cursor-pointer">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {dist.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {form.formState.errors.address?.district && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.district.message}</p>
                )}
              </motion.div>

              {/* Ward Popover */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-2.5">
                <Label className="text-base">
                  Phường/Xã <span className="text-red-500">*</span>
                </Label>
                <Popover open={wardPopoverOpen} onOpenChange={setWardPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start bg-transparent"
                      type="button"
                      disabled={!selectedDistrict}>
                      {selectedWard ? selectedWard.name : "Chọn Phường/Xã"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Tìm phường/xã..."
                        value={wardQuery}
                        onValueChange={setWardQuery}
                        disabled={!selectedDistrict}
                      />
                      <CommandList>
                        <CommandEmpty>{wardLoading ? "Đang tải..." : "Không tìm thấy"}</CommandEmpty>
                        <CommandGroup heading="Phường/Xã">
                          {wardList.map((ward) => (
                            <CommandItem
                              key={ward.id}
                              value={ward.name}
                              onSelect={() => {
                                setSelectedWard(ward);
                                setWardPopoverOpen(false);
                                form.setValue("address.ward", ward.name);
                              }}
                              className="flex items-center gap-2 cursor-pointer">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {ward.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {form.formState.errors.address?.ward && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.ward.message}</p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-500" />
              Thông tin liên hệ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="space-y-2.5">
                <Label htmlFor="email" className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@company.com"
                  {...form.register("contact.email")}
                  className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
                />
                {form.formState.errors.contact?.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.contact.email.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="space-y-2.5">
                <Label htmlFor="phone" className="text-base flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-500" />
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="0123456789"
                  {...form.register("contact.phone")}
                  className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
                />
                {form.formState.errors.contact?.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.contact.phone.message}</p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="space-y-2.5">
              <Label htmlFor="website" className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                Website
              </Label>
              <Input
                id="website"
                placeholder="https://company.com"
                {...form.register("contact.website")}
                className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
              />
            </motion.div>
          </div>

          {/* Media Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-500" />
              Hình ảnh & Media
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="space-y-2.5">
                <Label htmlFor="logo" className="text-base">
                  Logo công ty
                </Label>
                <Input
                  id="logo"
                  placeholder="https://example.com/logo.png"
                  {...form.register("logo")}
                  className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
                />
                <p className="text-sm text-muted-foreground">URL của logo công ty</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                className="space-y-2.5">
                <Label htmlFor="coverImage" className="text-base">
                  Ảnh bìa
                </Label>
                <Input
                  id="coverImage"
                  placeholder="https://example.com/cover.jpg"
                  {...form.register("coverImage")}
                  className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
                />
                <p className="text-sm text-muted-foreground">URL của ảnh bìa công ty</p>
              </motion.div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Mạng xã hội</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
                className="space-y-2.5">
                <Label htmlFor="facebook" className="text-base flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-500" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/company"
                  {...form.register("socialMedia.facebook")}
                  className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                className="space-y-2.5">
                <Label htmlFor="linkedin" className="text-base flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-500" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/company/company"
                  {...form.register("socialMedia.linkedin")}
                  className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
                />
              </motion.div>
            </div>
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 }}
            className="space-y-4 pt-2">
            <Label className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Phúc lợi
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập phúc lợi..."
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
              />
              <Button
                type="button"
                onClick={addBenefit}
                className="h-12 px-5 bg-green-200/30 hover:bg-green-100 text-black  cursor-pointer">
                <Plus className="h-5 w-5 mr-2" /> Thêm
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonBenefits.map((benefit) => (
                <div key={benefit.name} className="flex">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (benefits.includes(benefit.name)) {
                        removeBenefit(benefit.name);
                      } else {
                        setBenefits([...benefits, benefit.name]);
                        setFormTouched(true);
                      }
                    }}
                    className={`flex items-center justify-start gap-2 h-auto py-2 px-3 w-full text-sm transition-all duration-200 rounded-xl ${
                      benefits.includes(benefit.name)
                        ? "bg-gradient-to-r from-blue-100 to-green-100 border-blue-300 text-blue-700"
                        : "hover:border-blue-300 hover:bg-blue-50/50"
                    }`}>
                    <div className={`${benefits.includes(benefit.name) ? "text-blue-600" : "text-muted-foreground"}`}>
                      {benefit.icon}
                    </div>
                    {benefit.name}
                  </Button>
                </div>
              ))}
            </div>

            {benefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-100 to-green-100 hover:from-blue-200 hover:to-green-200 transition-all duration-300 border border-blue-200 rounded-xl">
                      {benefit}
                      <button
                        type="button"
                        onClick={() => removeBenefit(benefit)}
                        className="ml-1 rounded-full hover:bg-blue-200/50 p-0.5 transition-colors duration-200">
                        <X className="h-3.5 w-3.5" />
                        <span className="sr-only">Remove {benefit}</span>
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Tags Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.3 }}
            className="space-y-4">
            <Label className="text-base flex items-center gap-2">
              <Hash className="h-4 w-4 text-blue-500" />
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
              />
              <Button
                type="button"
                onClick={addTag}
                className="h-12 px-5 bg-green-200/30 hover:bg-green-100 text-black  cursor-pointer">
                <Plus className="h-5 w-5 mr-2" /> Thêm
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border-blue-200 rounded-xl">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full hover:bg-blue-200/50 p-0.5 transition-colors duration-200">
                      <X className="w-3 h-3 cursor-pointer" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between pt-4 pb-6 px-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviousStep}
            className="flex items-center gap-2 h-11 px-5 hover:bg-muted/50 transition-all duration-200 rounded-xl border-blue-100/60 hover:border-blue-300 bg-transparent cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>
          <Button
            type="button"
            onClick={handleNextStep}
            className="flex items-center gap-2 h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer">
            Tiếp theo <ArrowRight className="h-4 w-4 animate-pulse-slow" />
          </Button>
        </CardFooter>
      </>
    );
  };

  // Render step 3 - Review
  const renderStep3 = () => {
    const values = form.getValues();
    console.log("Form Values:", values);

    return (
      <>
        <CardHeader className="pb-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-full shadow-sm">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text">
                Xác nhận thông tin
              </CardTitle>
              <CardDescription className="text-base">Kiểm tra lại thông tin trước khi tạo công ty</CardDescription>
            </div>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <AnimatePresence>
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}>
                <Alert variant="destructive" className="mb-6 border-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-semibold">Lỗi</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8">
            <div className="border border-blue-100/60 rounded-xl p-6 shadow-md bg-gradient-to-r from-white to-blue-50/30 hover:shadow-lg transition-all duration-300">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
                {values.name || "Tên công ty"}
              </h2>
              <div className="flex items-center mt-3 text-muted-foreground">
                <Building2 className="h-4 w-4 mr-1.5" />
                <span className="mr-6">{convertCompanyIndustry(values.industry) || "Ngành nghề"}</span>
                <Users className="h-4 w-4 mr-1.5" />
                <span>{convertCompanySize(values.companySize) || "Quy mô"}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-sm bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-xl">
                  {convertCompanyType(values.companyType) || "Loại hình"}
                </Badge>
                {values.foundedYear && (
                  <Badge variant="outline" className="px-3 py-1 text-sm border-blue-200 bg-white rounded-xl">
                    Thành lập {values.foundedYear}
                  </Badge>
                )}
              </div>

              {values.address && (
                <div className="mt-4 flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1.5 text-blue-500" />
                  <span>
                    {values.address.street}, {values.address.ward}, {values.address.district}, {values.address.city}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="space-y-2 bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                <p className="text-sm font-medium text-blue-600">Email liên hệ</p>
                <p className="text-lg font-medium text-blue-900">{values.contact?.email || "Chưa có"}</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="space-y-2 bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                <p className="text-sm font-medium text-blue-600">Số điện thoại</p>
                <p className="text-lg font-medium text-blue-900">{values.contact?.phone || "Chưa có"}</p>
              </motion.div>
            </div>

            {values.workingHours && (
              <div className="space-y-3">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Thời gian làm việc
                </h3>
                <div className="border border-blue-100/60 rounded-xl p-6 bg-white shadow-sm">
                  <div className="text-gray-700 leading-relaxed">{values.workingHours}</div>
                </div>
              </div>
            )}

            {benefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Phúc lợi
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}>
                      <div className="bg-white border border-blue-100 rounded-xl p-3 text-sm flex items-center gap-2 shadow-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {benefit}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-500" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1 text-sm border-blue-200 rounded-xl">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {values.description && (
              <div className="space-y-3">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Mô tả công ty
                </h3>
                <div className="border border-blue-100/60 rounded-xl p-6 bg-white shadow-sm">
                  <div
                    className="prose prose-sm text-gray-700 leading-relaxed [&_li_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: values.description }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 mb-4">
              <Checkbox
                id="agreeTerms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                className="border-border data-[state=checked]:bg-blue-500 data-[state=checked]:border-secondary"
              />
              <Label htmlFor="agreeTerms" className="text-sm text-foreground leading-relaxed">
                Tôi đồng ý với{" "}
                <Link href={"/terms"} className="text-blue-500 hover:underline font-medium">
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link href={"/privacy"} className="text-blue-500 hover:underline font-medium">
                  Chính sách bảo mật
                </Link>{" "}
                của Career Point
              </Label>
            </div>
          </motion.div>
        </CardContent>

        <CardFooter className="flex justify-between pt-4 pb-6 px-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviousStep}
            className="flex items-center gap-2 h-11 px-5 hover:bg-muted/50 transition-all duration-200 rounded-xl border-blue-100/60 hover:border-blue-300 bg-transparent cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || !agreeTerms}
            onClick={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
            className={`h-11 px-6 rounded-xl ${
              isSubmitting
                ? "bg-muted cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer"
            } transition-all duration-300 relative overflow-hidden group`}>
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  Tạo công ty
                  <CheckCircle2 className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                </>
              )}
            </span>
          </Button>
        </CardFooter>
      </>
    );
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text pb-1">
          Đăng ký công ty mới
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Tạo hồ sơ công ty chuyên nghiệp để thu hút nhân tài hàng đầu
        </p>
      </motion.div>

      <div className="mx-auto">
        {/* {renderStepIndicators()} */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Card>
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
                    {renderStep1()}
                  </motion.div>
                )}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}>
                    {renderStep2()}
                  </motion.div>
                )}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}>
                    {renderStep3()}
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
