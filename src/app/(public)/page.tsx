"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHomeJobs, formatSalary, getTimeAgo } from "@/lib/api/jobs";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Building2,
  GraduationCap,
  Code,
  Stethoscope,
  ShoppingBag,
  Utensils,
  Truck,
  Wrench,
  PenTool,
  ChevronRight,
  Star,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Sparkles,
  CreditCard,
  Banknote,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { NavigationLink } from "@/components/ui/navigation-link";
import TypewriterAnimation from "@/components/TypeWrite";
import InfiniteLogoCarousel from "@/components/InfiniteLogoCarousel";
import "../../styles/style.css";
import { Job } from "@/types/job";
import { convertJobType } from "@/helpers/converJobType";

const categories = [
  { name: "Công nghệ", icon: <Code className="h-6 w-6" />, count: 235, color: "bg-blue-50 text-blue-600" },
  { name: "Y tế", icon: <Stethoscope className="h-6 w-6" />, count: 142, color: "bg-green-50 text-green-600" },
  { name: "Kinh doanh", icon: <Building2 className="h-6 w-6" />, count: 187, color: "bg-purple-50 text-purple-600" },
  { name: "Giáo dục", icon: <GraduationCap className="h-6 w-6" />, count: 98, color: "bg-amber-50 text-amber-600" },
  { name: "Bán lẻ", icon: <ShoppingBag className="h-6 w-6" />, count: 76, color: "bg-pink-50 text-pink-600" },
  {
    name: "Dịch vụ khách sạn",
    icon: <Utensils className="h-6 w-6" />,
    count: 64,
    color: "bg-orange-50 text-orange-600",
  },
  { name: "Logistics", icon: <Truck className="h-6 w-6" />, count: 53, color: "bg-cyan-50 text-cyan-600" },
  { name: "Kỹ thuật", icon: <Wrench className="h-6 w-6" />, count: 112, color: "bg-indigo-50 text-indigo-600" },
  { name: "Thiết kế", icon: <PenTool className="h-6 w-6" />, count: 89, color: "bg-rose-50 text-rose-600" },
  { name: "Tài chính", icon: <CreditCard className="h-6 w-6" />, count: 70, color: "bg-teal-50 text-teal-600" },
];

const popularSearches = [
  "Công nghệ thông tin",
  "Marketing",
  "Thiết kế",
  "Làm việc từ xa",
  "Toàn thời gian",
  "Kỹ thuật",
  "Bán hàng",
  "Tài chính",
];

const stats = [
  { value: "10K+", label: "Việc làm", icon: <Briefcase className="h-5 w-5" /> },
  { value: "8K+", label: "Công ty", icon: <Building2 className="h-5 w-5" /> },
  { value: "25K+", label: "Ứng viên", icon: <Users className="h-5 w-5" /> },
  { value: "95%", label: "Tỷ lệ thành công", icon: <TrendingUp className="h-5 w-5" /> },
];

