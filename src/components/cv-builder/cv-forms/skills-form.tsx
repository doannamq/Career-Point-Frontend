"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCVStore } from "@/lib/store/cv-store";
import { SKILL_LEVELS, SKILL_CATEGORIES } from "@/lib/constans/template";
import { Plus, Trash2 } from "lucide-react";

export function SkillsForm() {
  const { cvData, addSkill, updateSkill, removeSkill } = useCVStore();
  const { skills } = cvData;

  const skillsByCategory = SKILL_CATEGORIES.reduce((acc, category) => {
    acc[category] = skills?.filter((skill) => skill.category === category);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">Kỹ năng</CardTitle>
          <Button onClick={addSkill} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm kỹ năng
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {skills?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có kỹ năng nào được thêm.</p>
            <p className="text-sm">Nhấn "Thêm kỹ năng" để bắt đầu.</p>
          </div>
        ) : (
          SKILL_CATEGORIES.map((category) => {
            const categorySkills = skillsByCategory[category];
            if (categorySkills?.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  Kỹ năng {category}
                </h3>
                <div className="space-y-3">
                  {categorySkills?.map((skill) => (
                    <Card key={skill.id} className="border-l-4 border-l-accent/30">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-5">
                            <Label htmlFor={`skillName-${skill.id}`} className="mb-2">
                              Tên kỹ năng
                            </Label>
                            <Input
                              id={`skillName-${skill.id}`}
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                              placeholder="JavaScript, Communication, etc."
                            />
                          </div>
                          <div className="col-span-3">
                            <Label htmlFor={`skillLevel-${skill.id}`} className="mb-2">
                              Trình độ
                            </Label>
                            <Select
                              value={skill.level}
                              onValueChange={(value) => updateSkill(skill.id, { level: value as typeof skill.level })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trình độ" />
                              </SelectTrigger>
                              <SelectContent>
                                {SKILL_LEVELS.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-3">
                            <Label htmlFor={`skillCategory-${skill.id}`} className="mb-2">
                              Danh mục
                            </Label>
                            <Select
                              value={skill.category}
                              onValueChange={(value) =>
                                updateSkill(skill.id, { category: value as typeof skill.category })
                              }>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                              </SelectTrigger>
                              <SelectContent>
                                {SKILL_CATEGORIES.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill(skill.id)}
                              className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
