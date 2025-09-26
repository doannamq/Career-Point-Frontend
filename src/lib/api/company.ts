import type { CompanyFormData } from "@/app/(public)/companies/new/page";
import type { Company } from "@/types/company";
import { NotificationAction } from "@/types/notification";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";

type CompanySearchParams = {
  query?: string;
  industry?: string;
  isVerified?: boolean;
  page?: number;
  limit?: number;
};

type CompanySearchResponse = {
  success: boolean;
  message: string;
  data: {
    companies: Company[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};

//create company
const createCompany = async (data: CompanyFormData, accessToken: string) => {
  try {
    const res = await axios.post(`${API_URL}/company`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.log("Error creating company");
  }
};

//get all company
const getAllCompany = async (page = 1, limit = 10, query?: string, status?: string) => {
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

    const response = await axios.get(`${API_URL}/company?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//verify company
const verifyCompany = async (accessToken: string, companyId: string) => {
  try {
    const response = await axios.patch(
      `${API_URL}/company/${companyId}/verify`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//reject company
const rejectCompany = async (accessToken: string, companyId: string) => {
  try {
    const response = await axios.patch(
      `${API_URL}/company/${companyId}/reject`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//search company
const searchCompany = async (params: CompanySearchParams): Promise<CompanySearchResponse | null> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.query) queryParams.append("query", params.query);
    if (params.industry) queryParams.append("industry", params.industry);
    if (params.isVerified !== undefined) queryParams.append("isVerified", params.isVerified ? "true" : "false");
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const url = `${API_URL}/company/search?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search companies");
    }

    const data: CompanySearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching companies:", error);
    return null;
  }
};

//get company detail by id
const getCompanyById = async (companyId: string) => {
  try {
    const response = await axios.get(`${API_URL}/company/${companyId}`);
    if (!response.data.success) {
      throw new Error("Failed to fetch company");
    }

    const data = response.data;
    return data;
  } catch (error) {
    console.log("Error get company detail by id", error);
    return null;
  }
};

//get company status
const getCompanyStatus = async (companyId: string, accessToken: string) => {
  try {
    const response = await axios.get(`${API_URL}/company/${companyId}/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.data.success) {
      throw new Error("Failed to get company stauts");
    }

    const data = response.data;
    return data;
  } catch (error) {
    console.log("Error get company status", error);
    return null;
  }
};

//get company for posting job
const getCompanyForPostingJob = async (companyId: string, accessToken: string) => {
  try {
    const response = await axios.get(`${API_URL}/company/${companyId}/for-posting`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.data.success) {
      throw new Error("Fail to get company data for posting job");
    }

    const data = response.data;
    return data;
  } catch (error) {
    console.log("Error get company for posting job", error);
    return null;
  }
};

// invite user to join company with email
const inviteUserToJoinCompany = async (companyId: string, accessToken: string, userEmail: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/company/${companyId}/invite`,
      { userEmail },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error invite user to join company", error);
    throw error;
  }
};

// user accept invite to join company
const acceptInviteToJoinCompany = async (accessToken: string, action: NotificationAction) => {
  try {
    const response = await axios.patch(
      API_URL + action.url,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error accept invite to join company", error);
    throw error;
  }
};

// user reject invite to join company
const rejectInviteToJoinCompany = async (accessToken: string, action: NotificationAction) => {
  try {
    const response = await axios.delete(API_URL + action.url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error reject invite to join company", error);
    throw error;
  }
};

//request to join company
const requestJoinCompany = async (companyId: string, accessToken: string, userEmail: string) => {
  console.log("userEmail", userEmail);
  try {
    const response = await axios.post(
      `${API_URL}/company/${companyId}/join`,
      { userEmail },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.data.success) {
      throw new Error("Error request to join company");
    }

    return response.data;
  } catch (error) {
    console.log("Error request join company", error);
    throw error;
  }
};

//accept member join company
const acceptJoinRequest = async (companyId: string, memberId: string, accessToken: string) => {
  try {
    const response = await axios.patch(
      `${API_URL}/company/${companyId}/members/${memberId}/accept`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.data.success) {
      throw new Error("Error accept join company request");
    }

    return response.data;
  } catch (error) {
    console.log("Error accept join company request", error);
    throw error;
  }
};

// update subscription
const updateSubscription = async (companyId: string, accessToken: string, plan: string, billingCycle: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/company/update-subscription`,
      { companyId, plan, billingCycle },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error update subscription:", error);
    throw error;
  }
};

// get subscription history
const getSubscriptionHistory = async (companyId: string, accessToken: string) => {
  try {
    const response = await axios.get(`${API_URL}/company/${companyId}/subscription-history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.data.success) {
      throw new Error("Failed to get company stauts");
    }

    const data = response.data;
    return data;
  } catch (error) {
    console.log("Error get company status", error);
    return null;
  }
};

export {
  createCompany,
  getAllCompany,
  verifyCompany,
  rejectCompany,
  searchCompany,
  getCompanyById,
  getCompanyStatus,
  getCompanyForPostingJob,
  inviteUserToJoinCompany,
  acceptInviteToJoinCompany,
  rejectInviteToJoinCompany,
  requestJoinCompany,
  acceptJoinRequest,
  updateSubscription,
  getSubscriptionHistory,
};
