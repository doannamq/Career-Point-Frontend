export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
  profileImage?: string;
  desiredPosition?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentStudy: boolean;
  gpa?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category: "Technical" | "Soft" | "Language" | "Other";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
}

export interface CVData {
  id: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  type: "text" | "list";
  items?: string[];
}

export type TemplateType = "minimal" | "modern" | "creative" | "corporate";

export interface CVTemplate {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
  category: "Professional" | "Creative" | "Academic" | "Technical";
}

export interface CVBuilderState {
  cvData: CVData;
  selectedTemplate: TemplateType;
  isPreviewMode: boolean;
  isDirty: boolean;
}
