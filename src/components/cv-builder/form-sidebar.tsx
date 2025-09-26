"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./cv-forms/personal-info-form";
import { ExperienceForm } from "./cv-forms/experience-form";
import { EducationForm } from "./cv-forms/education-form";
import { SkillsForm } from "./cv-forms/skills-form";
import { ProjectsForm } from "./cv-forms/projects-form";
import { AdditionalSectionsForm } from "./cv-forms/additional-sections-form";
import { TemplateSelector } from "./template-selector";
import { User, GraduationCap, Zap, FolderOpen, Award, Palette, BriefcaseBusiness } from "lucide-react";

export function FormSidebar() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-foreground">CV Builder</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Bước 1: Chọn template → Bước 2: Điền thông tin → Bước 3: Tải PDF
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs defaultValue="template" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="template" className="gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden lg:inline">Template</span>
              </TabsTrigger>
              <TabsTrigger value="personal" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">Thông tin</span>
              </TabsTrigger>
              <TabsTrigger value="experience" className="gap-2">
                <BriefcaseBusiness className="w-4 h-4" />
                <span className="hidden lg:inline">Kinh nghiệm</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden lg:inline">Học vấn</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-2">
                <Zap className="w-4 h-4" />
                <span className="hidden lg:inline">Kỹ năng</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2">
                <FolderOpen className="w-4 h-4" />
                <span className="hidden lg:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="additional" className="gap-2">
                <Award className="w-4 h-4" />
                <span className="hidden lg:inline">Thêm</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-6">
              <TemplateSelector />
            </TabsContent>

            <TabsContent value="personal" className="space-y-6">
              <PersonalInfoForm />
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <ExperienceForm />
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <EducationForm />
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <SkillsForm />
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <ProjectsForm />
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <AdditionalSectionsForm />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
