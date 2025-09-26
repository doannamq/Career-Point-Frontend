"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Send,
  Star,
  Users,
  Building,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LogoIcon } from "../Logo";

export default function JobSearchFooter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    jobSeekers: [
      { name: "Việc làm", href: "/jobs", icon: <Briefcase className="h-4 w-4" /> },
      { name: "Công ty", href: "/companies", icon: <Building className="h-4 w-4" /> },
      { name: "Việc làm đã lưu", href: "/saved-jobs" },
      { name: "Tư vấn sự nghiệp", href: "/career-advice" },
      { name: "Bảng tham khảo lương", href: "/salary-guide" },
    ],
    employers: [
      { name: "Đăng tuyển", href: "/post-job", icon: <TrendingUp className="h-4 w-4" /> },
      { name: "Gói dịch vụ", href: "/pricing" },
      { name: "Góc nhân sự", href: "/resources" },
      { name: "Giải pháp tuyển dụng", href: "/talent-solutions" },
      { name: "Nền tảng tuyển dụng", href: "/recruiting-software" },
    ],
    company: [
      { name: "Về chúng tôi", href: "/about" },
      { name: "Liên hệ", href: "/contact" },
      { name: "Chính sách bảo mật", href: "/privacy" },
      { name: "Điều khoản", href: "/terms" },
      { name: "Cơ hội nghề nghiệp", href: "/careers" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      href: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      href: "https://twitter.com",
      color: "hover:text-sky-500",
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      href: "https://instagram.com",
      color: "hover:text-pink-600",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://linkedin.com",
      color: "hover:text-blue-700",
    },
  ];

  const contactInfo = [
    { icon: <Mail className="h-4 w-4" />, text: "contact@careerpoint.com", href: "mailto:contact@careerpoint.com" },
    { icon: <Phone className="h-4 w-4" />, text: "0865860262", href: "0865860262" },
    { icon: <MapPin className="h-4 w-4" />, text: "255/37 Cầu Giấy, Hà Nội, Việt Nam" },
  ];

  const stats = [
    { number: "50K+", label: "Việc làm", icon: <Briefcase className="h-5 w-5" /> },
    { number: "10K+", label: "Công ty", icon: <Building className="h-5 w-5" /> },
    { number: "100K+", label: "Ứng viên", icon: <Users className="h-5 w-5" /> },
    { number: "95%", label: "Tỷ lệ thành công", icon: <Star className="h-5 w-5" /> },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      {/* Stats Section */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}>
            {stats.map((stat, index) => (
              <motion.div key={index} variants={item} className="text-center group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-all duration-300">
                  <div className="text-blue-600">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section */}
        <div className="grid gap-12 lg:grid-cols-3 mb-16">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center group mb-6">
              <LogoIcon size={40} />
              <div className="ml-3">
                <span className="text-2xl font-bold text-blue-500">Career Point</span>
                <div className="text-sm text-gray-500 -mt-1">Điểm đến sự nghiệp của bạn</div>
              </div>
            </Link>

            <p className="text-gray-600 leading-relaxed mb-6">
              Đồng hành cùng hành trình sự nghiệp và tuyển dụng của bạn. Giúp bạn tìm đúng người – đúng việc,
            </p>

            {/* Contact information */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}>
                  <div className="text-blue-500 mr-3 p-2 bg-blue-50 rounded-lg">{item.icon}</div>
                  {item.href ? (
                    <a href={item.href} className="hover:underline">
                      {item.text}
                    </a>
                  ) : (
                    item.text
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social media */}
            <div className="mt-8">
              <p className="text-sm font-medium text-gray-900 mb-4">Theo dõi chúng tôi</p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-gray-100 hover:bg-white text-gray-600 ${social.color} rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md`}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    aria-label={social.name}>
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="lg:col-span-2 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 border border-blue-100">
              <div className="max-w-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Đăng ký nhận tin việc làm</h3>
                <p className="text-gray-600 mb-6">Nhận cơ hội việc làm mới nhất, mẹo phát triển sự nghiệp và thông tin từ các công ty hàng đầu.</p>

                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="h-12 pr-12 border-2 border-white bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                      <Mail className="h-5 w-5" />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300">
                      {isSubscribed ? (
                        <>
                          Subscribed!
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            className="ml-2">
                            ✓
                          </motion.div>
                        </>
                      ) : (
                        <>
                          Đăng ký ngay
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>100% Miễn phí</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span>Không spam</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <Separator className="my-12" />

        {/* Links section */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}>
          <motion.div variants={item}>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              Dành cho bạn
            </h3>
            <ul className="space-y-3">
              {footerLinks.jobSeekers.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group text-sm">
                    <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200 -ml-5 group-hover:ml-0" />
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={item}>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="h-4 w-4 text-green-600" />
              </div>
              For Employers
            </h3>
            <ul className="space-y-3">
              {footerLinks.employers.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-green-600 transition-colors duration-200 flex items-center group text-sm">
                    <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200 -ml-5 group-hover:ml-0" />
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={item}>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-orange-600" />
              </div>
              Career Point
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-orange-600 transition-colors duration-200 flex items-center group text-sm">
                    <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200 -ml-5 group-hover:ml-0" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={item}>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Tải App</h3>
            <div className="space-y-3">
              <motion.a href="#" className="block" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="bg-black text-white rounded-xl p-3 flex items-center gap-3 hover:bg-gray-800 transition-colors">
                  <div className="text-2xl">📱</div>
                  <div>
                    <div className="text-xs text-gray-300">Tải từ</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </div>
              </motion.a>
              <motion.a href="#" className="block" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="bg-black text-white rounded-xl p-3 flex items-center gap-3 hover:bg-gray-800 transition-colors">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <div className="text-xs text-gray-300">Tải từ</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p
              className="text-sm text-gray-500 text-center md:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}>
              © {new Date().getFullYear()} Career Point. All rights reserved.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}>
              <Link href="/accessibility" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                Accessibility
              </Link>
              <Link href="/sitemap" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                Sitemap
              </Link>
              <Link href="/cookies" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/help" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                Help Center
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
