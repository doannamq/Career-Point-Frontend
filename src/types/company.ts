export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
  // country: string;
  _id: string;
}

export interface Contact {
  email: string;
  phone: string;
  website: string;
  _id: string;
}

export interface SocialMedia {
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface Stats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  profileViews: number;
}

export interface Subscription {
  plan: string;
  jobPostLimit: number;
  featuredJobsLimit: number;
  startDate: string;
}

export interface RecruitmentContact {
  name: string;
  email: string;
  phone: string;
}

export interface CompanyMembers {
  userId: string;
  userName: string;
  role: string;
  permissions: string[];
  status: string;
  _id: string;
  joinedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  businessCode: string;
  taxCode: string;
  industry: string;
  companySize: string;
  companyType: string;
  description: string;
  foundedYear: number;
  address: Address;
  contact: Contact;
  logo: string;
  coverImage: string;
  socialMedia: SocialMedia;
  stats: Stats;
  subscription: Subscription;
  recruitmentContact: RecruitmentContact;
  status: string;
  isVerified: boolean;
  benefits: string[];
  workingHours: string;
  tags: string[];
  isActive: boolean;
  notes: string;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  companyAge: number;
  fullAddress: string;
  memberCount: number;
  members: CompanyMembers[];
  isSubscriptionActive: boolean;
  id: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CompanySearchResponse {
  success: boolean;
  message: string;
  data: {
    companies: Company[];
    pagination: Pagination;
  };
}

export interface CompanySearchParams {
  query?: string;
  industry?: string;
  isVerified?: boolean;
  page?: number;
  limit?: number;
}
