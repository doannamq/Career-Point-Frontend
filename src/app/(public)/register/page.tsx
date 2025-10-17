"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  UserPlus,
  Mail,
  Phone,
  Lock,
  Building,
  User,
  ArrowRight,
  EyeOff,
  Eye,
  Briefcase,
  Users,
  Target,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogoIcon } from "@/components/Logo";

export default function JobSearchRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const { register, user, isLoading } = useAuth();
  const router = useRouter();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(0);
  const [isShowPassword, setIsShowPassword] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formStep === 0) {
      setFormStep(1);
      return;
    }

    setError("");

    const result = await register(email, password, name, role, phoneNumber);

    if (result) {
      router.push("/");
    } else {
      setError("Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <main className="relative flex min-h-screen">
      {/* Left side - Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex justify-center mb-6">
                <LogoIcon size={60} />
              </motion.div>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                {formStep === 0 ? "Tạo tài khoản mới" : "Hoàn thiện hồ sơ của bạn"}
              </h2>
              <p className="text-gray-600">
                {formStep === 0
                  ? "Bắt đầu hành trình tìm kiếm cơ hội nghề nghiệp"
                  : "Chỉ còn vài thông tin nữa để hoàn tất đăng ký"}
              </p>

              {/* Progress Steps */}
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      formStep >= 0 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                    1
                  </div>
                  <div
                    className={`w-12 h-1 rounded-full transition-all duration-300 ${
                      formStep >= 1 ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      formStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                    2
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <motion.form
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}>
                  <Alert variant="destructive" className="border-red-200 bg-red-50 rounded-xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div
                key={formStep}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}>
                {formStep === 0 ? (
                  <div className="space-y-5">
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        Họ và tên
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập họ tên"
                        required
                        className={`
                          h-12 px-4 border-2 rounded-xl transition-all duration-300
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                          ${focusedField === "name" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}
                          hover:border-gray-300
                        `}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                        required
                        className={`
                          h-12 px-4 border-2 rounded-xl transition-all duration-300
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                          ${focusedField === "email" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}
                          hover:border-gray-300
                        `}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-blue-500" />
                        Mật khẩu
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={isShowPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Nhập mật khẩu của bạn"
                          required
                          className={`
                            h-12 px-4 pr-12 border-2 rounded-xl transition-all duration-300
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                            ${focusedField === "password" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}
                            hover:border-gray-300
                          `}
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField(null)}
                        />
                        <motion.button
                          type="button"
                          onClick={() => setIsShowPassword(!isShowPassword)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100">
                          {isShowPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </motion.button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ hoa, chữ thường và số.
                      </p>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-500" />
                        Số điện thoại
                      </Label>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Nhập số điện thoại của bạn"
                        required
                        className={`
                          h-12 px-4 border-2 rounded-xl transition-all duration-300
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                          ${focusedField === "phoneNumber" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}
                          hover:border-gray-300
                        `}
                        onFocus={() => setFocusedField("phoneNumber")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        Loại tài khoản
                      </Label>
                      <Select
                        value={role}
                        onValueChange={setRole}
                        required
                        onOpenChange={(open) => {
                          if (open) {
                            setFocusedField("role");
                          } else {
                            setFocusedField(null);
                          }
                        }}>
                        <SelectTrigger
                          className={` h-12 border-2 rounded-xl transition-all duration-300 py-6 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                            focusedField === "role" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"
                          } hover:border-gray-300`}>
                          <SelectValue placeholder="Lựa chọn loại tài khoản" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="applicant" className="rounded-lg">
                            <div className="flex items-center gap-3 py-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">Ứng viên</div>
                                <div className="text-sm text-gray-500">Tìm kiếm và ứng tuyển công việc</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="recruiter" className="rounded-lg">
                            <div className="flex items-center gap-3 py-2">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Building className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <div className="font-medium">Nhà tuyển dụng</div>
                                <div className="text-sm text-gray-500">Đăng việc làm, tuyển nhân sự</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    {role && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border-2 ${
                          role === "applicant" ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"
                        }`}>
                        <h4
                          className={`text-sm font-medium mb-2 flex items-center gap-2 ${
                            role === "applicant" ? "text-blue-800" : "text-green-800"
                          }`}>
                          {role === "applicant" ? (
                            <>
                              <Target className="h-4 w-4" />
                              Tài khoản ứng viên
                            </>
                          ) : (
                            <>
                              <Users className="h-4 w-4" />
                              Tài khoản nhà tuyển dụng
                            </>
                          )}
                        </h4>
                        <p className={`text-sm ${role === "applicant" ? "text-blue-700" : "text-green-700"}`}>
                          {role === "applicant"
                            ? "Bạn sẽ có thể tìm kiếm việc làm, ứng tuyển các vị trí và theo dõi trạng thái ứng tuyển của mình."
                            : "Bạn sẽ có thể đăng tin tuyển dụng, xem hồ sơ ứng viên và quản lý quy trình tuyển dụng."}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Form Actions */}
              <div className="flex flex-col gap-4 pt-4">
                <motion.div variants={itemVariants}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className=" w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25
                        transition-all duration-300 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {formStep === 0 ? (
                          <>
                            Tiếp tục
                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        ) : isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Đang đăng ký...
                          </>
                        ) : (
                          <>
                            Đăng ký tài khoản
                            <CheckCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                          </>
                        )}
                      </span>

                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </Button>
                  </motion.div>
                </motion.div>

                {formStep === 1 && (
                  <motion.div variants={itemVariants}>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-800 rounded-xl cursor-pointer"
                      onClick={() => setFormStep(0)}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Quay lại
                    </Button>
                  </motion.div>
                )}
              </div>

              <motion.div variants={itemVariants} className="text-center">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-500 font-semibold hover:underline transition-colors duration-200">
                    Đăng nhập ngay
                  </Link>
                </p>
              </motion.div>

              {/* Terms */}
              <motion.div variants={itemVariants} className="text-center">
                <p className="text-xs text-gray-500">
                  Bằng cách đăng ký, bạn đồng ý với{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Chính sách quyền riêng tư
                  </Link>
                  .
                </p>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Right side - Benefits Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-32 w-40 h-40 bg-green-400 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-400 rounded-full blur-2xl" />
        </div>

        <div className="relative flex flex-col justify-center px-12 py-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Bắt đầu
              <span className="text-blue-600"> hành trình nghề nghiệp </span>
              của bạn ngay hôm nay
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Tham gia cộng đồng chuyên nghiệp với hàng ngàn cơ hội việc làm và kết nối với các nhà tuyển dụng hàng đầu.
            </p>

            {/* Benefits */}
            <div className="space-y-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Tìm việc phù hợp</h3>
                  <p className="text-gray-600 text-sm">Khám phá hàng ngàn cơ hội việc làm từ các công ty hàng đầu</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Xây dựng kết nối chuyên nghiệp</h3>
                  <p className="text-gray-600 text-sm">Mở rộng mạng lưới và kết nối với các chuyên gia trong ngành</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Thăng tiến sự nghiệp</h3>
                  <p className="text-gray-600 text-sm">
                    Nhận lời khuyên và hướng dẫn để đưa sự nghiệp của bạn lên tầm cao mới
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Success Stories */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Thành công mỗi ngày</div>
                  <div className="text-sm text-gray-600">Hàng trăm ứng viên đạt được công việc mơ ước</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                  <div className="text-xs text-gray-600">Tỷ lệ thành công</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">24h</div>
                  <div className="text-xs text-gray-600">Thời gian phản hồi trung bình</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">1000+</div>
                  <div className="text-xs text-gray-600">Việc làm mới hàng tuần</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
