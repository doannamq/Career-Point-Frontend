"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Banknote, Building2, Briefcase, Clock } from "lucide-react";
import { formatSalary, getSimilarJobs, getTimeAgo } from "@/lib/api/jobs";
import { formatCompanyAddress } from "@/helpers/formatCompanyAddress";
import { Job } from "@/types/job";

interface SimilarJobsProps {
  job: Job;
  fadeInVariants: any;
}

export default function SimilarJobs({ job, fadeInVariants }: SimilarJobsProps) {
  const jobSlug = job.slug;
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      const response = await getSimilarJobs(jobSlug);
      setSimilarJobs(response.data);
    };
    fetchSimilarJobs();
  }, [jobSlug]);

  return (
    <motion.div variants={fadeInVariants} initial="hidden" animate="visible" className="mt-12">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-600" />
        Việc làm tương tự
      </h2>
      <p className="text-muted-foreground mb-8">Dưới đây là một số việc làm tương tự có thể bạn sẽ quan tâm</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarJobs.map((job) => (
          <motion.div key={job._id} whileHover={{ y: 0 }}>
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20 group">
              <CardContent className="p-6 h-full flex flex-col">
                <Link href={`/jobs/${job.slug}`} className="cursor-pointer flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Building2 className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                        {job.companyName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4 text-rose-500" />
                      {formatCompanyAddress(job.location)}
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
