import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD0DOyfTC3b9Nqvg6tdoIPC9nhgjpUuJIM",
  authDomain: "careerpoint-push-notifications.firebaseapp.com",
  projectId: "careerpoint-push-notifications",
  storageBucket: "careerpoint-push-notifications.firebasestorage.app",
  messagingSenderId: "670362340034",
  appId: "1:670362340034:web:4ead4371e79ed21085895b",
  measurementId: "G-RCZ8CDDVRM",
};

const vapidKey = "BDCJ5s2qr0JmaIBqHHm5iq15kHkWjRLLbO8Cfk05vZhB7kqUq59aQkJUxDSF8kA3TKR0SUpgt9TM_if0guQqfNw";

let messaging;
if (typeof window !== "undefined" && "navigator" in window) {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export const requestFCMToken = async () => {
  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification not granted");
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    throw error;
  }
};

export const onMessageListener = (callback) => {
  if (typeof window !== "undefined" && "navigator" in window && messaging) {
    onMessage(messaging, (payload) => {
      callback(payload);
    });
  }

  return () => {};
};
