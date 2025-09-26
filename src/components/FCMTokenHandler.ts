import { useAuth } from "@/context/auth-context";
import { registerFCMToken } from "@/lib/api/notification";
import { onMessageListener, requestFCMToken } from "@/utils/firebaseUtils";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FCMTokenHandler = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFCMToken = async () => {
      try {
        const token = await requestFCMToken();
        setFcmToken(token);
        // console.log("FCM token:", token);

        if (token && user?.accessToken) {
          registerFCMToken(user.accessToken, token, "test-device", "web");
        }
      } catch (error) {
        console.error("Error getting FCM Token: ", error);
      }
    };
    fetchFCMToken();

    onMessageListener((payload: any) => {
      console.log("Received foreground message", payload);
      toast.success("Bạn có một thông báo mới");
    });
  }, [user?.accessToken]);

  return null;
};

export default FCMTokenHandler;
