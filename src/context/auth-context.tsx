"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser as setUserRedux, clearUser, setUserProfile } from "@/redux/user/userSlice";
import { getProfile } from "@/lib/api/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";

type User = {
  email: string;
  token: string;
  role: string;
  userId: string;
  userName: string;
  userEmail: string;
  accessToken: string;
  refreshToken: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: string, phoneNumber: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("auth_token");
    const email = Cookies.get("auth_email");
    const role = Cookies.get("auth_role") || "applicant";
    const userId = Cookies.get("auth_userId") || "user123";
    const userName = Cookies.get("auth_userName") || "user123";
    const userEmail = Cookies.get("auth_userEmail") || "user123@example.com";
    const refreshToken = Cookies.get("refresh_token") || "refreshToken";

    if (token && email) {
      const userData = { email, token, role, userId, userName, userEmail, accessToken: token, refreshToken };
      setUser(userData);
      dispatch(
        setUserRedux({
          userId,
          email,
          role,
          accessToken: token,
          refreshToken,
        })
      );

      getProfile(token)
        .then((profile) => {
          dispatch(setUserProfile(profile.data));
        })
        .catch((error) => {
          console.error("Error fetching profile on reload:", error);
        });
    }

    setIsLoading(false);
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      const token = data.accessToken || "accessToken";
      const role = data.role || "applicant";
      const userId = data.userId || "user123";
      const userName = data.userName || "user123";
      const userEmail = data.userEmail || "user123@example.com";
      const refreshToken = data.refreshToken || "refreshToken";

      Cookies.set("auth_token", token, { expires: 7 });
      Cookies.set("auth_email", email, { expires: 7 });
      Cookies.set("auth_role", role, { expires: 7 });
      Cookies.set("auth_userId", userId, { expires: 7 });
      Cookies.set("auth_userName", userName, { expires: 7 });
      Cookies.set("auth_userEmail", userEmail, { expires: 7 });
      Cookies.set("refresh_token", refreshToken, { expires: 7 });

      const userData = { email, token, role, userId, userName, userEmail, accessToken: token, refreshToken };
      setUser(userData);

      dispatch(
        setUserRedux({
          userId,
          email,
          role,
          accessToken: token,
          refreshToken,
        })
      );

      const profile = await getProfile(token);
      dispatch(setUserProfile(profile.data));

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: string, phoneNumber: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role, phoneNumber }),
      });

      if (!response.ok) throw new Error("Registration failed");

      const data = await response.json();
      const token = data.accessToken || "accessToken";
      const refreshToken = data.refreshToken || "refreshToken";
      const userId = data.userId || "user123";
      const userName = data.userName || "user123";
      const userEmail = data.userEmail || "user123@example.com";

      Cookies.set("auth_token", token, { expires: 7 });
      Cookies.set("auth_email", email, { expires: 7 });
      Cookies.set("auth_role", role, { expires: 7 });
      Cookies.set("auth_userId", userId, { expires: 7 });
      Cookies.set("auth_userName", userName, { expires: 7 });
      Cookies.set("auth_userEmail", userEmail, { expires: 7 });
      Cookies.set("refresh_token", refreshToken, { expires: 7 });

      const userData = { email, token, role, userId, userName, userEmail, accessToken: token, refreshToken };
      setUser(userData);

      // 👉 Lưu vào Redux
      dispatch(
        setUserRedux({
          userId,
          email,
          role,
          accessToken: token,
          refreshToken,
        })
      );

      const profile = await getProfile(token);
      dispatch(setUserProfile(profile.data));

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("auth_email");
    Cookies.remove("auth_role");
    Cookies.remove("auth_userId");
    Cookies.remove("auth_userName");
    Cookies.remove("auth_userEmail");
    Cookies.remove("refresh_token");

    setUser(null);
    dispatch(clearUser());
  };

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