const testimonials = [
  {
    quote:
      "Career Point đã giúp tôi tìm được công việc mơ ước chỉ trong hai tuần! Quá trình rất mượt mà và các gợi ý cực kỳ chính xác.",
    author: "Nguyễn Thảo",
    role: "UX Designer tại VNG",
  },
  {
    quote:
      "Là một quản lý tuyển dụng, tôi đã tìm thấy nhiều nhân tài xuất sắc qua Career Point. Chất lượng ứng viên luôn khiến tôi ấn tượng.",
    author: "Trần Minh Quân",
    role: "Tech Lead tại FPT Software",
  },
  {
    quote:
      "Những gợi ý việc làm cá nhân hóa và quy trình ứng tuyển đơn giản đã giúp tôi tìm việc hiệu quả hơn, bớt căng thẳng hơn rất nhiều.",
    author: "Lê Thu Hà",
    role: "Marketing Manager tại Viettel",
  },
];

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadJobs() {
      setIsLoading(true);
      try {
        const jobsData = await getHomeJobs();
        setJobs(jobsData);
      } catch (error) {
        console.error("Failed to load jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadJobs();

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/jobs?query=${searchTerm}&location=${location}`);
  };

  const handlePopularSearch = (term: string) => {
    setSearchTerm(term);
    router.push(`/jobs?query=${term}`);
  };

  const filteredJobs = activeTab === "all" ? jobs : jobs.filter((job) => job.jobType.toLowerCase().includes(activeTab));

  // Scroll to jobs section
  const scrollToJobs = () => {
    const jobsSection = document.getElementById("latest-jobs");
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}

      {/* Hero Section with Search */}
      <motion.section
        ref={heroRef}
        className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-background py-16 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}>
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-60 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <motion.div
              className="space-y-4 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}>
              <motion.div
                className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}>
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Hơn 10,000 việc làm đang tuyển
                </span>
              </motion.div>

              <h1
                className="text-4xl font-bold tracking-normal sm:text-5xl md:text-6xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 leading-[1.2] pb-1"
                style={{ fontFamily: "PolySans Bulky, sans-serif" }}>
                {/* Find your dream job today with */}
                Chạm đến công việc mơ ước với
              </h1>

              <TypewriterAnimation />

              <motion.p
                className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl"
                style={{ fontFamily: "PolySans Bulky Slim, sans-serif" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}>
                Khám phá hàng ngàn cơ hội việc làm với đầy đủ thông tin để bạn tự tin cho bước tiến sự nghiệp tiếp theo.
              </motion.p>
            </motion.div>

            <motion.div
              className="w-full max-w-3xl space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}>
              <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="relative group">
                    <Search
                      className={`absolute left-3 top-4 h-4 w-4 transition-colors duration-200 ${
                        searchFocused ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <Input
                      type="text"
                      placeholder="Tên công việc hoặc từ khóa"
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
                        className="absolute right-3 top-4 text-muted-foreground hover:text-foreground"
                        onClick={() => setSearchTerm("")}>
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <span className="sr-only">Clear search</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </motion.div>
                      </button>
                    )}
                  </div>

                  <div className="relative group">
                    <MapPin
                      className={`absolute left-3 top-4 h-4 w-4 transition-colors duration-200 ${
                        locationFocused ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <Input
                      type="text"
                      placeholder="Địa điểm"
                      className={`pl-10 h-12 transition-all duration-300 ${
                        locationFocused ? "border-primary ring-1 ring-primary" : "hover:border-muted-foreground/50"
                      }`}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onFocus={() => setLocationFocused(true)}
                      onBlur={() => setLocationFocused(false)}
                    />
                    {location && (
                      <button
                        type="button"
                        className="absolute right-3 top-4 text-muted-foreground hover:text-foreground"
                        onClick={() => setLocation("")}>
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <span className="sr-only">Clear location</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </motion.div>
                      </button>
                    )}
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <Search className="h-4 w-4 mr-2" />
                    Tìm kiếm ngay
                  </Button>
                </motion.div>
              </form>

              <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                <span className="text-muted-foreground">Phổ biến:</span>
                {popularSearches.map((term) => (
                  <motion.div key={term} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge
                      variant="outline"
                      className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 cursor-pointer py-1 px-3 transition-all duration-200"
                      onClick={() => handlePopularSearch(term)}>
                      {term}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-[50px] left-1/2 transform -translate-x-1/2 hidden md:block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}>
              <motion.div
                className="flex flex-col items-center cursor-pointer"
                onClick={scrollToJobs}
                whileHover={{ y: -2 }}
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
                <span className="text-sm text-muted-foreground mb-1">Khám phá thêm</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground rotate-90" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-12 bg-background border-y border-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}>
                <div className="rounded-full bg-primary/10 p-3 mb-3">{stat.icon}</div>
                <h3 className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* <section className="py-8 bg-muted/20 border-y border-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}>
            <p className="text-sm text-muted-foreground font-medium">Được tin tưởng bởi các công ty hàng đầu</p>
          </motion.div>
          <InfiniteLogoCarousel />
        </div>
      </section> */}

      {/* Featured Jobs Section */}
      <section id="latest-jobs" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center justify-between gap-4 sm:flex-row mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}>
            <div>
              <motion.div
                className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}>
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  Cơ hội mới
                </span>
              </motion.div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Việc làm mới nhất</h2>
              <p className="text-muted-foreground mt-2">Khám phá hành trình sự nghiệp mới cùng chúng tôi</p>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NavigationLink href="/jobs">
                <Button variant="outline" className="mt-4 sm:mt-0 group cursor-pointer bg-transparent">
                  Xem thêm
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </NavigationLink>
            </motion.div>
          </motion.div>

          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 h-10">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">
                Tất cả
              </TabsTrigger>
              <TabsTrigger value="full" className="data-[state=active]:bg-primary/10">
                Toàn thời gian
              </TabsTrigger>
              <TabsTrigger value="remote" className="data-[state=active]:bg-primary/10">
                Làm việc từ xa
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {filteredJobs?.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true, margin: "-50px" }}
                    layout>
                    <JobCard job={job} user={user} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}>
            <motion.div
              className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                Danh mục
              </span>
            </motion.div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Khám phá theo danh mục nghề nghiệp</h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl">Khởi đầu sự nghiệp trong ngành bạn yêu thích</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true, margin: "-50px" }}>
                <Link href={`/jobs/category/${category.name.toLowerCase()}`} className="group block h-full">
                  <Card className="h-full transition-all duration-300 hover:border-primary hover:shadow-md overflow-hidden group-hover:-translate-y-1">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <motion.div
                        className={`mb-4 rounded-full ${category.color} p-4 transition-all duration-300 group-hover:scale-110`}
                        whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                        transition={{ duration: 0.5 }}>
                        {category.icon}
                      </motion.div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      {/* <p className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">{category.count}</span> việc làm
                      </p> */}
                      <motion.div
                        className="mt-3 text-primary text-sm font-medium opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center"
                        initial={false}>
                        Khám phá cơ hội việc làm <ChevronRight className="h-4 w-4 ml-1" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}>
            <motion.div
              className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                Chia sẻ thành công
              </span>
            </motion.div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Trải nghiệm thực tế</h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
              Câu chuyện từ những người đã kết nối với công việc lý tưởng nhờ Career Point.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative h-[250px] md:h-[200px]">
              <AnimatePresence mode="wait">
                {testimonials.map(
                  (testimonial, index) =>
                    currentTestimonial === index && (
                      <motion.div
                        key={index}
                        className="absolute inset-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}>
                        <Card className="h-full border-primary/20 bg-primary/[0.03]">
                          <CardContent className="flex flex-col justify-center items-center text-center h-full p-6">
                            <div className="mb-4 text-primary">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                              </svg>
                            </div>
                            <p className="text-lg mb-4 italic">{testimonial.quote}</p>
                            <div>
                              <p className="font-semibold">{testimonial.author}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentTestimonial === index ? "bg-primary scale-125" : "bg-muted"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12 lg:p-16 border border-primary/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}>
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="flex flex-col items-center space-y-8 text-center relative z-10">
              <motion.div
                className="space-y-4 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}>
                <motion.div
                  className="inline-block bg-primary/20 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}>
                  <span className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    Bắt đầu hành trình của bạn
                  </span>
                </motion.div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  Đã sẵn sàng cho bước tiến tiếp theo?
                </h2>

                <p className="mx-auto text-muted-foreground text-lg">
                  Tạo tài khoản để lưu công việc, nhận gợi ý cá nhân hóa và ứng tuyển nhanh chóng.
                </p>

                <div className="flex flex-wrap gap-4 justify-center mt-8">
                  {!user ? (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/register">
                          <Button
                            size="lg"
                            className="px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Tạo tài khoản
                          </Button>
                        </Link>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/login">
                          <Button
                            variant="outline"
                            size="lg"
                            className="px-8 border-primary/30 hover:bg-primary/5 bg-transparent">
                            Đăng nhập
                          </Button>
                        </Link>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/jobs">
                        <Button
                          size="lg"
                          className="px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Xem tất cả việc làm
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// Job Card component
function JobCard({ job, user }: { job: Job; user: any }) {
  const [companyAddress, setCompanyAddress] = useState("");

  const handleFormatCompanyAddress = async () => {
    if (job.location) {
      const address = job.location;
      if (address) {
        const addressParts = address.split(",").map((p) => p.trim());

        const district = addressParts[addressParts.length - 2] || "";
        const city = addressParts[addressParts.length - 1] || "";

        const shortAddress = `${district}, ${city}`;
        setCompanyAddress(shortAddress);
      }
    }
  };

  useEffect(() => {
    handleFormatCompanyAddress();
  }, [job.company]);

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20 group">
      <CardContent className="p-6 h-full flex flex-col">
        <Link href={`/jobs/${job.slug}`} className="cursor-pointer flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center">
                <Building2 className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                {job.companyName}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 text-rose-500" />
              {companyAddress}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
              {convertJobType(job.jobType)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4 text-amber-500" />
              {getTimeAgo(job.createdAt)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Banknote className="mr-2 h-4 w-4 text-emerald-500" />
              {formatSalary(job.salary)}
            </div>
          </div>
        </Link>

        <div className="mt-5 pt-4 border-t">
          <div className="flex flex-wrap gap-1 mb-3">
            {job.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3}
              </Badge>
            )}
          </div>

          {/* <div className="flex gap-2">
            {user && job?.applicants.includes(user.userId) ? (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="w-full bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Đã ứng tuyển
              </Button>
            ) : (
              <Link href={`/jobs/${job.slug}`} className="w-full">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 cursor-pointer">
                  Ứng tuyển ngay
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}

// Job Card Skeleton component
function JobCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="p-6 h-full">
        <div className="flex items-start justify-between">
          <div className="w-full">
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        <div className="mt-5 pt-4 border-t">
          <div className="flex gap-1 mb-3">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
