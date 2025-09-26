import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
            <h1 className="text-4xl font-bold text-primary mb-2">Điều khoản sử dụng</h1>
            <p className="text-muted-foreground">Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="prose prose-gray max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. CHẤP NHẬN ĐIỀU KHOẢN</h2>
                  <p className="text-foreground leading-relaxed mb-4">
                    Bằng việc truy cập và sử dụng website Career Point, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây. Nếu
                    không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. ĐỊNH NGHĨA DỊCH VỤ</h2>
                  <p className="text-foreground leading-relaxed mb-4">Career Point là nền tảng tuyển dụng trực tuyến cung cấp các dịch vụ:</p>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Đăng ký tài khoản cho ứng viên và nhà tuyển dụng</li>
                    <li>Đăng tải và tìm kiếm thông tin việc làm</li>
                    <li>Kết nối ứng viên với nhà tuyển dụng</li>
                    <li>Các dịch vụ hỗ trợ tuyển dụng khác</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. ĐĂNG KÝ TÀI KHOẢN</h2>

                  <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Yêu cầu chung:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Phải từ 18 tuổi trở lên</li>
                    <li>Cung cấp thông tin chính xác và đầy đủ</li>
                    <li>Chịu trách nhiệm bảo mật thông tin đăng nhập</li>
                    <li>Thông báo ngay khi phát hiện tài khoản bị xâm phạm</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3">3.2 Đối với nhà tuyển dụng:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Phải là doanh nghiệp được thành lập hợp pháp</li>
                    <li>Cung cấp giấy phép kinh doanh và các giấy tờ liên quan</li>
                    <li>Chịu trách nhiệm về tính chính xác của thông tin tuyển dụng</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. QUYỀN VÀ NGHĨA VỤ CỦA NGƯỜI DÙNG</h2>

                  <h3 className="text-xl font-semibold text-foreground mb-3">4.1 Quyền của ứng viên:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Tạo và cập nhật hồ sơ cá nhân</li>
                    <li>Tìm kiếm và ứng tuyển việc làm</li>
                    <li>Nhận thông báo về cơ hội việc làm</li>
                    <li>Liên hệ trực tiếp với nhà tuyển dụng</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3">4.2 Nghĩa vụ của ứng viên:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Cung cấp thông tin CV chính xác</li>
                    <li>Không tạo nhiều tài khoản cho cùng một người</li>
                    <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                    <li>Tôn trọng quyền riêng tư của các bên khác</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3">4.3 Quyền của nhà tuyển dụng:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Đăng tin tuyển dụng và quản lý ứng viên</li>
                    <li>Tìm kiếm hồ sơ ứng viên phù hợp</li>
                    <li>Liên hệ và phỏng vấn ứng viên</li>
                    <li>Sử dụng các công cụ hỗ trợ tuyển dụng</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3">4.4 Nghĩa vụ của nhà tuyển dụng:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Đảm bảo thông tin tuyển dụng chính xác</li>
                    <li>Không đăng tin tuyển dụng giả mạo</li>
                    <li>Tuân thủ pháp luật lao động</li>
                    <li>Bảo mật thông tin ứng viên</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. NỘI DUNG VÀ HÀNH VI BỊ CẤM</h2>
                  <p className="text-foreground leading-relaxed mb-4">Nghiêm cấm các hành vi sau:</p>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Đăng nội dung vi phạm pháp luật, đạo đức xã hội</li>
                    <li>Spam, gửi tin nhắn quấy rối</li>
                    <li>Sử dụng thông tin cá nhân của người khác</li>
                    <li>Tấn công, phá hoại hệ thống</li>
                    <li>Đăng tin tuyển dụng lừa đảo</li>
                    <li>Vi phạm bản quyền, sở hữu trí tuệ</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. PHÍ DỊCH VỤ</h2>

                  <h3 className="text-xl font-semibold text-foreground mb-3">6.1 Dịch vụ miễn phí:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Đăng ký tài khoản cơ bản</li>
                    <li>Tìm kiếm và ứng tuyển việc làm</li>
                    <li>Đăng tin tuyển dụng cơ bản (có giới hạn)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3">6.2 Dịch vụ trả phí:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Gói tuyển dụng nâng cao cho nhà tuyển dụng</li>
                    <li>Dịch vụ tìm kiếm ứng viên chuyên sâu</li>
                    <li>Quảng cáo tin tuyển dụng</li>
                    <li>Hỗ trợ tư vấn tuyển dụng</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. TRÁCH NHIỆM VÀ GIỚI HẠN</h2>

                  <h3 className="text-xl font-semibold text-foreground mb-3">7.1 Trách nhiệm của Career Point:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Cung cấp dịch vụ ổn định và bảo mật</li>
                    <li>Bảo vệ thông tin cá nhân người dùng</li>
                    <li>Hỗ trợ kỹ thuật khi cần thiết</li>
                    <li>Xử lý khiếu nại một cách công bằng</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3">7.2 Giới hạn trách nhiệm:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Không chịu trách nhiệm về chất lượng ứng viên/việc làm</li>
                    <li>Không đảm bảo kết quả tuyển dụng thành công</li>
                    <li>Không chịu trách nhiệm về tranh chấp giữa các bên</li>
                    <li>Không bồi thường thiệt hại gián tiếp</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. SỬA ĐỔI ĐIỀU KHOẢN</h2>
                  <p className="text-foreground leading-relaxed mb-4">
                    Career Point có quyền sửa đổi điều khoản sử dụng bất kỳ lúc nào. Thông báo sửa đổi sẽ được đăng tải trên website ít nhất 7 ngày
                    trước khi có hiệu lực.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. CHẤM DỨT DỊCH VỤ</h2>

                  <h3 className="text-xl font-semibold text-foreground mb-3">9.1 Người dùng có thể:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Xóa tài khoản bất kỳ lúc nào</li>
                    <li>Ngừng sử dụng dịch vụ mà không cần thông báo</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3">9.2 Career Point có quyền:</h3>
                  <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                    <li>Tạm khóa/khóa vĩnh viễn tài khoản vi phạm</li>
                    <li>Chấm dứt dịch vụ với thông báo trước 30 ngày</li>
                    <li>Xóa dữ liệu sau khi chấm dứt dịch vụ</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">10. GIẢI QUYẾT TRANH CHẤP</h2>
                  <p className="text-foreground leading-relaxed mb-4">
                    Mọi tranh chấp sẽ được giải quyết thông qua thương lượng. Nếu không thành, tranh chấp sẽ được giải quyết tại Tòa án có thẩm quyền
                    tại Việt Nam theo pháp luật Việt Nam.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">11. THÔNG TIN LIÊN HỆ</h2>
                  <p className="text-foreground leading-relaxed mb-4">Mọi thắc mắc về điều khoản sử dụng:</p>
                  <ul className="list-none mb-4 text-foreground leading-relaxed">
                    <li>
                      Email:{" "}
                      <a href="mailto:support@careerpoint.vn" className="text-accent hover:underline">
                        support@careerpoint.vn
                      </a>
                    </li>
                    <li>Điện thoại: 1900-xxxx</li>
                    <li>Địa chỉ: [Địa chỉ công ty]</li>
                  </ul>
                </section>

                <div className="bg-muted p-6 rounded-lg">
                  <p className="text-center text-foreground font-semibold">
                    Điều khoản này có hiệu lực từ ngày {new Date().toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
