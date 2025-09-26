import apiClient from "./axios-config";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";

const saveUnsaveJob = async (jobId: string, accessToken: string) => {
  const response = await apiClient.post(
    `${API_URL}/saved-jobs/${jobId}/save-unsave`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response;
};

const checkSavedStatus = async (jobId: string, accessToken: string) => {
  const response = await apiClient.get(`${API_URL}/saved-jobs/${jobId}/saved`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

const getSavedJobs = async (accessToken: string) => {
  try {
    const response = await apiClient.get(`${API_URL}/saved-jobs`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = response;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getSavedJobBatch = async (accessToken: string, userId: string, jobIds: string[]) => {
  try {
    const response = await apiClient.post(
      `${API_URL}/saved-jobs/batch`,
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
    console.log("Error get saved job batch", error);
    throw error;
  }
};

export { saveUnsaveJob, checkSavedStatus, getSavedJobs, getSavedJobBatch };
