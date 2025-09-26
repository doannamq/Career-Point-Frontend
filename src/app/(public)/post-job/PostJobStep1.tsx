"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { NumericFormat } from "react-number-format";
import {
  AlertCircle,
  X,
  Plus,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Building,
  GraduationCap,
  Sparkles,
  Calendar,
  Globe,
  Users,
  Banknote,
} from "lucide-react";
import { TfiBriefcase } from "react-icons/tfi";
import { fetchDistricts, fetchProvinces } from "@/lib/api/jobs";
import type { FormData } from "./PostJobForm";
import { cn } from "@/lib/utils";

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

const jobTypes = {
  fullTime: {
    en: "Full-time",
    vi: "Toàn thời gian",
  },
  partTime: {
    en: "Part-time",
    vi: "Bán thời gian",
  },
  contract: {
    en: "Contract",
    vi: "Hợp đồng",
  },
  freelance: {
    en: "Freelance",
    vi: "Làm tự do",
  },
  internship: {
    en: "Internship",
    vi: "Thực tập",
  },
  remote: {
    en: "Remote",
    vi: "Làm việc từ xa",
  },
  hybrid: {
    en: "Hybrid",
    vi: "Làm việc kết hợp",
  },
};

const experienceLevels = [
  "Không yêu cầu kinh nghiệm",
  "1-3 năm",
  "3-5 năm",
  "5-8 năm",
  "8+ năm",
  "Quản lý",
  "Giám đốc",
  "C-level",
];

interface PostJobStep1Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setFormTouched: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  success: { message: string; slug: string } | null;
  setSuccess: React.Dispatch<React.SetStateAction<{ message: string; slug: string } | null>>;
  onNext: () => void;
  onCancel: () => void;
  companyDefault?: string;
  locationDefault?: string;
}

