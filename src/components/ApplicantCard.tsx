import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, User } from "lucide-react";
import { getProfileById } from "@/lib/api/user";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useApplicant } from "@/context/applicant-context";
import { Applicant } from "@/types/job";

const ApplicantCard = ({ applicants }: { applicants: Applicant[] }) => {
  const router = useRouter();
  const { setSelectedApplicant } = useApplicant();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {applicants.map((applicant) => (
        <motion.div
          key={applicant._id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors duration-200"
          whileHover={{ x: 3 }}>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-muted">
              <AvatarFallback>
                {applicant.userName
                  ?.split(" ")
                  ?.map((n: any) => n[0])
                  ?.join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{applicant.userName}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(applicant.appliedDate)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
              New
            </Badge>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => {
                  setSelectedApplicant(applicant);
                  router.push(`/profile/${applicant.userId}`);
                }}>
                <User className="h-3.5 w-3.5 mr-1.5" />
                View Profile
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm"
                onClick={() => {
                  /* Handle contact */
                }}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Contact
              </Button>
            </motion.div>
          </div>
        </motion.div>
      ))}

      {applicants.length === 0 && <div className="text-center p-4 text-muted-foreground">No applicants found</div>}
    </div>
  );
};

export default ApplicantCard;
