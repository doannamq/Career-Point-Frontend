import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Eye, FileText } from "lucide-react";
import type { Company } from "@/types/company";
import type { Job } from "@/types/job";

interface CompanyStatsProps {
  company: Company;
  jobsCompany: Job[];
}

export function CompanyStats({ company, jobsCompany }: CompanyStatsProps) {
  const stats = [
    {
      title: "Tổng số việc làm",
      value: jobsCompany?.length ?? 0,
      icon: Briefcase,
      color: "text-blue-600",
      key: "total-jobs",
    },
    {
      title: "Việc làm đang tuyển",
      value: jobsCompany?.filter((job) => job?.status === "Published").length ?? 0,
      icon: FileText,
      color: "text-green-600",
      key: "published-jobs",
    },
    {
      title: "Ứng viên đã ứng tuyển",
      value: company?.stats?.totalApplications ?? 0,
      icon: Users,
      color: "text-purple-600",
      key: "total-applications",
    },
    {
      title: "Lượt xem hồ sơ",
      value: company?.stats?.profileViews ?? 0,
      icon: Eye,
      color: "text-orange-600",
      key: "profile-views",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.key}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Number(stat.value).toLocaleString()}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
