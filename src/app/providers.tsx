"use client";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { ApplicantProvider } from "@/context/applicant-context";
import { Toaster, toast } from "sonner";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { useEffect, useState } from "react";
import { requestFCMToken, onMessageListener } from "@/utils/firebaseUtils";
import FCMTokenHandler from "@/components/FCMTokenHandler";

export default function Providers({ children }: { children: React.ReactNode }) {
  // const [fcmToken, setFcmToken] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchFCMToken = async () => {
  //     try {
  //       const token = await requestFCMToken();
  //       setFcmToken(token);
  //       console.log("FCM token:", token);

  //       if (token) {
  //       }
  //     } catch (error) {
  //       console.error("Error getting FCM Token: ", error);
  //     }
  //   };
  //   fetchFCMToken();

  //   onMessageListener((payload: any) => {
  //     console.log("Received foreground message", payload);
  //     toast.success(`New message: ${payload.notification?.title}`);
  //   });
  // }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <FCMTokenHandler /> {/* ====> Chuyển logic lưu FCM Token vào component FCMTokenHandler */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ApplicantProvider>
              <NavigationProgress />
              {children}
              <Toaster />
            </ApplicantProvider>
          </ThemeProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
