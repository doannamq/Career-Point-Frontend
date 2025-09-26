interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 120, className = "" }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <svg width={size} height={size} viewBox="0 0 120 120" className="drop-shadow-lg">
          {/* Background circle */}
          <circle cx="60" cy="60" r="55" fill="url(#gradient)" stroke="#1e40af" strokeWidth="2" />

          {/* Letter C */}
          <path
            d="M 35 45 Q 25 35 35 35 L 50 35 Q 60 35 60 45 L 60 55 Q 60 65 50 65 L 45 65"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Letter P */}
          <path
            d="M 70 35 L 70 85 M 70 35 L 85 35 Q 95 35 95 45 L 95 50 Q 95 60 85 60 L 70 60"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Company Name */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-blue-600">Career Point</span>
        <span className="text-sm text-blue-500 tracking-wide">Tuyển dụng việc làm</span>
      </div>
    </div>
  );
}

export function LogoIcon({ size = 60, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={`drop-shadow-md ${className}`}>
      {/* Background circle */}
      <circle cx="60" cy="60" r="55" fill="url(#gradient-icon)" stroke="#1e40af" strokeWidth="2" />

      {/* Letter C */}
      <path
        d="M 35 45 Q 25 35 35 35 L 50 35 Q 60 35 60 45 L 60 55 Q 60 65 50 65 L 45 65"
        fill="none"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Letter P */}
      <path
        d="M 70 35 L 70 85 M 70 35 L 85 35 Q 95 35 95 45 L 95 50 Q 95 60 85 60 L 70 60"
        fill="none"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient-icon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
    </svg>
  );
}
