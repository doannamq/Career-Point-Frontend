import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại trang chủ
              </Link>
            </Button>
            <h1 className="text-4xl font-bold text-primary mb-2">Chính sách bảo mật</h1>
            <p className="text-muted-foreground">Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="prose prose-gray max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. GIỚI THIỆU</h2>
                  <p className="text-foreground leading-relaxed mb-4">
                    Career Point cam kết bảo vệ quyền riêng tư và thông tin cá nhân của người dùng. Chính sách bảo mật này giải thích cách chúng tôi
                    thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi sử dụng dịch vụ tuyển dụng trực tuyến của chúng tôi.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. THÔNG TIN CHÚNG TÔI THU THẬP</h2>

                  <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Thông tin cá nhân của ứng viên:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Họ tên, ngày sinh, giới tính</li>
                    <li>Địa chỉ email, số điện thoại</li>
                    <li>Địa chỉ thường trú, nơi ở hiện tại</li>
                    <li>Trình độ học vấn, kinh nghiệm làm việc</li>
                    <li>CV, thư xin việc và các tài liệu đính kèm</li>
                    <li>Ảnh đại diện (nếu có)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Thông tin của nhà tuyển dụng:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Tên công ty, mã số thuế</li>
                    <li>Thông tin người đại diện pháp luật</li>
                    <li>Địa chỉ trụ sở, chi nhánh</li>
                    <li>Lĩnh vực hoạt động, quy mô công ty</li>
                    <li>Thông tin liên hệ (email, điện thoại)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3">2.3 Thông tin kỹ thuật:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Địa chỉ IP, thông tin trình duyệt</li>
                    <li>Cookies và dữ liệu phiên làm việc</li>
                    <li>Lịch sử truy cập và tương tác trên website</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. CÁCH CHÚNG TÔI SỬ DỤNG THÔNG TIN</h2>

                  <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Đối với ứng viên:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Tạo và quản lý hồ sơ cá nhân</li>
                    <li>Kết nối với các cơ hội việc làm phù hợp</li>
                    <li>Gửi thông báo về việc làm mới</li>
                    <li>Cải thiện trải nghiệm người dùng</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3">3.2 Đối với nhà tuyển dụng:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Xác minh thông tin công ty</li>
                    <li>Đăng tải và quản lý tin tuyển dụng</li>
                    <li>Tìm kiếm và liên hệ với ứng viên</li>
                    <li>Cung cấp báo cáo thống kê tuyển dụng</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. CHIA SẺ THÔNG TIN</h2>
                  <p className="text-foreground leading-relaxed mb-4">Chúng tôi chỉ chia sẻ thông tin của bạn trong các trường hợp sau:</p>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Với sự đồng ý rõ ràng của bạn</li>
                    <li>Khi pháp luật yêu cầu</li>
                    <li>Để bảo vệ quyền lợi hợp pháp của Career Point</li>
                    <li>Với các đối tác dịch vụ được ủy quyền (tuân thủ nghiêm ngặt các biện pháp bảo mật)</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. BẢO MẬT VÀ LƯU TRỮ</h2>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Sử dụng mã hóa SSL/TLS cho tất cả dữ liệu truyền tải</li>
                    <li>Lưu trữ dữ liệu trên máy chủ bảo mật với tường lửa</li>
                    <li>Thực hiện sao lưu định kỳ và kiểm tra bảo mật</li>
                    <li>Chỉ nhân viên được ủy quyền mới có quyền truy cập dữ liệu</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. QUYỀN CỦA NGƯỜI DÙNG</h2>
                  <p className="text-foreground leading-relaxed mb-4">Bạn có quyền:</p>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Truy cập và chỉnh sửa thông tin cá nhân</li>
                    <li>Yêu cầu xóa tài khoản và dữ liệu</li>
                    <li>Từ chối nhận email marketing</li>
                    <li>Khiếu nại về việc xử lý dữ liệu cá nhân</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. LIÊN HỆ</h2>
                  <p className="text-foreground leading-relaxed mb-4">Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ:</p>
                  <ul className="list-none mb-4 text-foreground leading-relaxed">
                    <li>
                      Email:{" "}
                      <a href="mailto:privacy@careerpoint.vn" className="text-accent hover:underline">
                        privacy@careerpoint.vn
                      </a>
                    </li>
                    <li>Điện thoại: 1900-xxxx</li>
                    <li>Địa chỉ: [Địa chỉ công ty]</li>
                  </ul>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
