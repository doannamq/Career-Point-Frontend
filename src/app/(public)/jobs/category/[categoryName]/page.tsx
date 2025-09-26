"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Banknote, Briefcase, Building2, CheckCircle, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatSalary, getJobsByCategory, getTimeAgo } from "@/lib/api/jobs";
import { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

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
              {job.jobType}
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
        </div>
      </CardContent>
    </Card>
  );
}

export default function CategoryJobsPage() {
  const { user } = useAuth();
  const { categoryName } = useParams<{ categoryName: string }>();
  const [categoryJobs, setCategoryJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryJobs = async () => {
      if (!categoryName) return;
      try {
        const res = await getJobsByCategory(categoryName);
        if (res && res.success) {
          setCategoryJobs(res.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryJobs();
  }, [categoryName]);

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">
                Việc làm {capitalizeFirstLetter(decodeURIComponent(categoryName))}
              </h1>
              <p className="text-muted-foreground">{categoryJobs.length} việc làm</p>
            </div>
          </div>

          <Badge variant="secondary" className="capitalize">
            {capitalizeFirstLetter(decodeURIComponent(categoryName))}
          </Badge>
        </div>

        {categoryJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categoryJobs.map((job: Job) => (
              <JobCard key={job._id} job={job} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/50 rounded-lg inline-block mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy công việc</h3>
            <p className="text-muted-foreground mb-4">
              Hiện tại chưa có công việc nào cho danh mục{" "}
              <span className="font-bold text-blue-500">{capitalizeFirstLetter(decodeURIComponent(categoryName))}</span>
            </p>
            <Button asChild>
              <Link href="/jobs">Xem thêm việc làm khác</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
