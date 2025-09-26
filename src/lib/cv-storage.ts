import type { CVData } from "@/types/cv";

export interface SavedCV {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: CVData;
}

const CV_STORAGE_KEY = "saved_cvs";

export class CVStorage {
  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static getAllCVs(): SavedCV[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(CV_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading CVs:", error);
      return [];
    }
  }

  static saveCV(cvData: Omit<CVData, "id" | "createdAt" | "updatedAt">, name?: string): string {
    const cvs = this.getAllCVs();
    const now = new Date().toISOString();
    const id = this.generateId();

    const fullCVData: CVData = {
      ...cvData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const savedCV: SavedCV = {
      id,
      name: name || cvData.personalInfo.fullName || `CV ${cvs.length + 1}`,
      createdAt: now,
      updatedAt: now,
      data: fullCVData,
    };

    cvs.push(savedCV);
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvs));
    return id;
  }

  static updateCV(id: string, cvData: Omit<CVData, "id" | "createdAt" | "updatedAt">, name?: string): boolean {
    const cvs = this.getAllCVs();
    const index = cvs.findIndex((cv) => cv.id === id);

    if (index === -1) return false;

    const now = new Date().toISOString();
    const existingCV = cvs[index];

    const updatedCVData: CVData = {
      ...cvData,
      id,
      createdAt: existingCV.data.createdAt,
      updatedAt: now,
    };

    cvs[index] = {
      ...existingCV,
      name: name || cvData.personalInfo.fullName || existingCV.name,
      updatedAt: now,
      data: updatedCVData,
    };

    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvs));
    return true;
  }

  static getCV(id: string): SavedCV | null {
    const cvs = this.getAllCVs();
    return cvs.find((cv) => cv.id === id) || null;
  }

  static deleteCV(id: string): boolean {
    const cvs = this.getAllCVs();
    const filteredCVs = cvs.filter((cv) => cv.id !== id);

    if (filteredCVs.length === cvs.length) return false;

    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(filteredCVs));
    return true;
  }

  static duplicateCV(id: string): string | null {
    const cv = this.getCV(id);
    if (!cv) return null;

    const newId = this.saveCV(cv.data, `${cv.name} (Copy)`);
    return newId;
  }
}
