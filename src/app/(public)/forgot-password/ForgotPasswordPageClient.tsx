"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, Lock, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { forgotPassword, resetPassword } from "@/lib/api/user";

interface FormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

const ForgotPasswordPageClient = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Format countdown time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate OTP (6 digits)
  const validateOTP = (otp: string) => {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async () => {
    const newErrors: FormErrors = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await forgotPassword(formData.email);

      if (response.success) {
        setSuccess("OTP đã được gửi về email của bạn");
        setStep(2);
        setCountdown(300); // 5 minutes countdown
      } else {
        setErrors({ general: response.message || "Email không tồn tại trong hệ thống" });
      }
    } catch (error) {
      setErrors({ general: "Có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password with OTP
  const handleResetPassword = async () => {
    const newErrors: FormErrors = {};

    // Validate OTP
    if (!formData.otp) {
      newErrors.otp = "Vui lòng nhập mã OTP";
    } else if (!validateOTP(formData.otp)) {
      newErrors.otp = "OTP phải gồm 6 chữ số";
    }

    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await resetPassword(formData.email, formData.otp, formData.newPassword);

      if (response.success) {
        setSuccess("Đặt lại mật khẩu thành công");
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setErrors({ general: response.message || "OTP không đúng hoặc đã hết hạn" });
      }
    } catch (error) {
      setErrors({ general: "Có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setSuccess("OTP mới đã được gửi về email của bạn");
        setCountdown(300); // Reset 5 minutes countdown
      } else {
        setErrors({ general: "Không thể gửi lại OTP, vui lòng thử lại" });
      }
    } catch (error) {
      setErrors({ general: "Có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="p-1 h-8 w-8 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold">{step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}</CardTitle>
              <CardDescription>
                {step === 1 ? "Nhập email để nhận mã OTP" : "Nhập mã OTP và mật khẩu mới"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Success Message */}
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <Button onClick={handleSendOTP} className="w-full cursor-pointer" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi mã OTP"}
              </Button>
            </div>
          )}

          {/* Step 2: OTP and New Password */}
          {step === 2 && (
            <div className="space-y-4">
              {/* OTP Input */}
              <div className="space-y-2">
                <Label htmlFor="otp">Mã OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Nhập 6 chữ số"
                  value={formData.otp}
                  onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  disabled={loading}
                />
                {errors.otp && <p className="text-sm text-destructive">{errors.otp}</p>}
              </div>

              {/* Countdown Timer */}
              {countdown > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span>Mã OTP hết hạn sau: {formatTime(countdown)}</span>
                </div>
              )}

              {/* Resend OTP Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendOTP}
                disabled={countdown > 0 || loading}
                className="w-full">
                {countdown > 0 ? `Gửi lại sau ${formatTime(countdown)}` : "Gửi lại OTP"}
              </Button>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>

              <Button onClick={handleResetPassword} className="w-full cursor-pointer" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu "}
              </Button>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push("/login")}
              className="text-sm text-muted-foreground cursor-pointer">
              Quay lại đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPageClient;
