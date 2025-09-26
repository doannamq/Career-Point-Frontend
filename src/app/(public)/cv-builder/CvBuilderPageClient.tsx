"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Download, Eye, FileText, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CvBuilderPageClient() {
  const { user } = useAuth();
  const router = useRouter();
  const features = [
    {
      icon: <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />,
      title: "Nhiều template",
      description: "Chọn từ nhiều template chuyên nghiệp: Minimal, Modern, Creative, Corporate,...",
    },
    {
      icon: <Eye className="w-12 h-12 text-green-600 mx-auto mb-4" />,
      title: "Xem trước real-time",
      description: "Giao diện trực quan, dễ sử dụng, xem trước CV trong quá trình tạo",
    },
    {
      icon: <Download className="w-12 h-12 text-purple-600 mx-auto mb-4" />,
      title: "Tải xuống PDF miễn phí",
      description: "Tải CV về máy dưới định dạng PDF chất lượng cao, sẵn sàng ứng tuyển",
    },
    {
      icon: <FolderOpen className="w-12 h-12 text-orange-600 mx-auto mb-4" />,
      title: "Quản lý CV",
      description: "Lưu trữ, chỉnh sửa và quản lý nhiều CV khác nhau một cách dễ dàng",
    },
  ];

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg border-blue-100 bg-white/95 backdrop-blur-xl">
            <CardContent className="p-10 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}>
                <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-6" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
                Bạn không được phép truy cập trang này
              </h1>
              <p className="text-muted-foreground text-lg mb-8">Hãy đăng nhập để tiếp tục tạo CV của bạn!</p>
              <Button
                size="lg"
                onClick={() => router.push("/login?redirect=/cv-builder")}
                className="px-8 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer">
                Đăng Nhập
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tạo CV online chuyên nghiệp</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tạo CV đẹp mắt với nhiều template, xem trước real-time và tải xuống PDF chất lượng cao.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}>
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  {item.icon}
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/cv-builder/new"}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}>
                <Button size={"lg"} className="text-lg px-8 py-3 cursor-pointer">
                  Tạo CV mới
                </Button>
              </motion.div>
            </Link>
            <Link href={"/cv-builder/my-cvs"}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}>
                <Button size={"lg"} variant={"outline"} className="text-lg px-8 py-3 cursor-pointer">
                  <FolderOpen className="w-5 h-5 mr-2" />
                  CV của tôi
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