export default function PostJobStep1({
  formData,
  setFormData,
  setFormTouched,
  error,
  success,
  setSuccess,
  onNext,
  onCancel,
  companyDefault = "",
  locationDefault = "",
}: PostJobStep1Props) {
  const [newSkill, setNewSkill] = useState("");
  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [provinceLoading, setProvinceLoading] = useState(false);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [provincePopoverOpen, setProvincePopoverOpen] = useState(false);
  const [districtPopoverOpen, setDistrictPopoverOpen] = useState(false);
  const [provinceQuery, setProvinceQuery] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormTouched(true);
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormTouched(true);
  };

  // Add a new skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
      setFormTouched(true);
    }
  };

  // Remove a skill
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
    setFormTouched(true);
  };

  // Add a new benefit
  const handleAddBenefit = (benefit: string) => {
    if (!formData.benefits.includes(benefit)) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefit],
      }));
      setFormTouched(true);
    } else {
      setFormData((prev) => ({
        ...prev,
        benefits: prev.benefits.filter((b) => b !== benefit),
      }));
    }
  };

  // Common benefits options
  const commonBenefits = [
    { name: "Bảo hiểm y tế", icon: <Users className="h-4 w-4" /> },
    { name: "Làm việc từ xa", icon: <Globe className="h-4 w-4" /> },
    { name: "Giờ làm việc linh hoạt", icon: <Clock className="h-4 w-4" /> },
    { name: "Nghỉ phép có lương", icon: <Calendar className="h-4 w-4" /> },
    { name: "Phát triển nghề nghiệp", icon: <GraduationCap className="h-4 w-4" /> },
    { name: "Up to 20.000.000đ", icon: <Banknote className="h-4 w-4" /> },
  ];

  return (
    <>
      <CardHeader className="pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-full shadow-sm">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text">
              Thông tin cơ bản về công việc
            </CardTitle>
            <CardDescription className="text-base">Điền các thông tin cơ bản về công việc</CardDescription>
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

          {/* Success message */}
          <Dialog open={!!success} onOpenChange={() => setSuccess(null)}>
            <DialogContent className="max-w-lg bg-white border border-gray-200 rounded-xl shadow-lg p-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-gray-800 text-lg font-semibold">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  Đăng tuyển dụng thành công!
                </DialogTitle>
                <DialogDescription className="mt-2 text-gray-600 text-sm leading-relaxed">
                  Cảm ơn bạn đã gửi tin tuyển dụng. Tin đăng của bạn sẽ được quản trị viên xem xét trước khi hiển thị
                  công khai.
                  <br />
                  <strong>Thời gian dự kiến duyệt:</strong> trong vòng 24 giờ.
                  <br />
                  Bạn sẽ nhận được thông báo khi tin tuyển dụng của bạn được phê duyệt.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-3 mt-4">
                <Button variant="ghost" onClick={() => setSuccess(null)} className="text-green-700">
                  Đóng
                </Button>
                {/* <Button onClick={() => {}} className="bg-green-600 text-white hover:bg-green-700">
                  View Job
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
          <Label htmlFor="title" className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-blue-500" />
            Tên công việc <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Frontend Developer"
            value={formData.title}
            onChange={handleChange}
            required
            className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-2.5">
          <Label htmlFor="company" className="text-base flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-500" />
            Công ty <span className="text-red-500">*</span>
          </Label>
          <Input
            id="company"
            name="company"
            value={companyDefault}
            disabled
            readOnly
            className="h-12 transition-all duration-300 border-blue-100/60 bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-2.5">
          <Label className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            Địa điểm <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-3">
            {/* Province Popover */}
            <Popover open={provincePopoverOpen} onOpenChange={setProvincePopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 w-1/2 justify-start bg-transparent" type="button">
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
                            setFormData((prev) => ({
                              ...prev,
                              location: "",
                            }));
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

            {/* District Popover */}
            <Popover open={districtPopoverOpen} onOpenChange={setDistrictPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 w-1/2 justify-start bg-transparent"
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
                            if (selectedProvince) {
                              setFormData((prev) => ({
                                ...prev,
                                location: `${dist.name}, ${selectedProvince.name}`,
                              }));
                            }
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
          </div>
          {/* Hiển thị location đã chọn */}
          {formData.location && <div className="text-sm text-blue-600 mt-1">Địa chỉ: {formData.location}</div>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Type */}
          <div className="space-y-2.5">
            <Label htmlFor="jobType" className="text-base flex items-center gap-2">
              <TfiBriefcase className="h-4 w-4 text-blue-500" />
              Hình thức làm việc <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select value={formData.jobType} onValueChange={(value) => handleSelectChange("jobType", value)} required>
                <SelectTrigger
                  id="jobType"
                  className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl">
                  <SelectValue placeholder="Chọn hình thức làm việc" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {Object.values(jobTypes).map((type) => (
                    <SelectItem key={type.en} value={type.en}>
                      {type.vi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2.5">
            <Label htmlFor="experience" className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Kinh nghiệm <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select
                value={formData.experience}
                onValueChange={(value) => handleSelectChange("experience", value)}
                required>
                <SelectTrigger
                  id="experience"
                  className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl">
                  <SelectValue placeholder="Chọn kinh nghiệm" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="space-y-2.5">
            <Label htmlFor="salary" className="text-base flex items-center gap-2">
              <Banknote className="h-4 w-4 text-blue-500" />
              Lương (VND) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <NumericFormat
                id="salary"
                name="salary"
                placeholder="e.g. 25,000,000"
                value={formData.salary}
                onValueChange={(values) => setFormData({ ...formData, salary: values.value })}
                required
                allowLeadingZeros
                thousandSeparator=","
                allowNegative={false}
                className={cn(
                  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  "h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
                )}
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="space-y-2.5">
            <Label htmlFor="applicationDeadline" className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Hạn ứng tuyển
            </Label>
            <Input
              id="applicationDeadline"
              name="applicationDeadline"
              type="date"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
            />
          </motion.div>
        </div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="space-y-2.5">
          <Label htmlFor="skills" className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-blue-500" />
            Kỹ năng <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-3">
            <Input
              id="skills"
              placeholder="e.g. JavaScript"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="h-12 transition-all duration-300 border-blue-100/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl"
            />
            <Button
              type="button"
              onClick={handleAddSkill}
              className="h-12 px-5 bg-green-200/30 hover:bg-green-100 text-black  cursor-pointer">
              <Plus className="h-5 w-5 mr-2" /> Thêm
            </Button>
          </div>
          <AnimatePresence>
            {formData.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mt-4">
                {formData.skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-100 to-green-100 hover:from-blue-200 hover:to-green-200 transition-all duration-300 border border-blue-200 rounded-xl">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 rounded-full hover:bg-blue-200/50 p-0.5 transition-colors duration-200">
                        <X className="h-3.5 w-3.5" />
                        <span className="sr-only">Xoá {skill}</span>
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="space-y-4 pt-2">
          <Label className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Phúc lợi
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {commonBenefits.map((benefit) => (
              <div key={benefit.name} className="flex">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddBenefit(benefit.name)}
                  className={`flex items-center justify-start gap-2 h-auto py-2 px-3 w-full text-sm transition-all duration-200 rounded-xl ${
                    formData.benefits.includes(benefit.name)
                      ? "bg-gradient-to-r from-blue-100 to-green-100 border-blue-300 text-blue-700"
                      : "hover:border-blue-300 hover:bg-blue-50/50"
                  }`}>
                  <div
                    className={`${
                      formData.benefits.includes(benefit.name) ? "text-blue-600" : "text-muted-foreground"
                    }`}>
                    {benefit.icon}
                  </div>
                  {benefit.name}
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </CardContent>

      <CardFooter className="flex justify-between pt-4 pb-6 px-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-11 px-5 hover:bg-red-50 transition-all duration-200 rounded-xl border-blue-100/60 hover:border-red-200 bg-transparent cursor-pointer">
          Huỷ
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer">
          Tiếp theo <ArrowRight className="h-4 w-4 animate-pulse-slow" />
        </Button>
      </CardFooter>
    </>
  );
}
