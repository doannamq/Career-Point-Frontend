import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Building2, MapPin, Users, Calendar, Globe, Phone, Mail, CheckCircle, Crown, Star } from "lucide-react";
import type { Company } from "@/types/company";
import { NavigationLink } from "./ui/navigation-link";
import { convertCompanyType } from "@/helpers/convertCompanyType";
import { convertCompanyIndustry } from "@/helpers/convertCompanyIndustry";
import { convertCompanySize } from "@/helpers/convertCompanySize";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const isProCompany = company?.subscription?.plan === "enterprise";
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            {company?.logo ? (
              <img
                src={company?.logo}
                alt={`${company?.name} logo`}
                className="w-16 h-16 rounded-lg object-cover border"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center border">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-xl text-slate-900 leading-tight break-words">{company?.name}</h3>
              {isProCompany && (
                <div className="relative shrink-0">
                  <Badge className="bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 border-0 shadow-md hover:shadow-lg transition-shadow font-semibold px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground">{convertCompanyType(company?.companyType)}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {convertCompanyIndustry(company?.industry)}
              </Badge>
              {company?.isVerified && (
                <Badge className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 transition-colors">
                  Đã xác thực
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* <p className="text-sm text-muted-foreground line-clamp-3">{company?.description}</p>
        <div className="text-sm text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: company?.description }} /> */}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">{company?.address.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{convertCompanySize(company?.companySize)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Thành lập {company?.foundedYear}</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span>{company?.stats.activeJobs} việc làm</span>
          </div> */}
        </div>

        {company?.benefits.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Phúc lợi:</h4>
            <div className="flex flex-wrap gap-1">
              {company?.benefits.slice(0, 3).map((benefit, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
              {company?.benefits.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{company?.benefits.length - 3} khác
                </Badge>
              )}
            </div>
          </div>
        )}

        {company?.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {company?.tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {company?.contact.website && (
              <Button variant="ghost" size="sm" asChild>
                <a href={company?.contact.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4" />
                </a>
              </Button>
            )}
            {company?.contact.phone && (
              <Button variant="ghost" size="sm" asChild>
                <a href={`tel:${company?.contact.phone}`}>
                  <Phone className="w-4 h-4" />
                </a>
              </Button>
            )}
            {company?.contact.email && (
              <Button variant="ghost" size="sm" asChild>
                <a href={`mailto:${company?.contact.email}`}>
                  <Mail className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
          <NavigationLink href={`/companies/${company?._id}`} className="block">
            <Button size="sm" className="cursor-pointer">
              Xem chi tiết
            </Button>
          </NavigationLink>
        </div>
      </CardFooter>
    </Card>
  );
}
