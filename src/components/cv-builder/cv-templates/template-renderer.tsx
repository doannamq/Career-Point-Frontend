import type { CVData, TemplateType } from "@/types/cv";
import { MinimalTemplate } from "./minimal-template";
import { ModernTemplate } from "./modern-template";
import { CreativeTemplate } from "./creative-template";
import { CorporateTemplate } from "./corporate-template";

interface TemplateRendererProps {
  data: CVData;
  template: TemplateType;
  className?: string;
}

export function TemplateRenderer({ data, template, className }: TemplateRendererProps) {
  const renderTemplate = () => {
    switch (template) {
      case "minimal":
        return <MinimalTemplate data={data} />;
      case "modern":
        return <ModernTemplate data={data} />;
      case "creative":
        return <CreativeTemplate data={data} />;
      case "corporate":
        return <CorporateTemplate data={data} />;
      default:
        return <MinimalTemplate data={data} />;
    }
  };

  return <div className={className}>{renderTemplate()}</div>;
}
