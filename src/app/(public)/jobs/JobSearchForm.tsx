"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  MapPin,
  X,
  SlidersHorizontal,
  Briefcase,
  GraduationCap,
  DollarSign,
  ArrowUpDown,
  BadgeCheck,
  Filter,
  Trash2,
  Banknote,
} from "lucide-react";
import { fetchProvinces, formatSalary } from "@/lib/api/jobs";

// Province type definition
type Province = {
  id: string;
  name: string;
  type: number;
  typeText: string;
  slug: string;
};

// Common job types
const JOB_TYPES = [
  { value: "All Types", label: "Tất cả" },
  { value: "Full-time", label: "Toàn thời gian" },
  { value: "Part-time", label: "Bán thời gian" },
  { value: "Contract", label: "Hợp đồng" },
  { value: "Freelance", label: "Freelance / Tự do" },
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
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "HTML/CSS",
  "SQL",
  "TypeScript",
  "Angular",
  "Vue.js",
  "AWS",
  "Docker",
  "Git",
  "DevOps",
];

interface JobSearchFormProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  remoteOnly: boolean;
  handleRemoteToggle: (checked: boolean) => void;
  handleLocationSelect: (value: string) => void;
  selectedSkills: string[];
  toggleSkill: (skill: string) => void;
  handleSearch: (e?: React.FormEvent) => void;
  activeFilterCount: number;
  jobType: string;
  setJobType: (value: string) => void;
  experience: string;
  setExperience: (value: string) => void;
  salaryRange: [number, number];
  setSalaryRange: (value: [number, number]) => void;
  sortBy: "score" | "salary" | "createdAt";
  setSortBy: (value: "score" | "salary" | "createdAt") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  clearFilters: () => void;
}

