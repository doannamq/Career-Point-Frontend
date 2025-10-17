"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Filter, X, Briefcase, GraduationCap, DollarSign, BadgeCheck, Banknote } from "lucide-react";
import { formatSalary } from "@/lib/api/jobs";

// Common job types
const JOB_TYPES = [
  { value: "All Types", label: "Tất cả" },
  { value: "Full-time", label: "Toàn thời gian" },
  { value: "Part-time", label: "Bán thời gian" },
  { value: "Contract", label: "Hợp đồng" },
  { value: "Freelance", label: "Làm tự do" },
  { value: "Internship", label: "Thực tập" },
  { value: "Remote", label: "Làm việc từ xa" },
  { value: "Hybrid", label: "Làm việc kết hợp" },
];

// Common experience levels
const EXPERIENCE_LEVELS = [
  { value: "All Levels", label: "Tất cả" },
  { value: "Không yêu cầu kinh nghiệm", label: "Không yêu cầu kinh nghiệm" },
  { value: "1-3 năm", label: "1-3 năm" },
  { value: "3-5 năm", label: "3-5 năm" },
  { value: "5-8 năm", label: "5-8 năm" },
  { value: "8+ năm", label: "8+ năm" },
  { value: "Quản lý", label: "Quản lý" },
  { value: "Giám đốc", label: "Giám đốc" },
  { value: "C-level", label: "C-level" },
];

// Common skills
const COMMON_SKILLS = [
  "Công nghệ",
  "Y tế",
  "Kinh doanh",
  "Giáo dục",
  "Bán lẻ",
  "Dịch vụ khách sạn",
  "Logistics",
  "Kỹ thuật",
  "Thiết kế",
  "Tài chính",
];

interface JobFiltersProps {
  jobType: string;
  setJobType: (value: string) => void;
  experience: string;
  setExperience: (value: string) => void;
  remoteOnly: boolean;
  handleRemoteToggle: (checked: boolean) => void;
  salaryRange: [number, number];
  setSalaryRange: (value: [number, number]) => void;
  selectedSkills: string[];
  toggleSkill: (skill: string) => void;
  handleSearch: () => void;
  activeFilterCount: number;
  clearFilters: () => void;
}

export default function JobFilters({
  jobType,
  setJobType,
  experience,
  setExperience,
  remoteOnly,
  handleRemoteToggle,
  salaryRange,
  setSalaryRange,
  selectedSkills,
  toggleSkill,
  handleSearch,
  activeFilterCount,
  clearFilters,
}: JobFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Format salary range for display
  const formatSalaryRange = (range: [number, number]) => {
    return `${formatSalary(range[0])} - ${formatSalary(range[1])}`;
  };

  return (
    <>
      {/* Filters - Desktop */}
      <div className="hidden lg:block">
        <motion.div
          className="sticky top-24 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Bộ lọc
              </h3>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                  Xoá bộ lọc
                </Button>
              )}
            </div>
            <div className="space-y-4 rounded-lg border p-4 bg-background">
              {/* Job Type */}
              <div className="space-y-2">
                <Label htmlFor="desktop-jobType" className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Hình thức làm việc
                </Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger id="desktop-jobType" className="h-9 text-sm">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="desktop-experience" className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  Cấp bậc kinh nghiệm
                </Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger id="desktop-experience" className="h-9 text-sm">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Remote Only Toggle */}
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="desktop-remote-only" checked={remoteOnly} onCheckedChange={handleRemoteToggle} />
                <Label htmlFor="desktop-remote-only" className="text-sm cursor-pointer">
                  Việc làm từ xa
                </Label>
              </div>

              <Separator />

              {/* Salary Range */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="desktop-salary-range" className="flex items-center gap-2 text-sm">
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                    Mức lương
                  </Label>
                  <span className="text-xs text-muted-foreground font-medium">{formatSalaryRange(salaryRange)}</span>
                </div>
                <Slider
                  id="desktop-salary-range"
                  min={0}
                  max={200000}
                  step={5000}
                  value={salaryRange}
                  onValueChange={(value) => setSalaryRange(value as [number, number])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0</span>
                  <span>$200k+</span>
                </div>
              </div>

              <Separator />

              {/* Skills */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                  Lĩnh vực
                </Label>
                <ScrollArea className="h-[200px] rounded-md border p-2">
                  <div className="space-y-2">
                    {COMMON_SKILLS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`desktop-skill-${skill}`}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <Label htmlFor={`desktop-skill-${skill}`} className="text-sm cursor-pointer">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {selectedSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs flex items-center gap-1">
                        {skill}
                        <button onClick={() => toggleSkill(skill)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button type="button" onClick={handleSearch} className="w-full mt-2 gap-2">
                <Filter className="h-4 w-4" />
                Áp dụng
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-transparent"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
          {isFiltersOpen ? (
            <>
              <X className="h-4 w-4" /> Ẩn bộ lọc
            </>
          ) : (
            <>
              <Filter className="h-4 w-4" /> Hiện bộ lọc
              {activeFilterCount > 0 && <Badge className="ml-2">{activeFilterCount}</Badge>}
            </>
          )}
        </Button>
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            className="lg:hidden mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="space-y-4 rounded-lg border p-4 bg-background">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Bộ lọc
                </h3>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                    Xoá bộ lọc
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Job Type */}
                <div className="space-y-2">
                  <Label htmlFor="mobile-jobType" className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Hình thức làm việc
                  </Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger id="mobile-jobType">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label htmlFor="mobile-experience" className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    Cấp bậc kinh nghiệm
                  </Label>
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger id="mobile-experience">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Remote Only Toggle */}
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="mobile-remote-only" checked={remoteOnly} onCheckedChange={handleRemoteToggle} />
                  <Label htmlFor="mobile-remote-only" className="cursor-pointer">
                    Việc làm từ xa
                  </Label>
                </div>

                <Separator />

                {/* Salary Range */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mobile-salary-range" className="flex items-center gap-2 text-sm">
                      <Banknote className="h-4 w-4 text-muted-foreground" />
                      Mức lương
                    </Label>
                    <span className="text-sm text-muted-foreground">{formatSalaryRange(salaryRange)}</span>
                  </div>
                  <Slider
                    id="mobile-salary-range"
                    min={0}
                    max={200000}
                    step={5000}
                    value={salaryRange}
                    onValueChange={(value) => setSalaryRange(value as [number, number])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$0</span>
                    <span>$200k+</span>
                  </div>
                </div>

                <Separator />

                {/* Skills */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm">
                    <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                    Lĩnh vực
                  </Label>
                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto rounded-md border p-2">
                    {COMMON_SKILLS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-skill-${skill}`}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <Label htmlFor={`mobile-skill-${skill}`} className="text-sm cursor-pointer">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {selectedSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs flex items-center gap-1">
                          {skill}
                          <button onClick={() => toggleSkill(skill)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" className="flex-1 gap-2" onClick={handleSearch}>
                    <Filter className="h-4 w-4" />
                    Áp dụng
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
