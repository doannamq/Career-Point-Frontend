import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    logo: "/placeholder.svg?height=40&width=40",
    applications: 25,
    timeAgo: "2 giờ trước",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    logo: "/placeholder.svg?height=40&width=40",
    applications: 18,
    timeAgo: "4 giờ trước",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Design Studio",
    logo: "/placeholder.svg?height=40&width=40",
    applications: 12,
    timeAgo: "6 giờ trước",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "Cloud Solutions",
    logo: "/placeholder.svg?height=40&width=40",
    applications: 8,
    timeAgo: "8 giờ trước",
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "AI Corp",
    logo: "/placeholder.svg?height=40&width=40",
    applications: 15,
    timeAgo: "1 ngày trước",
  },
];

export function RecentJobs() {
  return (
    <div className="space-y-8">
      {recentJobs.map((job) => (
        <div key={job.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={job.logo || "/placeholder.svg"} alt={job.company} />
            <AvatarFallback>{job.company.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{job.title}</p>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-medium">{job.applications} ứng tuyển</p>
            <p className="text-sm text-muted-foreground">{job.timeAgo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
