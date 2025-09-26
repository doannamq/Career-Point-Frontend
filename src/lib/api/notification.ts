import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";

const registerFCMToken = async (accessToken: string, fcmToken: string, deviceId: string, platform: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications/fcm-token`,
      {
        token: fcmToken,
        deviceId: "test-device",
        platform,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error registering FCM token:", error);
    throw error;
  }
};

const getNotifications = async (accessToken: string, page: number = 1, limit: number = 10) => {
  try {
    const response = await axios.get(`${API_URL}/notifications?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw error;
  }
};

const markNotificationAsRead = async (accessToken: string, notificationId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export { registerFCMToken, getNotifications, markNotificationAsRead };
