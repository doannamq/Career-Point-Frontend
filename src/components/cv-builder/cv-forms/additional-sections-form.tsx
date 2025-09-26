"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCVStore } from "@/lib/store/cv-store";
import { LANGUAGE_PROFICIENCY } from "@/lib/constans/template";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";

export function AdditionalSectionsForm() {
  const {
    cvData,
    addCertification,
    updateCertification,
    removeCertification,
    addLanguage,
    updateLanguage,
    removeLanguage,
  } = useCVStore();
  const { certifications, languages } = cvData;
  const [expandedCerts, setExpandedCerts] = useState<Set<string>>(new Set());

  const toggleExpandedCert = (id: string) => {
    const newExpanded = new Set(expandedCerts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCerts(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Chứng chỉ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">Chứng chỉ</CardTitle>
            <Button onClick={addCertification} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm chứng chỉ
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {certifications?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chưa có chứng chỉ nào được thêm.</p>
              <p className="text-sm">Thêm chứng chỉ chuyên môn để củng cố hồ sơ của bạn.</p>
            </div>
          ) : (
            certifications?.map((cert, index) => (
              <Card key={cert.id} className="border-l-4 border-l-blue-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        Chứng chỉ #{index + 1}
                        {cert.name && ` - ${cert.name}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleExpandedCert(cert.id)}>
                        {expandedCerts.has(cert.id) ? "Thu gọn" : "Mở rộng"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(cert.id)}
                        className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {expandedCerts.has(cert.id) && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`certName-${cert.id}`} className="mb-2">
                          Tên chứng chỉ <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id={`certName-${cert.id}`}
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                          placeholder="AWS Certified Solutions Architect"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`certIssuer-${cert.id}`} className="mb-2">
                          Cơ quan cấp chứng chỉ <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id={`certIssuer-${cert.id}`}
                          value={cert.issuer}
                          onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                          placeholder="Amazon Web Services"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`certIssueDate-${cert.id}`} className="mb-2">
                          Ngày cấp
                        </Label>
                        <Input
                          id={`certIssueDate-${cert.id}`}
                          type="month"
                          value={cert.issueDate}
                          onChange={(e) => updateCertification(cert.id, { issueDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`certExpiryDate-${cert.id}`} className="mb-2">
                          Ngày hết hạn (Tùy chọn)
                        </Label>
                        <Input
                          id={`certExpiryDate-${cert.id}`}
                          type="month"
                          value={cert.expiryDate || ""}
                          onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`certCredentialId-${cert.id}`} className="mb-2">
                          ID chứng chỉ (Tùy chọn)
                        </Label>
                        <Input
                          id={`certCredentialId-${cert.id}`}
                          value={cert.credentialId || ""}
                          onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                          placeholder="ABC123456789"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`certUrl-${cert.id}`} className="mb-2">
                          Liên kết xác thực (Tùy chọn)
                        </Label>
                        <Input
                          id={`certUrl-${cert.id}`}
                          value={cert.url || ""}
                          onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                          placeholder="https://verify.example.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Ngoại ngữ
            </CardTitle>
            <Button onClick={addLanguage} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm Ngoại Ngữ
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {languages?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chưa có ngôn ngữ nào được thêm.</p>
              <p className="text-sm">Hãy thêm các ngôn ngữ bạn biết để làm nổi bật khả năng giao tiếp.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {languages?.map((language) => (
                <Card key={language.id} className="border-l-4 border-l-accent/30">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-6">
                        <Label htmlFor={`langName-${language.id}`} className="mb-2">
                          Ngôn ngữ
                        </Label>
                        <Input
                          id={`langName-${language.id}`}
                          value={language.name}
                          onChange={(e) => updateLanguage(language.id, { name: e.target.value })}
                          placeholder="English, Spanish, French..."
                        />
                      </div>
                      <div className="col-span-5">
                        <Label htmlFor={`langProficiency-${language.id}`}>Trình độ</Label>
                        <Select
                          value={language.proficiency}
                          onValueChange={(value) =>
                            updateLanguage(language.id, { proficiency: value as typeof language.proficiency })
                          }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGE_PROFICIENCY.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLanguage(language.id)}
                          className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
