// Interface chuẩn FE - Updated with new fields
interface NotificationAction {
  _id: string;
  label: string;
  type: "link" | "button" | "api_call" | "dissmiss";
  url?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

interface NotificationDeliveryStatus {
  push?: "sent" | "pending" | "failed" | "skipped";
  email?: "sent" | "pending" | "failed" | "skipped";
  sms?: "sent" | "pending" | "failed" | "skipped";
}

interface NotificationMetadata {
  companyId?: string;
  jobId?: string;
  applicationId?: string;
  [key: string]: any; // Allow additional metadata fields
}

interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "system"
    | "company_verified"
    | "job_application"
    | "job_approved"
    | "payment_success"
    | "account_verified";
  priority: "low" | "medium" | "high";
  isRead: boolean;
  actions?: NotificationAction[];
  metadata?: NotificationMetadata;
  deliveryStatus?: NotificationDeliveryStatus;
  scheduledAt?: Date | null;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

// Props
interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: any[]; // raw từ API
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  onMarkAsRead?: (notificationId: string) => void;
}

export type { Notification, NotificationsPopupProps, NotificationAction };
