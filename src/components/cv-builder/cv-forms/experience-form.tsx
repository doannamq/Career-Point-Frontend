"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCVStore } from "@/lib/store/cv-store";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";

export function ExperienceForm() {
  const { cvData, addExperience, updateExperience, removeExperience } = useCVStore();
  const { experiences } = cvData;
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const addAchievement = (expId: string) => {
    const experience = experiences.find((exp) => exp.id === expId);
    if (experience) {
      updateExperience(expId, {
        achievements: [...experience.achievements, ""],
      });
    }
  };

  const updateAchievement = (expId: string, achievementIndex: number, value: string) => {
    const experience = experiences.find((exp) => exp.id === expId);
    if (experience) {
      const newAchievements = [...experience.achievements];
      newAchievements[achievementIndex] = value;
      updateExperience(expId, { achievements: newAchievements });
    }
  };

  const removeAchievement = (expId: string, achievementIndex: number) => {
    const experience = experiences.find((exp) => exp.id === expId);
    if (experience) {
      const newAchievements = experience.achievements.filter((_, index) => index !== achievementIndex);
      updateExperience(expId, { achievements: newAchievements });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">Kinh nghiệm</CardTitle>
          <Button onClick={addExperience} size="sm" className="gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Thêm kinh nghiệm
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {experiences?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có kinh nghiệm làm việc nào được thêm.</p>
            <p className="text-sm">Click "Thêm kinh nghiệm" để bắt đầu.</p>
          </div>
        ) : (
          experiences?.map((experience, index) => (
            <Card key={experience.id} className="border-l-4 border-l-blue-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      Kinh nghiệm #{index + 1}
                      {experience.jobTitle && ` - ${experience.jobTitle}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(experience.id)}
                      className="cursor-pointer">
                      {expandedItems.has(experience.id) ? "Thu gọn" : "Mở rộng"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(experience.id)}
                      className="text-destructive hover:text-destructive cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedItems.has(experience.id) && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`jobTitle-${experience.id}`} className="mb-2">
                        Vị trí công việc <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id={`jobTitle-${experience.id}`}
                        value={experience.jobTitle}
                        onChange={(e) => updateExperience(experience.id, { jobTitle: e.target.value })}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`company-${experience.id}`} className="mb-2">
                        Công ty <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id={`company-${experience.id}`}
                        value={experience.company}
                        onChange={(e) => updateExperience(experience.id, { company: e.target.value })}
                        placeholder="Tech Corp"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`location-${experience.id}`} className="mb-2">
                      Địa điểm
                    </Label>
                    <Input
                      id={`location-${experience.id}`}
                      value={experience.location}
                      onChange={(e) => updateExperience(experience.id, { location: e.target.value })}
                      placeholder="Hà Nội, Việt Nam"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`startDate-${experience.id}`} className="mb-2">
                        Ngày bắt đầu
                      </Label>
                      <Input
                        id={`startDate-${experience.id}`}
                        type="month"
                        value={experience.startDate}
                        onChange={(e) => updateExperience(experience.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${experience.id}`} className="mb-2">
                        Ngày kết thúc
                      </Label>
                      <Input
                        id={`endDate-${experience.id}`}
                        type="month"
                        value={experience.endDate}
                        onChange={(e) => updateExperience(experience.id, { endDate: e.target.value })}
                        disabled={experience.isCurrentJob}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`currentJob-${experience.id}`}
                      checked={experience.isCurrentJob}
                      onCheckedChange={(checked) =>
                        updateExperience(experience.id, { isCurrentJob: checked as boolean })
                      }
                    />
                    <Label htmlFor={`currentJob-${experience.id}`}>Tôi hiện đang làm việc ở đây</Label>
                  </div>

                  <div>
                    <Label htmlFor={`description-${experience.id}`} className="mb-2">
                      Mô tả công việc
                    </Label>
                    <Textarea
                      id={`description-${experience.id}`}
                      value={experience.description}
                      onChange={(e) => updateExperience(experience.id, { description: e.target.value })}
                      placeholder="Mô tả vai trò và trách nhiệm của bạn..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Thành tựu nổi bật</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addAchievement(experience.id)}
                        className="gap-2">
                        <Plus className="w-3 h-3" />
                        Thêm thành tựu
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {experience.achievements.map((achievement, achievementIndex) => (
                        <div key={achievementIndex} className="flex gap-2">
                          <Input
                            value={achievement}
                            onChange={(e) => updateAchievement(experience.id, achievementIndex, e.target.value)}
                            placeholder="Mô tả một thành tựu hoặc thành tích nổi bật..."
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAchievement(experience.id, achievementIndex)}
                            className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
