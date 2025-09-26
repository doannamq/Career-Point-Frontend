"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Eye, Edit, Trash2, Copy, Search, Calendar } from "lucide-react";
import Link from "next/link";
import { CVStorage, type SavedCV } from "@/lib/cv-storage";

export default function MyCVsPage() {
  const [cvs, setCvs] = useState<SavedCV[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = () => {
    setIsLoading(true);
    const savedCVs = CVStorage.getAllCVs();
    setCvs(savedCVs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    setIsLoading(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa CV này không?")) {
      CVStorage.deleteCV(id);
      loadCVs();
    }
  };

  const handleDuplicate = (id: string) => {
    const newId = CVStorage.duplicateCV(id);
    if (newId) {
      loadCVs();
    }
  };

  const handleEdit = (cv: SavedCV) => {
    localStorage.setItem("cvData", JSON.stringify(cv.data));
    localStorage.setItem("editingCVId", cv.id);
    window.location.href = "/cv-builder";
  };

  const handlePreview = (cv: SavedCV) => {
    localStorage.setItem("cvData", JSON.stringify(cv.data));
    window.open("/cv-builder/preview", "_blank");
  };

  const filteredCVs = cvs.filter(
    (cv) =>
      cv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.data.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Trang chủ
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CV của tôi</h1>
          </div>
          <Link href="/cv-builder">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo CV mới
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="max-w-md mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm CV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* CV List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
          </div>
        ) : filteredCVs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "Không tìm thấy CV nào" : "Chưa có CV nào"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Tạo CV đầu tiên của bạn ngay bây giờ"}
            </p>
            {!searchTerm && (
              <Link href="/cv-builder">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo CV đầu tiên
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCVs.map((cv) => (
              <Card key={cv.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{cv.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{cv.data.personalInfo.fullName}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {cv.data.experiences.length > 0 ? "Có kinh nghiệm" : "Sinh viên"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Cập nhật: {formatDate(cv.updatedAt)}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cv.data.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                      {cv.data.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{cv.data.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => handlePreview(cv)} className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </Button>
                      <Button size="sm" onClick={() => handleEdit(cv)} className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleDuplicate(cv.id)} className="flex-1">
                        <Copy className="w-4 h-4 mr-1" />
                        Sao chép
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(cv.id)}
                        className="flex-1 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
