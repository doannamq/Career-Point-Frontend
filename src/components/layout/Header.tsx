"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu, X, PlusCircle, Bell, Users, Plus } from "lucide-react";
import { NavigationLink } from "../ui/navigation-link";
import { motion, AnimatePresence } from "framer-motion";
import { getProfileById } from "@/lib/api/user";
import { getCompanyStatus } from "@/lib/api/company";
import { LogoIcon } from "../Logo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";
import { NotificationsPopup } from "../notifications-popup";
import { getNotifications, markNotificationAsRead } from "@/lib/api/notification";
import { onMessageListener } from "@/utils/firebaseUtils";

export default function Header() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [companyStatus, setCompanyStatus] = useState<string | null>(null);

  // Notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const LIMIT = 10;

  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Fetch user profile
  useEffect(() => {
    const getUserData = async () => {
      if (user?.accessToken && user?.userId) {
        const res = await getProfileById(user.accessToken, user.userId);
        setUserData(res?.data?.data);
      }
    };
    getUserData();
  }, [user]);

  const companyId = userData?.companies?.[0];
  const handleGetCompanyStatus = async () => {
    if (!companyId || !user?.accessToken) return;
    try {
      const response = await getCompanyStatus(companyId, user.accessToken);
      setCompanyStatus(response.status);
    } catch (error) {
      console.log("Error get company status", error);
    }
  };

  useEffect(() => {
    if (userData?.companies?.length > 0) {
      handleGetCompanyStatus();
    }
  }, [userData]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    if (path === "/companies") {
      return (
        pathname === "/companies" || (/^\/companies\/[^/]+$/.test(pathname) && !pathname.startsWith("/companies/plans"))
      );
    }
    return pathname === path;
  };

  // Fetch notifications with pagination
  const fetchNotifications = useCallback(
    async (page = 1, append = false) => {
      if (!user?.accessToken) return;

      setLoadingNotifications(true);
      try {
        const response = await getNotifications(user.accessToken, page, LIMIT);
        const newNotifications = response.data?.notifications || [];

        if (append) {
          // Remove duplicates when appending
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n._id));
            const uniqueNewNotifications = newNotifications.filter((n: any) => !existingIds.has(n._id));
            return [...prev, ...uniqueNewNotifications];
          });
        } else {
          setNotifications(newNotifications);
          setUnreadCount(response.data?.unreadCount || 0);
        }

        // Check if there are more notifications
        setHasMoreNotifications(newNotifications.length === LIMIT);
      } catch (error) {
        console.error("Error fetching notifications", error);
      } finally {
        setLoadingNotifications(false);
      }
    },
    [user?.accessToken]
  );

  // Load more notifications
  const handleLoadMore = useCallback(() => {
    if (!loadingNotifications && hasMoreNotifications) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchNotifications(nextPage, true);
    }
  }, [currentPage, loadingNotifications, hasMoreNotifications, fetchNotifications]);

  // Mark notification as read
  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      if (!user?.accessToken) return;

      try {
        await markNotificationAsRead(user.accessToken, notificationId);

        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId ? { ...notification, isRead: true } : notification
          )
        );

        // Update unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read", error);
      }
    },
    [user?.accessToken]
  );

  // Initial fetch
  useEffect(() => {
    fetchNotifications(1, false);
  }, [fetchNotifications]);

  // Listen for new notifications via FCM
  useEffect(() => {
    if (!user?.accessToken) return;

    const unsubscribe = onMessageListener(async (payload: any) => {
      if (payload.data?.userId && user.userId && payload.data.userId !== user.userId) {
        return;
      }

      const newNotification = {
        _id: payload.data?.notificationId || `fcm-${Date.now()}-${Math.random()}`,
        title: payload.notification?.title || "",
        message: payload.notification?.body || "",
        type: payload.data?.type || "info",
        isRead: false,
        createdAt: new Date().toISOString(),
        ...payload.data,
      };

      // Check if notification already exists
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === newNotification._id);
        if (exists) return prev;
        return [newNotification, ...prev];
      });

      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.accessToken, user?.userId]);

  // Reset notifications when popup opens
  useEffect(() => {
    if (notificationsOpen) {
      setCurrentPage(1);
      fetchNotifications(1, false);
    }
  }, [notificationsOpen, fetchNotifications]);

  // Auto refresh notifications every 2 minutes
  useEffect(() => {
    if (!user?.accessToken) return;
    const interval = setInterval(() => {
      if (!notificationsOpen) {
        fetchNotifications(1, false);
      }
    }, 1000 * 60 * 2);
    return () => clearInterval(interval);
  }, [user?.accessToken, notificationsOpen, fetchNotifications]);

  const navItemClass = (path: string) =>
    `relative text-sm font-medium transition-all duration-300 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-50/80 ${
      isActive(path) ? "text-blue-600 font-semibold bg-blue-50/60 shadow-sm" : "text-gray-700"
    }`;

  const containerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.3, delay: 0.1 },
        staggerChildren: 0.05,
        delayChildren: 0.15,
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.2 },
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200/60 shadow-sm">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-green-50/20 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between relative">
        {/* Logo Section */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}>
          <NavigationLink
            href={user?.role === "admin" ? "/admin" : "/"}
            prefetch={true}
            className="flex items-center gap-3 group">
            <div>
              <LogoIcon size={40} />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-blue-500">Career Point</span>
              <span className="text-xs text-gray-500 -mt-1">Điểm đến sự nghiệp của bạn</span>
            </div>
          </NavigationLink>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-5">
            <NavigationLink href="/" className={navItemClass("/")} prefetch={true}>
              <div className="flex items-center gap-2">
                <span>Trang chủ</span>
              </div>
            </NavigationLink>
            <NavigationLink href="/jobs" className={navItemClass("/jobs")} prefetch={true}>
              <div className="flex items-center gap-2">
                <span>Việc làm</span>
              </div>
            </NavigationLink>
            <NavigationLink href="/companies" className={navItemClass("/companies")} prefetch={true}>
              <div className="flex items-center gap-2">
                <span>Công ty</span>
              </div>
            </NavigationLink>
            <NavigationLink href="/companies/plans" className={navItemClass("/companies/plans")}>
              <div className="flex items-center gap-2">
                <span>Gói dịch vụ</span>
              </div>
            </NavigationLink>
          </motion.div>
        </nav>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="hidden md:flex items-center gap-3">
          {!authLoading && !user ? (
            <div className="flex items-center gap-2">
              <NavigationLink href="/login" prefetch={true}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-4 rounded-xl hover:bg-gray-100 font-medium transition-all duration-200 cursor-pointer">
                  Đăng nhập
                </Button>
              </NavigationLink>
              <NavigationLink href="/register" prefetch={true}>
                <Button
                  size="sm"
                  className="h-9 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 cursor-pointer">
                  Bắt đầu ngay
                </Button>
              </NavigationLink>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {user?.role === "recruiter" &&
                (userData?.companies && userData.companies.length === 0 ? (
                  // <DropdownMenu>
                  //   <DropdownMenuTrigger asChild>
                  //     <Button
                  //       size="sm"
                  //       className="h-10 px-4 bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer">
                  //       <span className="relative">Công ty</span>
                  //     </Button>
                  //   </DropdownMenuTrigger>
                  //   <DropdownMenuContent className="w-48 rounded-xl shadow-lg">
                  //     <Link href={"/companies"} prefetch={true}>
                  //       <DropdownMenuItem>
                  //         <Users className="h-4 w-4 mr-2 text-blue-500" />
                  //         Tham gia công ty
                  //       </DropdownMenuItem>
                  //     </Link>
                  //     <Link href={"/companies/new"} prefetch={true}>
                  //       <DropdownMenuItem>
                  //         <Plus className="h-4 w-4 mr-2 text-green-500" />
                  //         Tạo công ty
                  //       </DropdownMenuItem>
                  //     </Link>
                  //   </DropdownMenuContent>
                  // </DropdownMenu>
                  <NavigationLink href={"/companies/new"} prefetch={true}>
                    <Button
                      size="sm"
                      className="h-10 px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer">
                      <div className="relative">
                        <PlusCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.4, 0] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                          className="absolute inset-0 rounded-full bg-white/50"
                        />
                      </div>
                      <span className="relative">
                        Tạo công ty
                        <span className="absolute -top-2 -right-2 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                      </span>
                    </Button>
                  </NavigationLink>
                ) : companyStatus === "pending_verification" ? (
                  <Button
                    size="sm"
                    className="h-10 px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group">
                    <div className="relative">
                      <PlusCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.4, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                        className="absolute inset-0 rounded-full bg-white/50"
                      />
                    </div>
                    <span className="relative">
                      Chờ xác thực
                      <span className="absolute -top-2 -right-2 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    </span>
                  </Button>
                ) : (
                  <NavigationLink href="/post-job" prefetch={true}>
                    <Button
                      size="sm"
                      className="h-10 px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer">
                      <div className="relative">
                        <PlusCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.4, 0] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                          className="absolute inset-0 rounded-full bg-white/50"
                        />
                      </div>
                      <span className="relative">
                        Đăng tuyển
                        <span className="absolute -top-2 -right-2 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                      </span>
                    </Button>
                  </NavigationLink>
                ))}

              {user?.role === "applicant" && (
                <NavigationLink href="/cv-builder" prefetch={true}>
                  <Button
                    size="sm"
                    className="h-10 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer">
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.4, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                        className="absolute inset-0 rounded-full bg-white/50"
                      />
                    </div>
                    <span className="relative">CV Online</span>
                  </Button>
                </NavigationLink>
              )}

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotificationsOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-200 cursor-pointer">
                  {notificationsOpen ? (
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Bell className="h-6 w-6 text-blue-600" />
                    </div>
                  ) : (
                    <Bell className="h-6 w-6" />
                  )}

                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </motion.button>
                <NotificationsPopup
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                  notifications={notifications}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMoreNotifications}
                  loading={loadingNotifications}
                  onMarkAsRead={handleMarkAsRead}
                />
              </div>

              {/* Profile Menu */}
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <NavigationLink href="/profile" prefetch={true}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 leading-tight">{userData?.name}</span>
                      <span className="text-xs text-gray-500 leading-tight capitalize">{user?.role}</span>
                    </div>
                  </motion.div>
                </NavigationLink>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.95 }}>
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}>
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}>
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-xl shadow-lg overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit">
            <nav className="container mx-auto flex flex-col p-4 space-y-2">
              <motion.div variants={itemVariants}>
                <NavigationLink
                  href="/"
                  prefetch={true}
                  className={`block py-4 px-4 rounded-xl transition-all duration-200 ${
                    isActive("/") ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-gray-50 text-gray-700"
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Trang chủ</span>
                  </div>
                </NavigationLink>
              </motion.div>

              <motion.div variants={itemVariants}>
                <NavigationLink
                  prefetch={true}
                  href="/jobs"
                  className={`block py-4 px-4 rounded-xl transition-all duration-200 ${
                    isActive("/jobs") ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-gray-50 text-gray-700"
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Việc làm</span>
                  </div>
                </NavigationLink>
              </motion.div>

              <motion.div variants={itemVariants}>
                <NavigationLink
                  href="/companies"
                  prefetch={true}
                  className={`block py-4 px-4 rounded-xl transition-all duration-200 ${
                    isActive("/companies") ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-gray-50 text-gray-700"
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Công ty</span>
                  </div>
                </NavigationLink>
              </motion.div>

              <motion.div variants={itemVariants}>
                <NavigationLink
                  href="/companies/plans"
                  className={`block py-4 px-4 rounded-xl transition-all duration-200 ${
                    isActive("/companies/plans")
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Gói dịch vụ</span>
                  </div>
                </NavigationLink>
              </motion.div>

              {!authLoading && !user ? (
                <motion.div
                  className="flex flex-col space-y-3 pt-4 mt-4 border-t border-gray-200"
                  variants={itemVariants}>
                  <NavigationLink href="/login" prefetch={true}>
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-xl border-2 font-medium hover:bg-gray-50 transition-all duration-200 bg-transparent">
                      Đăng nhập
                    </Button>
                  </NavigationLink>
                  <NavigationLink href="/register" prefetch={true}>
                    <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300">
                      Bắt đầu ngay
                    </Button>
                  </NavigationLink>
                </motion.div>
              ) : (
                <motion.div
                  className="flex flex-col space-y-3 pt-4 mt-4 border-t border-gray-200"
                  variants={itemVariants}>
                  {user?.role === "recruiter" &&
                    (userData?.companies && userData.companies.length === 0 ? (
                      <NavigationLink href="/companies" prefetch={true}>
                        <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white font-medium rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 transition-all duration-300 group">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <span>Tham gia công ty</span>
                        </Button>
                      </NavigationLink>
                    ) : companyStatus === "pending_verification" ? (
                      <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 transition-all duration-300 group">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <PlusCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <span>Chờ xác thực</span>
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                      </Button>
                    ) : (
                      <NavigationLink href="/post-job" prefetch={true}>
                        <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 transition-all duration-300 group">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <PlusCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <span>Đăng tuyển</span>
                          <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                        </Button>
                      </NavigationLink>
                    ))}
                  <NavigationLink href="/profile" prefetch={true}>
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-xl border-2 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all duration-200 bg-transparent">
                      <User className="h-4 w-4" />
                      Trang cá nhân
                    </Button>
                  </NavigationLink>
                  <Button
                    variant="ghost"
                    className="w-full h-11 rounded-xl font-medium flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                    onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </Button>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
