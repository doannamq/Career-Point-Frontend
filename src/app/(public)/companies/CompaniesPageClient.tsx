"use client";

import { useState, useEffect } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { CompanySearch } from "@/components/CompanySearch";
import { Pagination } from "@/components/CompanyPagination";
import { searchCompany } from "@/lib/api/company";
import { Loader2, Building2, Search, RefreshCw } from "lucide-react";
import type { Company, CompanySearchParams, Pagination as PaginationType } from "@/types/company";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState(0);

  const handleSearch = async (params: CompanySearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchCompany(params);

      if (response && response.success) {
        setCompanies(response.data.companies);
        setPagination(response.data.pagination);
      } else {
        setError("Unable to load company list");
        setCompanies([]);
      }
    } catch (err) {
      setError("An error occurred while loading data");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    handleSearch({ page, limit: pagination.limit });
  };

  // Load initial data
  useEffect(() => {
    handleSearch({ page: 1, limit: 10 });
  }, []);

  const handleReset = () => {
    setSearchKey((k) => k + 1); // change key to reset state
    handleSearch({ page: 1, limit: 10, query: "", industry: "", isVerified: undefined });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Doanh nghiệp tuyển dụng</h1>
          </div>
          <p className="text-muted-foreground">Khám phá công ty hàng đầu và cơ hội nghề nghiệp phù hợp với bạn.</p>
        </div>

        {/* Search */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15, duration: 0.5 },
            },
          }}
          className="mb-8">
          <CompanySearch key={searchKey} onSearch={handleSearch} onReset={handleReset} loading={loading} />
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : companies.length === 0 ? (
          <motion.div
            className="text-center py-12 border rounded-lg bg-muted/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-muted rounded-full p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mt-2">Không tìm thấy công ty phù hợp</h3>
              <p className="text-muted-foreground mt-1 max-w-md">
                Không có công ty nào phù hợp với tiêu chí tìm kiếm. Hãy thử thay đổi bộ lọc hoặc từ khóa.
              </p>
              <Button variant="outline" onClick={handleReset} className="mt-4 gap-2">
                <RefreshCw className="h-4 w-4" />
                Xoá bộ lọc
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Đã tìm thấy {pagination.total} công ty</p>
            </div>

            {/* Company grid */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.15, duration: 0.5 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </motion.div>

            {/* Pagination */}
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}
