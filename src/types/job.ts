export interface Job {
  _id: string;
  jobId: string;
  title: string;
  slug: string;
  description: string;
  company: string;
  companyName: string;
  location: string;
  salary: number;
  experience: string;
  skills: string[];
  benefits: string[];
  applicationDeadline: string;
  jobType: string;
  postedBy: string;
  applicants: string[];
  status: string;
  isFeatured: boolean;
  isHot: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Applicant {
  _id: string;
  jobId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  resumeUrl: string;
  coverLetter: string;
  appliedDate: string;
}
