"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Building2, Crown } from "lucide-react";
import { updateSubscription, getCompanyById, getSubscriptionHistory } from "@/lib/api/company";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useAuth } from "@/context/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const planPrices = {
  monthly: {
    free: 0,
    basic: 99000,
    premium: 999000,
    enterprise: 1999000,
  },
  annually: {
    free: 0,
    basic: 990000,
    premium: 9990000,
    enterprise: 19990000,
  },
};

const planDetails = {
  monthly: {
    free: { days: 0, jobPostLimit: 3, featuredJobsLimit: 0 },
    basic: { days: 30, jobPostLimit: 10, featuredJobsLimit: 1 },
    premium: { days: 30, jobPostLimit: 25, featuredJobsLimit: 3 },
    enterprise: { days: 30, jobPostLimit: 50, featuredJobsLimit: 5 },
  },
  annually: {
    free: { days: 0, jobPostLimit: 3, featuredJobsLimit: 0 },
    basic: { days: 365, jobPostLimit: 120, featuredJobsLimit: 12 },
    premium: { days: 365, jobPostLimit: 300, featuredJobsLimit: 36 },
    enterprise: { days: 365, jobPostLimit: 600, featuredJobsLimit: 60 },
  },
};

const planIcons = {
  free: Star,
  basic: Zap,
  premium: Crown,
  enterprise: Building2,
};

