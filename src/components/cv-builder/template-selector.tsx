"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CV_TEMPLATES } from "@/lib/constans/template";
import { useCVStore } from "@/lib/store/cv-store";
import { Check, ArrowRight } from "lucide-react";

export function TemplateSelector() {
  const { selectedTemplate, setTemplate } = useCVStore();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Bước 1: Chọn mẫu CV</h3>
        <p className="text-sm text-muted-foreground">Chọn mẫu CV phù hợp với ngành nghề và phong cách của bạn</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CV_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
            }`}
            onClick={() => setTemplate(template.id)}>
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-80 object-contain rounded-md mb-3"
                />
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{template.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Mẫu CV đã chọn: {CV_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      )}
    </div>
  );
}
