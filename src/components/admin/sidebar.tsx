"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Briefcase, Users, Building2, BarChart3, Settings, ChevronLeft, ChevronRight } from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Việc làm",
    href: "/admin/jobs",
    icon: Briefcase,
  },
  {
    name: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Công ty",
    href: "/admin/companies",
    icon: Building2,
  },
  {
    name: "Thống kê",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn("flex flex-col bg-white border-r border-gray-200 transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h1 className="text-xl font-bold text-gray-900">JobPortal Admin</h1>}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="ml-auto">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button variant={isActive ? "default" : "ghost"} className={cn("w-full justify-start", collapsed && "px-2")}>
                <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                {!collapsed && item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