const planColors = {
  free: "bg-muted",
  basic: "bg-primary/5 border-primary/20",
  premium: "bg-gradient-to-br from-green-50 to-blue-50 border-primary/30",
  enterprise: "bg-gradient-to-br from-slate-50 to-gray-100 border-slate-300",
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const getPlanDisplayName = (plan: string) => {
  const planNames = {
    free: "Free",
    basic: "Basic",
    premium: "Premium",
    enterprise: "Enterprise",
  };
  return planNames[plan as keyof typeof planNames] || plan;
};

export function PlansPageClient() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const plan = searchParams.get("plan");

  const [isAnnual, setIsAnnual] = useState(false);
  const billingType = isAnnual ? "annually" : "monthly";
  const userProfile = useSelector((state: RootState) => state.user.userProfile);
  const [currentPlan, setCurrentPlan] = useState<{ plan: string; billingCycle: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const companyId = (userProfile as any)?.companies?.[0];
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);

  const subscriptionHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      setCurrentPlan(null);
      return;
    }
    const fetchCompany = async () => {
      const company = await getCompanyById(companyId);
      setCurrentPlan({
        plan: company?.company?.subscription?.plan,
        billingCycle: company?.company?.subscription?.billingCycle,
      });
    };
    fetchCompany();
  }, [companyId, user]);

  useEffect(() => {
    const fetchLatestCompany = async () => {
      const companyId = (userProfile as any)?.companies?.[0];
      if (!companyId) return;

      const company = await getCompanyById(companyId);
      setCurrentPlan({
        plan: company.company.subscription.plan,
        billingCycle: company.company.subscription.billingCycle,
      });
    };

    if (status === "success") {
      fetchLatestCompany();
    }
  }, [status, plan]);

  const plans = [
    { id: "free", name: "Free", description: "Hoàn hảo để bắt đầu", popular: false },
    { id: "basic", name: "Basic", description: "Dành cho công ty nhỏ", popular: false },
    { id: "premium", name: "Premium", description: "Lựa chọn phổ biến nhất", popular: true },
    { id: "enterprise", name: "Enterprise", description: "Dành cho doanh nghiệp lớn", popular: false },
  ];

  const handleUpdateSubscription = async (plan: string) => {
    try {
      if (plan === "free") {
        router.push("/");
        return;
      }

      if (!user) {
        router.push(`/login?redirect=/companies/plans`);
        return;
      }

      if (user.role !== "recruiter") {
        setShowModal(true);
        return;
      }

      const companyId = (userProfile as any)?.companies?.[0];
      if (!companyId) {
        console.error("Không tìm thấy companyId");
        return;
      }

      const response = await updateSubscription(companyId, user.accessToken, plan, billingType);

      if (response?.success && response?.vnpUrl) {
        window.location.href = response.vnpUrl;
      } else {
        console.error("Không lấy được link thanh toán VNPAY");
      }
    } catch (error) {
      console.error("Error handleUpdateSubscription:", error);
    }
  };

  useEffect(() => {
    const fetchSubscriptionHistory = async () => {
      if (!companyId || !user?.accessToken) return;
      const response = await getSubscriptionHistory(companyId, user.accessToken);
      if (response && response.success) {
        setSubscriptionHistory(response.subscriptionHistory);
      }
    };

    fetchSubscriptionHistory();
  }, [user, companyId]);

  const scrollToSubscriptionHistory = () => {
    subscriptionHistoryRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, duration: 0.5 },
            },
          }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gói Dành Cho Bạn</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Các gói dịch vụ linh hoạt để đáp ứng nhu cầu tuyển dụng của công ty bạn
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          className="flex items-center justify-between gap-2 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15, duration: 0.5 },
            },
          }}>
          <div></div>
          <div>
            <div className="relative inline-flex items-center justify-center bg-muted rounded-lg p-1">
              <span
                className={`px-4 py-1 rounded-lg text-sm font-medium cursor-pointer ${
                  !isAnnual ? "bg-white text-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setIsAnnual(false)}>
                Hàng tháng
              </span>
              <span
                className={`px-4 py-1 rounded-lg text-sm font-medium cursor-pointer ${
                  isAnnual ? "bg-white text-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setIsAnnual(true)}>
                Hàng năm
              </span>
            </div>
            {isAnnual && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full">
                Tiết kiệm 10-20%
              </span>
            )}
          </div>
          <div
            className="text-sm font-semibold cursor-pointer hover:text-amber-600 transition-all"
            onClick={scrollToSubscriptionHistory}>
            Lịch sử thanh toán
          </div>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.15, duration: 0.5 },
          },
        }}>
        {plans.map((plan) => {
          const Icon = planIcons[plan.id as keyof typeof planIcons];
          const price = planPrices[billingType][plan.id as keyof (typeof planPrices)[typeof billingType]];
          const details = planDetails[billingType][plan.id as keyof (typeof planDetails)[typeof billingType]];

          const isCurrent = currentPlan && plan.id === currentPlan.plan && billingType === currentPlan.billingCycle;

          return (
            <motion.div
              key={plan.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}>
              <Card
                className={`relative ${planColors[plan.id as keyof typeof planColors]} ${
                  plan.popular ? "ring-2 ring-primary shadow-lg scale-105" : ""
                } ${isCurrent ? "ring-2 ring-emerald-500" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">Phổ biến nhất</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-3">
                    <div className={`p-3 rounded-full ${plan.id === "premium" ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`h-6 w-6 ${plan.id === "premium" ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>

                  <div className="mt-4">
                    <div className="text-3xl font-bold">{price === 0 ? "Miễn phí" : formatPrice(price)}</div>
                    {price > 0 && <div className="text-sm text-muted-foreground">/{isAnnual ? "năm" : "tháng"}</div>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {details.jobPostLimit} tin tuyển dụng
                      {isAnnual && plan.id !== "free" ? "/năm" : plan.id !== "free" ? "/tháng" : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {details.featuredJobsLimit} tin nổi bật
                      {isAnnual && plan.id !== "free" ? "/năm" : plan.id !== "free" ? "/tháng" : ""}
                    </span>
                  </div>

                  {details.days > 0 && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Hỗ trợ {details.days} ngày</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {plan.id === "free"
                        ? "Hỗ trợ cơ bản"
                        : plan.id === "basic"
                        ? "Hỗ trợ email"
                        : plan.id === "premium"
                        ? "Hỗ trợ ưu tiên"
                        : "Hỗ trợ 24/7"}
                    </span>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full cursor-pointer"
                    variant={
                      isCurrent ? "default" : plan.popular ? "default" : plan.id === "free" ? "secondary" : "outline"
                    }
                    disabled={!!isCurrent}
                    onClick={() => handleUpdateSubscription(plan.id)}>
                    {isCurrent ? "Đang sử dụng" : plan.id === "free" ? "Bắt đầu miễn phí" : "Chọn gói này"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Feature Comparison Table */}
      <motion.div
        className="bg-card rounded-lg border p-6 mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}>
        <h3 className="text-2xl font-bold text-center mb-8">So sánh chi tiết các gói</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Tính năng</th>
                <th className="text-center py-3 px-4 font-medium">Free</th>
                <th className="text-center py-3 px-4 font-medium">Basic</th>
                <th className="text-center py-3 px-4 font-medium">Premium</th>
                <th className="text-center py-3 px-4 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Tin tuyển dụng ({isAnnual ? "năm" : "tháng"})</td>
                <td className="text-center py-3 px-4">{planDetails[billingType].free.jobPostLimit}</td>
                <td className="text-center py-3 px-4">{planDetails[billingType].basic.jobPostLimit}</td>
                <td className="text-center py-3 px-4">{planDetails[billingType].premium.jobPostLimit}</td>
                <td className="text-center py-3 px-4">{planDetails[billingType].enterprise.jobPostLimit}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Tin nổi bật ({isAnnual ? "năm" : "tháng"})</td>
                <td className="text-center py-3 px-4">{planDetails[billingType].free.featuredJobsLimit}</td>
                <td className="text-center py-3 px-4">{planDetails[billingType].basic.featuredJobsLimit}</td>
                <td className="text-center py-3 px-4">{planDetails[billingType].premium.featuredJobsLimit}</td>
                <td className="text-center py-3 px-4">{planDetails[billingType].enterprise.featuredJobsLimit}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Thời gian hỗ trợ</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">{planDetails[billingType].basic.days} ngày</td>
                <td className="text-center py-3 px-4">{planDetails[billingType].premium.days} ngày</td>
                <td className="text-center py-3 px-4">{planDetails[billingType].enterprise.days} ngày</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Loại hỗ trợ</td>
                <td className="text-center py-3 px-4">Cơ bản</td>
                <td className="text-center py-3 px-4">Email</td>
                <td className="text-center py-3 px-4">Ưu tiên</td>
                <td className="text-center py-3 px-4">24/7</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {user && (
        <motion.div
          ref={subscriptionHistoryRef}
          className="bg-card rounded-lg border p-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}>
          <h3 className="text-2xl font-bold text-center mb-8">Lịch sử thanh toán</h3>

          {subscriptionHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Gói</th>
                    <th className="text-left py-3 px-4 font-medium">Chu kỳ</th>
                    <th className="text-right py-3 px-4 font-medium">Số tiền</th>
                    <th className="text-left py-3 px-4 font-medium">Ngày mua</th>
                    <th className="text-left py-3 px-4 font-medium">Thời hạn</th>
                    <th className="text-center py-3 px-4 font-medium">Trạng thái</th>
                    <th className="text-left py-3 px-4 font-medium">Mã giao dịch</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionHistory.map((subscription: any, index: number) => (
                    <tr key={subscription.id || index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <span className="font-medium">{getPlanDisplayName(subscription.plan)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {subscription.billingCycle === "monthly" ? "Hàng tháng" : "Hàng năm"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-primary">{formatPrice(subscription.amount)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{formatDate(subscription.purchasedAt)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div>{formatDate(subscription.startDate)}</div>
                          <div className="text-muted-foreground">đến {formatDate(subscription.endDate)}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant={subscription.status === "success" ? "default" : "destructive"}
                          className={subscription.status === "success" ? "bg-green-100 text-green-800" : ""}>
                          {subscription.status === "success" ? "Thành công" : "Thất bại"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono text-muted-foreground">{subscription.transactionId}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-medium mb-2">Chưa có lịch sử thanh toán</h4>
              <p className="text-muted-foreground">
                Bạn chưa có giao dịch thanh toán nào. Hãy chọn một gói phù hợp để bắt đầu.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Footer Section */}
      <div className="text-center mt-16">
        <h3 className="text-xl font-semibold mb-4">Cần tư vấn thêm?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn chọn gói dịch vụ phù hợp nhất với nhu cầu tuyển dụng của
          công ty.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="hover:bg-emerald-100 hover:border-green-300 cursor-pointer bg-transparent">
          Liên hệ tư vấn
        </Button>
      </div>

      <AnimatePresence>
        {showModal && (
          <Dialog open={showModal} onOpenChange={() => setShowModal(false)}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
              <DialogHeader className="p-6 pb-4 border-b">
                <DialogTitle className="flex items-center justify-center gap-2">Thông báo</DialogTitle>
              </DialogHeader>
              <div className="text-center space-y-3 p-6 leading-relaxed">
                <p className="text-red-500 font-semibold text-lg">Bạn không thể mua gói bây giờ</p>
                <p className="text-gray-600">
                  Hãy đăng nhập bằng <span className="text-blue-600 font-medium">tài khoản nhà tuyển dụng</span> để tiếp
                  tục.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
