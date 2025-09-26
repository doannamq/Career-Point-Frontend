import type { CVTemplate } from "../../types/cv";

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Thiết kế sạch sẽ và đơn giản, tập trung vào nội dung",
    preview: "/images/minimal_cv_template.avif",
    category: "Professional",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Thiết kế hiện đại với kiểu chữ nổi bật và màu sắc ấn tượng",
    preview: "/images/modern_cv_template.avif",
    category: "Professional",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bố cục độc đáo với yếu tố sáng tạo và điểm nhấn trực quan",
    preview: "/images/creative_cv_template.jpg",
    category: "Creative",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Bố cục chuyên nghiệp truyền thống dành cho các vị trí doanh nghiệp",
    preview: "/images/corporate_cv_template.webp",
    category: "Professional",
  },
];

export const JOB_CATEGORIES = [
  "Technology",
  "Marketing",
  "Sales",
  "Design",
  "Finance",
  "Healthcare",
  "Education",
  "Engineering",
  "Legal",
  "Other",
] as const;

export const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

export const SKILL_CATEGORIES = ["Technical", "Soft", "Language", "Other"] as const;

export const LANGUAGE_PROFICIENCY = ["Basic", "Conversational", "Fluent", "Native"] as const;
