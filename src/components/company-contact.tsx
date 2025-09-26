import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Facebook, Linkedin, Twitter, Instagram, Clock, User } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import type { Company } from "@/types/company";

interface CompanyContactProps {
  company: Company;
}

export function CompanyContact({ company }: CompanyContactProps) {
  const socialLinks = [
    { name: "Facebook", url: company.socialMedia.facebook, icon: Facebook, color: "text-blue-600" },
    { name: "LinkedIn", url: company.socialMedia.linkedin, icon: Linkedin, color: "text-blue-700" },
    { name: "Twitter", url: company.socialMedia.twitter, icon: Twitter, color: "text-sky-500" },
    { name: "Instagram", url: company.socialMedia.instagram, icon: Instagram, color: "text-pink-600" },
  ].filter((link) => link.url);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Thông tin liên hệ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium">Địa chỉ</p>
              <p className="text-gray-600">{company?.fullAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium">Điện thoại</p>
              <a href={`tel:${company?.contact?.phone}`} className="text-blue-600 hover:underline">
                {company?.contact?.phone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium">Email</p>
              <a href={`mailto:${company?.contact?.email}`} className="text-blue-600 hover:underline">
                {company?.contact?.email}
              </a>
            </div>
          </div>

          {company?.contact?.website && (
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">Website</p>
                <a href={company?.contact?.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {company?.contact?.website}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium">Giờ làm việc</p>
              <p className="text-gray-600">{company?.workingHours}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recruitment Contact & Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Liên hệ tuyển dụng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">{company?.recruitmentContact?.name}</p>
            <p className="text-gray-600">Nhân viên tuyển dụng</p>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-500" />
            <a href={`mailto:${company?.recruitmentContact?.email}`} className="text-blue-600 hover:underline">
              {company?.recruitmentContact?.email}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-500" />
            <a href={`tel:${company?.recruitmentContact?.phone}`} className="text-blue-600 hover:underline">
              {company?.recruitmentContact?.phone}
            </a>
          </div>

          {socialLinks?.length > 0 && (
            <div className="pt-4 border-t">
              <p className="font-medium mb-3">Mạng xã hội</p>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <Button key={social?.name} variant="outline" size="sm" asChild>
                    <a href={social?.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <social.icon className={`w-4 h-4 ${social?.color}`} />
                      {social?.name}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
