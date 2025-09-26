import apiClient from "./axios-config";

const getProfile = async (accessToken: string) => {
  try {
    const response = await apiClient.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateProfile = async (accessToken: string, data: any) => {
  try {
    const response = await apiClient.put("/user/update-profile", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const uploadResume = async (accessToken: string, file?: File) => {
  try {
    const formData = new FormData();
    if (file) {
      formData.append("resume", file);
    }

    const response = await apiClient.patch("/user/upload-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error upload resume:", error);
    throw error;
  }
};

const getProfileById = async (accessToken: string, userId: string) => {
  try {
    const response = await apiClient.get(`/user/${userId}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const forgotPassword = async (email: string) => {
  try {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Error in forgot password:", error);
    throw error;
  }
};

const resetPassword = async (email: string, otp: string, newPassword: string) => {
  try {
    const response = await apiClient.post("/auth/reset-password", { email, otp, newPassword });
    return response.data;
  } catch (error) {
    console.error("Error in reset password:", error);
    throw error;
  }
};

export { getProfile, updateProfile, getProfileById, uploadResume, forgotPassword, resetPassword };
