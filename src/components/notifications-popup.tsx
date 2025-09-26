"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Clock, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Notification, NotificationAction, NotificationsPopupProps } from "@/types/notification";
import { acceptInviteToJoinCompany, rejectInviteToJoinCompany } from "@/lib/api/company";
import { useAuth } from "@/context/auth-context";

// Mapper từ API → FE
function mapNotificationFromApi(data: any): Notification {
  let mappedType: Notification["type"] = "info";

  switch (data.type) {
    case "system_announcement":
      mappedType = "system";
      break;
    case "company_verified":
      mappedType = "company_verified";
      break;
    case "job_application":
      mappedType = "job_application";
      break;
    case "job_approved":
      mappedType = "job_approved";
      break;
    case "payment_success":
      mappedType = "payment_success";
      break;
    case "account_verified":
      mappedType = "account_verified";
      break;
    case "success":
      mappedType = "success";
      break;
    case "warning":
      mappedType = "warning";
      break;
    case "error":
      mappedType = "error";
      break;
    default:
      mappedType = "info";
  }

  return {
    _id: data._id,
    userId: data.userId,
    title: data.title,
    message: data.message,
    type: mappedType,
    priority: data.priority || "medium",
    isRead: data.isRead || false,
    actions: data.actions?.map((action: any) => ({
      _id: action._id,
      label: action.label,
      type: action.type,
      url: action.url,
      method: action.method,
    })),
    metadata: data.metadata,
    deliveryStatus: data.deliveryStatus,
    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    __v: data.__v,
  };
}

export function NotificationsPopup({
  isOpen,
  onClose,
  notifications,
  onLoadMore,
  hasMore = true,
  loading = false,
  onMarkAsRead,
}: NotificationsPopupProps) {
  const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Convert notifications from API to FE format và remove duplicates
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const mapped = notifications.map(mapNotificationFromApi);

      // Remove duplicates based on _id
      const uniqueNotifications = mapped.filter(
        (notification, index, self) => index === self.findIndex((n) => n._id === notification._id)
      );

      setDisplayedNotifications(uniqueNotifications);
    } else {
      setDisplayedNotifications([]);
    }
  }, [notifications]);

  // Close popup khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Lazy loading khi scroll đến cuối
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  // Attach scroll listener
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleNotificationClick = (notification: Notification, action?: NotificationAction) => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification._id);
    }

    if (action && action.type === "link" && action.url) {
      window.open(action.url, "_blank");
    }
  };

  const handleActionClick = async (action: NotificationAction) => {
    if (action.type === "link" && action.url) {
      window.open(action.url, "_blank");
    } else if (action.type === "button" && action.url) {
      window.location.href = action.url;
    } else if (action.type === "api_call" && action.url && action.method) {
      if (action.label === "Tham gia" && action.method === "PATCH") {
        await acceptInviteToJoinCompany(user?.accessToken as string, action);
      } else if (action.label === "Từ chối" && action.method === "DELETE") {
        await rejectInviteToJoinCompany(user?.accessToken as string, action);
      }
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "company_verified":
      case "job_approved":
      case "payment_success":
      case "account_verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "system":
        return <Info className="h-4 w-4 text-indigo-500" />;
      case "job_application":
        return <Info className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return "Vừa xong";
    } else if (minutes < 60) {
      return `${minutes} phút trước`;
    } else if (hours < 24) {
      return `${hours} giờ trước`;
    } else {
      return `${days} ngày trước`;
    }
  };

  const isToday = (timestamp: Date) => {
    const today = new Date();
    return timestamp.toDateString() === today.toDateString();
  };

  const todayNotifications = displayedNotifications.filter((n) => isToday(n.createdAt));
  const earlierNotifications = displayedNotifications.filter((n) => !isToday(n.createdAt));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
              duration: 0.3,
            }}
            className="fixed top-0 right-0 z-50 w-96 max-w-[90vw] h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-6 scroll-container bg-gray-50/30"
              style={{ scrollBehavior: "smooth" }}>
              {/* Today */}
              {todayNotifications.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 px-2">Hôm nay</h3>
                  <div className="space-y-2">
                    {todayNotifications.map((notification, index) => (
                      <motion.div
                        key={`today-${notification._id}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer",
                          notification.isRead ? "bg-white border-gray-100" : "bg-blue-50 border-blue-100 shadow-sm"
                        )}
                        onClick={() => handleNotificationClick(notification, notification.actions?.[0])}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={cn(
                                "text-sm font-medium mb-1",
                                notification.isRead ? "text-gray-700" : "text-gray-900"
                              )}>
                              {notification.title}
                            </h4>
                            <p className={cn("text-sm mb-2", notification.isRead ? "text-gray-500" : "text-gray-600")}>
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-400">{formatTime(notification.createdAt)}</span>
                              {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />}
                            </div>
                            {notification.actions && notification.actions.length > 1 && (
                              <div className="mt-3 flex gap-2">
                                {notification.actions.map((action) => (
                                  <Button
                                    key={action._id}
                                    size="sm"
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 cursor-pointer text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleActionClick(action);
                                    }}>
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Earlier */}
              {earlierNotifications.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 px-2">Trước đó</h3>
                  <div className="space-y-2">
                    {earlierNotifications.map((notification, index) => (
                      <motion.div
                        key={`earlier-${notification._id}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (todayNotifications.length + index) * 0.05 }}
                        className={cn(
                          "p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer",
                          notification.isRead ? "bg-white border-gray-100" : "bg-blue-50 border-blue-100 shadow-sm"
                        )}
                        onClick={() => handleNotificationClick(notification, notification.actions?.[0])}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={cn(
                                "text-sm font-medium mb-1",
                                notification.isRead ? "text-gray-700" : "text-gray-900"
                              )}>
                              {notification.title}
                            </h4>
                            <p className={cn("text-sm mb-2", notification.isRead ? "text-gray-500" : "text-gray-600")}>
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-400">{formatTime(notification.createdAt)}</span>
                              {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />}
                            </div>
                            {notification.actions && notification.actions.length > 1 && (
                              <div className="mt-3 flex gap-2">
                                {notification.actions.map((action) => (
                                  <Button
                                    key={action._id}
                                    size="sm"
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 cursor-pointer text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleActionClick(action);
                                    }}>
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center py-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Đang tải thêm...</span>
                  </div>
                </div>
              )}

              {/* Load More Indicator */}
              {hasMore && !loading && displayedNotifications.length > 0 && (
                <div className="flex justify-center py-4">
                  <div className="text-sm text-gray-400 text-center">Cuộn xuống để xem thêm thông báo</div>
                </div>
              )}

              {/* No More Data */}
              {!hasMore && displayedNotifications.length > 0 && (
                <div className="flex justify-center py-4">
                  <div className="text-sm text-gray-400 text-center">Bạn đã xem hết tất cả thông báo</div>
                </div>
              )}

              {/* Empty State */}
              {displayedNotifications.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
                  <p className="text-sm text-gray-500">Bạn sẽ nhận được thông báo khi có hoạt động mới</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
