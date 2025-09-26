import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ChevronRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto border-2 shadow-md">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy công việc</h1>
          <p className="text-muted-foreground mb-6">Công việc bạn tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
          <Link href="/jobs">
            <Button className="bg-primary hover:bg-primary/90 group relative overflow-hidden cursor-pointer">
              <span className="relative z-10 flex items-center justify-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
                Xem việc làm khác
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
