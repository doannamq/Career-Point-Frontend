"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Mail, Phone, Calendar, Building, GraduationCap } from "lucide-react";
import { useApplicant } from "@/context/applicant-context";
import { getProfileById } from "@/lib/api/user";
import { useAuth } from "@/context/auth-context";

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const [selectedApplicantInfo, setSelectedApplicantInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { selectedApplicant } = useApplicant();
  const selectedApplicantId = selectedApplicant ? selectedApplicant.userId : null;

  useEffect(() => {
    setLoading(true);
    if (!selectedApplicantId) {
      setLoading(false);
      return;
    }
    const fetchUserProfile = async () => {
      if (selectedApplicantId) {
        try {
          const response = await getProfileById(user?.accessToken as string, selectedApplicantId);
          setSelectedApplicantInfo(response.data.data);
          console.log("response data:", response.data.data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [selectedApplicantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">User not found</div>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container max-w-4xl py-8 mx-auto">
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <Avatar className="w-24 h-24 text-2xl">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(selectedApplicantInfo?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <CardTitle className="text-3xl mb-2">{selectedApplicantInfo?.name}</CardTitle>
              <CardDescription className="text-lg capitalize mb-2">{selectedApplicantInfo?.role}</CardDescription>
              {selectedApplicantInfo?.bio && <p className="text-muted-foreground">{selectedApplicantInfo?.bio}</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {selectedApplicantInfo?.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{selectedApplicantInfo?.email}</span>
              </div>
            )}
            {selectedApplicantInfo?.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{selectedApplicantInfo?.phoneNumber}</span>
              </div>
            )}
            {selectedApplicantInfo?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{selectedApplicantInfo?.location}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectedApplicantInfo?.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-sm py-1">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedApplicantInfo?.experience.length > 0 ? (
            <div className="space-y-6">
              {selectedApplicantInfo?.experience.map((exp: any, index: number) => (
                <div key={exp._id || index} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.title}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>{exp.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{exp.location}</span>
                    </div>
                  )}
                  {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                  {index < selectedApplicantInfo?.experience.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No experience listed</p>
          )}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedApplicantInfo?.education.length > 0 ? (
            <div className="space-y-6">
              {selectedApplicantInfo?.education.map((edu: any, index: number) => (
                <div key={edu._id || index} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{edu.degree}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>{edu.institution}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                  </div>
                  {edu.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{edu.location}</span>
                    </div>
                  )}
                  {index < selectedApplicantInfo?.education.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No education listed</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
