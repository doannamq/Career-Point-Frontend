import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CVData, CVBuilderState, TemplateType } from "@/types/cv";

const initialCVData: CVData = {
  id: "",
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
    profileImage: "",
    desiredPosition: "",
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
  createdAt: "",
  updatedAt: "",
};

interface CVStore extends CVBuilderState {
  // Actions
  updatePersonalInfo: (info: Partial<CVData["personalInfo"]>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<CVData["experiences"][0]>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<CVData["education"][0]>) => void;
  removeEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<CVData["skills"][0]>) => void;
  removeSkill: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<CVData["projects"][0]>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<CVData["certifications"][0]>) => void;
  removeCertification: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<CVData["languages"][0]>) => void;
  removeLanguage: (id: string) => void;
  addCustomSection: () => void;
  updateCustomSection: (id: string, data: Partial<CVData["customSections"][0]>) => void;
  removeCustomSection: (id: string) => void;
  setTemplate: (template: TemplateType) => void;
  setPreviewMode: (isPreview: boolean) => void;
  resetCV: () => void;
  loadCV: (data: CVData) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      cvData: initialCVData,
      selectedTemplate: "minimal",
      isPreviewMode: false,
      isDirty: false,

      updatePersonalInfo: (info) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            personalInfo: { ...state.cvData.personalInfo, ...info },
          },
          isDirty: true,
        })),

      addExperience: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experiences: [
              ...state?.cvData?.experiences,
              {
                id: generateId(),
                jobTitle: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                isCurrentJob: false,
                description: "",
                achievements: [],
              },
            ],
          },
          isDirty: true,
        })),

      updateExperience: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experiences: state.cvData.experiences.map((exp) => (exp.id === id ? { ...exp, ...data } : exp)),
          },
          isDirty: true,
        })),

      removeExperience: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experiences: state.cvData.experiences.filter((exp) => exp.id !== id),
          },
          isDirty: true,
        })),

      addEducation: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: [
              ...state.cvData.education,
              {
                id: generateId(),
                degree: "",
                institution: "",
                location: "",
                startDate: "",
                endDate: "",
                isCurrentStudy: false,
                gpa: "",
                description: "",
              },
            ],
          },
          isDirty: true,
        })),

      updateEducation: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.map((edu) => (edu.id === id ? { ...edu, ...data } : edu)),
          },
          isDirty: true,
        })),

      removeEducation: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.filter((edu) => edu.id !== id),
          },
          isDirty: true,
        })),

      addSkill: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: [
              ...state.cvData.skills,
              {
                id: generateId(),
                name: "",
                level: "Intermediate",
                category: "Technical",
              },
            ],
          },
          isDirty: true,
        })),

      updateSkill: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: state.cvData.skills.map((skill) => (skill.id === id ? { ...skill, ...data } : skill)),
          },
          isDirty: true,
        })),

      removeSkill: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: state.cvData.skills.filter((skill) => skill.id !== id),
          },
          isDirty: true,
        })),

      addProject: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: [
              ...state.cvData.projects,
              {
                id: generateId(),
                name: "",
                description: "",
                technologies: [],
                url: "",
                github: "",
                startDate: "",
                endDate: "",
              },
            ],
          },
          isDirty: true,
        })),

      updateProject: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.map((project) => (project.id === id ? { ...project, ...data } : project)),
          },
          isDirty: true,
        })),

      removeProject: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.filter((project) => project.id !== id),
          },
          isDirty: true,
        })),

      addCertification: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: [
              ...state.cvData.certifications,
              {
                id: generateId(),
                name: "",
                issuer: "",
                issueDate: "",
                expiryDate: "",
                credentialId: "",
                url: "",
              },
            ],
          },
          isDirty: true,
        })),

      updateCertification: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: state.cvData.certifications.map((cert) => (cert.id === id ? { ...cert, ...data } : cert)),
          },
          isDirty: true,
        })),

      removeCertification: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: state.cvData.certifications.filter((cert) => cert.id !== id),
          },
          isDirty: true,
        })),

      addLanguage: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: [
              ...state.cvData.languages,
              {
                id: generateId(),
                name: "",
                proficiency: "Conversational",
              },
            ],
          },
          isDirty: true,
        })),

      updateLanguage: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: state.cvData.languages.map((lang) => (lang.id === id ? { ...lang, ...data } : lang)),
          },
          isDirty: true,
        })),

      removeLanguage: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: state.cvData.languages.filter((lang) => lang.id !== id),
          },
          isDirty: true,
        })),

      addCustomSection: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            customSections: [
              ...state.cvData.customSections,
              {
                id: generateId(),
                title: "",
                content: "",
                type: "text",
                items: [],
              },
            ],
          },
          isDirty: true,
        })),

      updateCustomSection: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            customSections: state.cvData.customSections.map((section) =>
              section.id === id ? { ...section, ...data } : section
            ),
          },
          isDirty: true,
        })),

      removeCustomSection: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            customSections: state.cvData.customSections.filter((section) => section.id !== id),
          },
          isDirty: true,
        })),

      setTemplate: (template) =>
        set((state) => ({
          selectedTemplate: template,
          isDirty: true,
        })),

      setPreviewMode: (isPreview) =>
        set((state) => ({
          isPreviewMode: isPreview,
        })),

      resetCV: () =>
        set(() => ({
          cvData: initialCVData,
          selectedTemplate: "minimal",
          isPreviewMode: false,
          isDirty: false,
        })),

      loadCV: (data) =>
        set(() => ({
          cvData: data,
          isDirty: false,
        })),
    }),
    {
      name: "cv-builder-storage",
    }
  )
);
