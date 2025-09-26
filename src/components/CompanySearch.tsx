"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter } from "lucide-react";
import type { CompanySearchParams } from "@/types/company";

interface CompanySearchProps {
  onSearch: (params: CompanySearchParams) => void;
  onReset?: () => void;
  loading?: boolean;
}

const industries = [
  "Information Technology",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Construction",
  "Transportation",
  "Real Estate",
  "Media & Entertainment",
];

export function CompanySearch({ onSearch, onReset, loading }: CompanySearchProps) {
  const [searchParams, setSearchParams] = useState<CompanySearchParams>({
    query: "",
    industry: "",
    isVerified: undefined,
    page: 1,
    limit: 10,
  });

  const handleSearch = () => {
    onSearch({ ...searchParams, page: 1 });
  };

  const handleReset = () => {
    const resetParams = {
      query: "",
      industry: "",
      isVerified: undefined,
      page: 1,
      limit: 10,
    };
    setSearchParams(resetParams);
    if (onReset) {
      onReset();
    } else {
      onSearch(resetParams);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Tìm kiếm công ty</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Keyword */}
        <div className="space-y-2">
          <Label htmlFor="search-query">Từ khoá</Label>
          <Input
            id="search-query"
            placeholder="Tên công ty"
            value={searchParams.query || ""}
            onChange={(e) => setSearchParams((prev) => ({ ...prev, query: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label>Ngành nghề</Label>
          <Select
            value={searchParams.industry || "all"}
            onValueChange={(value) => setSearchParams((prev) => ({ ...prev, industry: value === "all" ? "" : value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Limit */}
        <div className="space-y-2">
          <Label>Kết quả/trang</Label>
          <Select
            value={searchParams.limit?.toString() || "10"}
            onValueChange={(value) => setSearchParams((prev) => ({ ...prev, limit: Number.parseInt(value) }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 công ty</SelectItem>
              <SelectItem value="10">10 công ty</SelectItem>
              <SelectItem value="20">20 công ty</SelectItem>
              <SelectItem value="50">50 công ty</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verified checkbox */}
        <div className="flex items-end space-x-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={searchParams.isVerified === true}
              onCheckedChange={(checked) =>
                setSearchParams((prev) => ({
                  ...prev,
                  isVerified: checked === true ? true : undefined,
                }))
              }
            />
            <Label htmlFor="verified" className="text-sm">
              Chỉ công ty xác thực
            </Label>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button onClick={handleSearch} disabled={loading} className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={loading}>
          Đặt lại
        </Button>
      </div>
    </div>
  );
}
