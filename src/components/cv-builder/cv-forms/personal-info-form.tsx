"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCVStore } from "@/lib/store/cv-store";
import { useRef } from "react";
import { User } from "lucide-react";

export function PersonalInfoForm() {
  const { cvData, updatePersonalInfo } = useCVStore();
  const { personalInfo } = cvData;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="flex items-center gap-2 text-xl">Thông tin cá nhân</CardTitle>
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full border-4 border-white overflow-hidden cursor-pointer">
            {personalInfo?.profileImage ? (
              <img
                src={personalInfo?.profileImage}
                alt={personalInfo?.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                <User />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 text-center mt-1">Ảnh đại diện</p>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="mb-2">
              Họ tên <span className="text-red-600">*</span>
            </Label>
            <Input
              id="fullName"
              value={personalInfo.fullName}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
              placeholder="Doan Phuong Nam"
            />
          </div>
          <div>
            <Label htmlFor="desiredPosition" className="mb-2">
              Vị trí ứng tuyển<span className="text-red-600">*</span>
            </Label>
            <Input
              id="desiredPosition"
              value={personalInfo?.desiredPosition}
              onChange={(e) => updatePersonalInfo({ desiredPosition: e.target.value })}
              placeholder="e.g. Software Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="mb-2">
              Số điện thoại <span className="text-red-600">*</span>
            </Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="email" className="mb-2">
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location" className="mb-2">
              Địa chỉ
            </Label>
            <Input
              id="location"
              value={personalInfo.location}
              onChange={(e) => updatePersonalInfo({ location: e.target.value })}
              placeholder="Cầu Giấy, Hà Nội"
            />
          </div>
          <div>
            <Label htmlFor="website" className="mb-2">
              Website
            </Label>
            <Input
              id="website"
              value={personalInfo.website}
              onChange={(e) => updatePersonalInfo({ website: e.target.value })}
              placeholder="https://phuong-nam.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin" className="mb-2">
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/phuong-nam"
            />
          </div>
          <div>
            <Label htmlFor="github" className="mb-2">
              GitHub
            </Label>
            <Input
              id="github"
              value={personalInfo.github}
              onChange={(e) => updatePersonalInfo({ github: e.target.value })}
              placeholder="https://github.com/phuong-nam"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="summary" className="mb-2">
            Profile
          </Label>
          <Textarea
            id="summary"
            value={personalInfo.summary}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            placeholder="Mô tả ngắn gọn về nền tảng nghề nghiệp và mục tiêu sự nghiệp của bạn..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
