// API functions for fetching jobs

import axios from "axios";
import { getCompanyById } from "./company";
import { Job } from "@/types/job";

type JobsResponse = {
  success: boolean;
  message: string;
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
};

type JobResponse = {
  success: boolean;
  message: string;
  job: Job;
};

type CreateJobResponse = {
  success: boolean;
  message: string;
  newJob: Job;
};

type ApiResponse = {
  success: boolean;
  message: string;
};

type SearchParams = {
  query?: string;
  location?: string;
  jobType?: string;
  minSalary?: number;
  maxSalary?: number;
  experience?: string;
  skills?: string[];
  sortBy?: "score" | "salary" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

type SearchResponse = {
  success: boolean;
  message: string;
  data: {
    results: Job[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};

// Base API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";

async function fetchWithRateLimit(url: string, options?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(url, options);

    // Handle rate limiting
    if (response.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
      throw new Error("Too many requests. Please try again later.");
    }

    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

//get home jobs
export async function getHomeJobs() {
  try {
    const response = await fetchWithRateLimit(`${API_URL}/jobs/?page=1&limit=4`);
    const data = await response.json();

    return data.jobs;
  } catch (error) {
    console.log(error);
    return null;
  }
}

//get all jobs
export const getAllJobs = async (page = 1, limit = 10, query?: string, status?: string) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (query) {
      queryParams.append("query", query);
    }

    if (status && status !== "all") {
      queryParams.append("status", status);
    }

    const response = await fetchWithRateLimit(`${API_URL}/jobs/?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Function to search jobs with filters
export async function searchJobs(params: SearchParams): Promise<SearchResponse | null> {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    if (params.query) queryParams.append("query", params.query);
    if (params.location) queryParams.append("location", params.location);
    if (params.jobType) queryParams.append("jobType", params.jobType);
    if (params.minSalary) queryParams.append("minSalary", params.minSalary.toString());
    if (params.maxSalary) queryParams.append("maxSalary", params.maxSalary.toString());
    if (params.experience) queryParams.append("experience", params.experience);
    if (params.skills && params.skills.length > 0) queryParams.append("skills", params.skills.join(","));
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const url = `${API_URL}/search/jobs?${queryParams.toString()}`;
    const response = await fetchWithRateLimit(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search jobs");
    }

    const data: SearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching jobs:", error);
    return null;
  }
}

// Function to fetch a job by slug
export async function getJobBySlug(slug: string): Promise<Job | null> {
  try {
    const response = await fetchWithRateLimit(`${API_URL}/jobs/${slug}`);

    if (!response.ok) {
      throw new Error("Failed to fetch job");
    }

    const data: JobResponse = await response.json();
    return data.job;
  } catch (error) {
    console.error(`Error fetching job with slug ${slug}:`, error);
    return null;
  }
}

// Get similar jobs
export async function getSimilarJobs(slug: string) {
  try {
    const response = await axios.get(`${API_URL}/jobs/similar/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching similar jobs:", error);
    throw error;
  }
}

// Get applicants for a job
export async function getJobApplicants(slug: string, accessToken: string) {
  try {
    const response = await fetchWithRateLimit(`${API_URL}/applications/job/${slug}/applicants`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch job applicants");
    }

    const data = await response.json();
    return data.applicants;
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    return null;
  }
}

// Function to check if user has applied for a job
export async function checkAppliedJob(slug: string, accessToken: string) {
  try {
    const response = await fetchWithRateLimit(`${API_URL}/jobs/${slug}/check-applied`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to check applied job");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking applied job:", error);
    throw error;
  }
}

// Function to create a new job
export async function createJob(
  jobData: {
    title: string;
    description: string;
    company: string;
    companyName: string;
    location: string;
    salary: number;
    experience: string;
    skills: string[];
    jobType: string;
  },
  accessToken: string
): Promise<CreateJobResponse> {
  try {
    const response = await fetchWithRateLimit(`${API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(jobData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create job");
    }

    return data;
  } catch (error) {
    console.error("Error creating job:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create job",
      newJob: {} as Job,
    };
  }
}

// Function to apply for a job
export async function applyForJob({
  slug,
  accessToken,
  coverLetter,
  file,
  resumeUrl,
  userName,
  userEmail,
  userPhoneNumber,
}: {
  slug: string;
  accessToken: string;
  coverLetter: string;
  file?: File;
  resumeUrl?: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
}): Promise<ApiResponse> {
  try {
    let response;

    if (file) {
      // Trường hợp upload CV mới
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      formData.append("resume", file);
      formData.append("userName", userName);
      formData.append("userEmail", userEmail);
      formData.append("userPhoneNumber", userPhoneNumber || "");

      response = await fetch(`${API_URL}/jobs/${slug}/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
    } else if (resumeUrl) {
      // Trường hợp dùng CV có sẵn
      response = await fetch(`${API_URL}/jobs/${slug}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          coverLetter,
          resumeUrl,
          userName,
          userEmail,
          userPhoneNumber,
        }),
      });
    } else {
      throw new Error("Resume file or URL is required");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to apply for job");
    }

    return data;
  } catch (error) {
    console.error("Error applying for job:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to apply for job",
    };
  }
}

//Function to get my posted job
export async function getMyPostedJob(accessToken: string) {
  try {
    const response = await fetchWithRateLimit(`${API_URL}/jobs/posted-job/my-posted-job`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to apply for job");
    }

    return data;
  } catch (error) {
    console.error("Error get my posted job:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get my posted job",
    };
  }
}

//Approve job
export async function approveJob(accessToken: string, jobId: string) {
  try {
    const response = await fetchWithRateLimit(`${API_URL}/jobs/${jobId}/approve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to approve job");
    }

    return data;
  } catch (error) {
    console.error("Error approving job:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to approve job",
    };
  }
}

//Reject job
export async function rejectJob(accessToken: string, jobId: string) {
  try {
    const response = await fetchWithRateLimit(`${API_URL}/jobs/${jobId}/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reject job");
    }

    return data;
  } catch (error) {
    console.error("Error rejecting job:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to reject job",
    };
  }
}
// Format salary to display in a readable format
export function formatSalary(salary: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(salary);
}

// Calculate time since job was posted
export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const postedDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - postedDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Vừa xong";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "phút" : "phút"} trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "giờ" : "giờ"} trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "ngày" : "ngày"} trước`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} ${diffInMonths === 1 ? "tháng" : "tháng"} trước`;
}

// Format date to display in a readable format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

//Format company name
export async function formatCompanyName(companyId: string) {
  try {
    const response = await getCompanyById(companyId);
    if (!response?.success) {
      throw new Error("Failed to format company name");
    }
    return response?.company?.name;
  } catch (error) {
    console.log("Error format company name", error);
  }
}

//Format company address
export async function formatCompanyAddress(companyId: string) {
  try {
    const response = await getCompanyById(companyId);
    if (!response?.success) {
      throw new Error("Failed to format company address");
    }
    return response?.company?.address;
  } catch (error) {
    console.log("Error format company address", error);
  }
}

//Get Provinces
export async function fetchProvinces(query: string) {
  try {
    const res = await axios.get(
      `https://open.oapi.vn/location/provinces?page=0&size=30&query=${encodeURIComponent(query)}`
    );
    return res.data;
  } catch (error) {
    console.log("Fetch provinces error:", error);
    return { data: [] };
  }
}

//Get Districts
export async function fetchDistricts(provinceId: string, query: string = "") {
  try {
    const res = await axios.get(
      `https://open.oapi.vn/location/districts/${provinceId}?page=0&size=30&query=${encodeURIComponent(query)}`
    );
    return res.data;
  } catch (error) {
    console.log("Fetch districts error:", error);
    return { data: [] };
  }
}

//Get Wards
export async function fetchWards(districtId: string, query: string = "") {
  try {
    const res = await axios.get(
      `https://open.oapi.vn/location/wards/${districtId}?page=0&size=30&query=${encodeURIComponent(query)}`
    );
    return res.data;
  } catch (error) {
    console.log("Fetch wards error:", error);
    return { data: [] };
  }
}

//get jobs by company id
export async function getJobsByCompanyId(companyId: string) {
  try {
    const response = await axios.get(`${API_URL}/jobs/${companyId}/jobs-company`);
    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || "Failed to get jobs by company id");
    }

    return data;
  } catch (error) {
    console.log("Error get jobs by company id", error);
    return null;
  }
}

// Get jobs by category
export async function getJobsByCategory(categoryName: string) {
  try {
    const response = await axios.get(`${API_URL}/jobs/category/${categoryName}`);
    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || "Failed to get jobs by category");
    }

    return data;
  } catch (error) {
    console.error("Error get jobs by category", error);
    return null;
  }
}

// Mark job as featured
export async function markJobAsFeatured(accessToken: string, jobId: string) {
  try {
    const response = await axios.patch(
      `${API_URL}/jobs/${jobId}/mark-featured`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error marking job as featured:", error);
    throw error;
  }
}
