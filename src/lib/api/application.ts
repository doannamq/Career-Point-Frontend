import apiClient from "./axios-config";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";

const getMyApplications = async (accessToken: string) => {
  try {
    const response = await apiClient.get(`${API_URL}/applications/my-applications`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getApplicationBatch = async (accessToken: string, userId: string, jobIds: string[]) => {
  try {
    const response = await apiClient.post(
      `${API_URL}/applications/batch`,
      { userId, jobIds },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error get application batch", error);
    throw error;
  }
};

const updateApplicationStatus = async (
  accessToken: string,
  applicationId: string,
  status: "Pending" | "In Review" | "Interview Scheduled" | "Rejected" | "Accepted",
  notes?: string
) => {
  try {
    const response = await apiClient.patch(
      `${API_URL}/applications/${applicationId}/status`,
      { status, notes },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error updating application status", error);
    throw error;
  }
};

const getApplicationsByApplicants = async (accessToken: string, jobId: string, applicantIds: string[]) => {
  try {
    const response = await apiClient.post(
      `${API_URL}/applications//batch-by-applicants`,
      { jobId, applicantIds },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching applications by applicants", error);
    throw error;
  }
};

const getApplicantsForJobs = async (accessToken: string, jobIds: string[]) => {
  try {
    const response = await apiClient.post(
      `${API_URL}/applications/batch-applicants`,
      { jobIds },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching applicants for jobs", error);
    throw error;
  }
};

export {
  getMyApplications,
  getApplicationBatch,
  updateApplicationStatus,
  getApplicationsByApplicants,
  getApplicantsForJobs,
};