export default function JobSearchForm({
  searchTerm,
  setSearchTerm,
  location,
  setLocation,
  remoteOnly,
  handleRemoteToggle,
  handleLocationSelect,
  selectedSkills,
  toggleSkill,
  handleSearch,
  activeFilterCount,
  jobType,
  setJobType,
  experience,
  setExperience,
  salaryRange,
  setSalaryRange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  clearFilters,
}: JobSearchFormProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [skillsPopoverOpen, setSkillsPopoverOpen] = useState(false);
  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [provinceLoading, setProvinceLoading] = useState(false);
  const [provinceQuery, setProvinceQuery] = useState("");
  const fetchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleFetchProvinces = async (query: string) => {
    setProvinceLoading(true);
    const res = await fetchProvinces(query);
    setProvinceList(res?.data || []);
    setProvinceLoading(false);
  };

  useEffect(() => {
    if (locationPopoverOpen) {
      handleFetchProvinces("");
      setProvinceQuery("");
    }
  }, [locationPopoverOpen]);

  useEffect(() => {
    if (!locationPopoverOpen) return;

    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);

    fetchTimeout.current = setTimeout(() => {
      handleFetchProvinces(provinceQuery);
    }, 300);
  }, [provinceQuery]);

  // Format salary range for display
  const formatSalaryRange = (range: [number, number]) => {
    return `${formatSalary(range[0])} - ${formatSalary(range[1])}`;
  };

  return (
    <>
      {/* Basic Search Form - Always visible */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}>
        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <div className="relative group">
            <div
              className={`absolute left-3 top-4 h-4 w-4 text-muted-foreground transition-colors ${
                searchFocused ? "text-primary" : ""
              }`}>
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder="Từ khoá hoặc tên công ty"
              className={`pl-10 h-12 transition-all duration-300 ${
                searchFocused ? "border-primary ring-1 ring-primary" : "hover:border-muted-foreground/50"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchTerm && (
              <button
                type="button"
                className="absolute right-3 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setSearchTerm("")}>
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="relative group">
                  <div className="absolute left-3 top-4 h-4 w-4 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <Input
                    placeholder="Địa điểm"
                    className="pl-10 h-12 hover:border-muted-foreground/50 cursor-pointer"
                    value={location}
                    onClick={() => setLocationPopoverOpen(true)}
                    readOnly
                  />
                  {location && (
                    <button
                      type="button"
                      className="absolute right-3 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation("");
                        handleRemoteToggle(false);
                      }}>
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search location..."
                    value={provinceQuery}
                    onValueChange={setProvinceQuery}
                  />
                  <CommandList>
                    <CommandEmpty>{provinceLoading ? "Loading..." : "No location found."}</CommandEmpty>
                    <CommandGroup heading="Provinces">
                      {provinceList.map((prov) => (
                        <CommandItem
                          key={prov.id}
                          value={prov.name}
                          onSelect={() => handleLocationSelect(prov.name)}
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
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="h-12 flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm cursor-pointer">
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`h-12 px-3 relative cursor-pointer ${
                isAdvancedFiltersOpen ? "border-primary text-primary" : ""
              }`}
              onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}>
              <SlidersHorizontal className="h-5 w-5" />
              <span className="sr-only md:not-sr-only md:ml-2">Bộ lọc</span>
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>
        </form>

        <div className="flex items-center mt-3 text-sm text-muted-foreground">
          <div className="flex items-center mr-4">
            <Switch id="remote-only" checked={remoteOnly} onCheckedChange={handleRemoteToggle} className="mr-2" />
            <Label htmlFor="remote-only" className="cursor-pointer">
              Việc làm từ xa
            </Label>
          </div>

          <Popover open={skillsPopoverOpen} onOpenChange={setSkillsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="link" className="h-auto p-0 text-sm">
                Lọc nhanh kỹ năng
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px]">
              <div className="space-y-2">
                <div className="font-medium">Kỹ năng phổ biến</div>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.slice(0, 8).map((skill) => (
                    <Badge
                      key={skill}
                      variant={selectedSkills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSkill(skill)}>
                      {skill}
                      {selectedSkills.includes(skill) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
                <div className="pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      handleSearch();
                      setSkillsPopoverOpen(false);
                    }}>
                    Lọc
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </motion.div>

      {/* Advanced Filters - Toggleable */}
      <AnimatePresence>
        {isAdvancedFiltersOpen && (
          <motion.div
            className="mb-8 p-6 border rounded-lg bg-background shadow-sm"
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto", overflow: "visible" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Bộ lọc nâng cao</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsAdvancedFiltersOpen(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Đóng</span>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Job Type */}
              <div className="space-y-2">
                <Label htmlFor="jobType" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Hình thức làm việc
                </Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger id="jobType">
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
                <Label htmlFor="experience" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  Cấp bậc kinh nghiệm
                </Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger id="experience">
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

              {/* Sorting */}
              <div className="space-y-2">
                <Label htmlFor="sorting" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  Sắp xếp theo
                </Label>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                    <SelectTrigger id="sortBy" className="flex-1">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score">Liên quan nhất</SelectItem>
                      <SelectItem value="salary">Lương</SelectItem>
                      <SelectItem value="createdAt">Ngày đăng</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="h-10 w-10"
                    title={sortOrder === "asc" ? "Ascending" : "Descending"}>
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Salary Range */}
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="salary-range" className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                    Mức lương
                  </Label>
                  <span className="text-sm text-muted-foreground font-medium">{formatSalaryRange(salaryRange)}</span>
                </div>
                <Slider
                  id="salary-range"
                  min={0}
                  max={200000}
                  step={5000}
                  value={salaryRange}
                  onValueChange={(value) => setSalaryRange(value as [number, number])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0</span>
                  <span>$100k</span>
                  <span>$200k+</span>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3 md:col-span-2 lg:col-span-3">
                <Label className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                  Kỹ năng
                </Label>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {COMMON_SKILLS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <Label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="text-sm text-muted-foreground mr-2">Selected:</div>
                    {selectedSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button onClick={() => toggleSkill(skill)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedSkills.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => selectedSkills.forEach(toggleSkill)}>
                        Xoá bộ lọc
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={clearFilters} className="gap-2 bg-transparent">
                <Trash2 className="h-4 w-4" />
                Xoá bộ lọc
              </Button>
              <Button onClick={handleSearch} className="gap-2">
                <Filter className="h-4 w-4" />
                Áp dụng
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
