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

export function EducationForm() {
  const { cvData, addEducation, updateEducation, removeEducation } = useCVStore();
  const { education } = cvData;
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">Học vấn</CardTitle>
          <Button onClick={addEducation} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm Học Vấn
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {education?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có học vấn nào được thêm.</p>
            <p className="text-sm">Click "Thêm Học Vấn" để bắt đầu.</p>
          </div>
        ) : (
          education?.map((edu, index) => (
            <Card key={edu.id} className="border-l-4 border-l-blue-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      Học vấn #{index + 1}
                      {edu.degree && ` - ${edu.degree}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleExpanded(edu.id)}>
                      {expandedItems.has(edu.id) ? "Thu gọn" : "Mở rộng"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                      className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedItems.has(edu.id) && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`degree-${edu.id}`} className="mb-2">
                        Bằng cấp <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id={`degree-${edu.id}`}
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder="Kỹ sư Khoa Học Máy Tính"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`institution-${edu.id}`} className="mb-2">
                        Đại học / Trường Đại Học / Cơ Sở Đào Tạo <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id={`institution-${edu.id}`}
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        placeholder="Trường Đại học Điện Lực"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`eduLocation-${edu.id}`} className="mb-2">
                      Địa điểm
                    </Label>
                    <Input
                      id={`eduLocation-${edu.id}`}
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                      placeholder="236 Hoàng Quốc Việt, Bắc Từ Liêm, Hà Nội"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`eduStartDate-${edu.id}`} className="mb-2">
                        Bắt đầu
                      </Label>
                      <Input
                        id={`eduStartDate-${edu.id}`}
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`eduEndDate-${edu.id}`} className="mb-2">
                        Kết thúc
                      </Label>
                      <Input
                        id={`eduEndDate-${edu.id}`}
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        disabled={edu.isCurrentStudy}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`currentStudy-${edu.id}`}
                      checked={edu.isCurrentStudy}
                      onCheckedChange={(checked) => updateEducation(edu.id, { isCurrentStudy: checked as boolean })}
                    />
                    <Label htmlFor={`currentStudy-${edu.id}`}>Tôi hiện đang học tại đây</Label>
                  </div>

                  <div>
                    <Label htmlFor={`gpa-${edu.id}`} className="mb-2">
                      GPA (Tuỳ chọn)
                    </Label>
                    <Input
                      id={`gpa-${edu.id}`}
                      value={edu.gpa || ""}
                      onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      placeholder="3.8/4.0"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`eduDescription-${edu.id}`} className="mb-2">
                      Mô tả (Tuỳ chọn)
                    </Label>
                    <Textarea
                      id={`eduDescription-${edu.id}`}
                      value={edu.description || ""}
                      onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                      placeholder="Các môn học liên quan, hoạt động ngoại khóa, thành tích..."
                      rows={3}
                    />
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
