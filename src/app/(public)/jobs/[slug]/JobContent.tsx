"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  Sparkles,
  Award,
  Clock,
  CheckCircle,
  Building,
  Users,
  Globe,
  ExternalLink,
  DollarSign,
  Heart,
  Calendar,
  Zap,
} from "lucide-react";
import { Job } from "@/types/job";

interface JobContentProps {
  job: Job;
  companyName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function JobContent({ job, companyName, activeTab, setActiveTab }: JobContentProps) {
  const benefitConfig: Record<string, { icon: any; description: string }> = {
    "Competitive Salary": {
      icon: DollarSign,
      description: "Industry-leading compensation packages",
    },
    "Health Insurance": {
      icon: Heart,
      description: "Comprehensive medical, dental, and vision",
    },
    "Flexible PTO": {
      icon: Calendar,
      description: "Generous paid time off policy",
    },
    "Remote Work": {
      icon: Zap,
      description: "Flexible work-from-home options",
    },
    "Professional Development": {
      icon: Award,
      description: "Learning stipend and growth opportunities",
    },
    "Team Events": {
      icon: Users,
      description: "Regular team building activities",
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

  return (
    <motion.div variants={itemVariants}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-blue-50/50 p-1 rounded-xl border border-blue-100/60">
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200 rounded-lg">
            Tổng quan
          </TabsTrigger>
          <TabsTrigger
            value="company"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200 rounded-lg">
            Công ty
          </TabsTrigger>
          <TabsTrigger
            value="benefits"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200 rounded-lg">
            Phúc lợi
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0 }}>
            <TabsContent value="description" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  {/* <Briefcase className="h-5 w-5 text-blue-600" /> */}
                  Mô tả công việc
                </h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: job.description || "<p class='text-gray-500 italic'>No description provided.</p>",
                  }}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  {/* <Sparkles className="h-5 w-5 text-blue-600" /> */}
                  Kỹ năng yêu cầu
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {job.skills.map((skill, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  {/* <Award className="h-5 w-5 text-blue-600" /> */}
                  Kinh nghiệm
                </h2>
                <p className="flex items-center gap-2">
                  {/* <Clock className="h-4 w-4 text-blue-600" /> */}
                  {job.experience}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="company">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16 border-2 border-muted">
                    <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${companyName.charAt(0)}`} />
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                      {companyName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{companyName}</h2>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      <Link href="#" className="hover:text-blue-600 transition-colors duration-200">
                        www.{companyName.toLowerCase().replace(/\s+/g, "")}.com
                      </Link>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    About {companyName}
                  </h3>
                  <p className="leading-relaxed mb-4">
                    {companyName} is a leading company in its field. We are dedicated to innovation and excellence in
                    everything we do. Our mission is to create products that make a difference in people's lives while
                    fostering a culture of creativity and collaboration.
                  </p>
                  <p className="leading-relaxed">
                    Founded in 2010, we've grown from a small startup to an industry leader with offices in multiple
                    countries. We value diversity, inclusion, and work-life balance, and we're always looking for
                    talented individuals to join our team.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Văn hoá công ty
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-blue-100/60 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 bg-white/50">
                      <h4 className="font-medium mb-1">Đổi mới</h4>
                      <p className="text-sm text-muted-foreground">
                        Chúng tôi khuyến khích tư duy sáng tạo và những ý tưởng mới
                      </p>
                    </div>
                    <div className="border border-blue-100/60 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 bg-white/50">
                      <h4 className="font-medium mb-1">Hợp tác</h4>
                      <p className="text-sm text-muted-foreground">
                        Chúng tôi cùng nhau làm việc để đạt được mục tiêu chung
                      </p>
                    </div>
                    <div className="border border-blue-100/60 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 bg-white/50">
                      <h4 className="font-medium mb-1">Phát triển</h4>
                      <p className="text-sm text-muted-foreground">Chúng tôi đầu tư vào sự phát triển của nhân viên</p>
                    </div>
                    <div className="border border-blue-100/60 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 bg-white/50">
                      <h4 className="font-medium mb-1">Cân bằng</h4>
                      <p className="text-sm text-muted-foreground">
                        Chúng tôi coi trọng sự cân bằng công việc – cuộc sống và sức khỏe tinh thần
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    asChild
                    className="group hover:border-blue-300 hover:bg-blue-50/80 transition-all duration-200 bg-transparent">
                    <Link
                      href={`/companies/${job.company.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                        Xem trang công ty
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="benefits">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Phúc lợi
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job?.benefits?.map((benefit, index) => {
                    const config = benefitConfig[benefit] || { icon: Award, description: "Great benefit" };
                    const IconComponent = config.icon;

                    return (
                      <div
                        key={index}
                        className="border-2 border-blue-100/60 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 flex items-start gap-3 bg-white/50">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <IconComponent className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="font-medium">{benefit}</h3>
                          <p className="text-sm text-muted-foreground">{config.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 italic">
                    "Chúng tôi tin rằng việc chăm sóc nhân viên sẽ mang đến những sản phẩm tốt hơn và khách hàng hạnh
                    phúc hơn. Gói phúc lợi của chúng tôi thể hiện cam kết đối với sức khỏe và hạnh phúc của đội ngũ."
                  </p>
                  <p className="text-sm font-medium text-blue-700 mt-2">— Giám đốc Nhân sự tại {job.companyName}</p>
                </div>
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}
