"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const companies = [
  { name: "GG", logo: "/images/gg_cloud.png" },
  { name: "VNG Corporation", logo: "/placeholder-ai5y8.png" },
  { name: "Viettel", logo: "/viettel-logo.png" },
  { name: "VNPT", logo: "/vnpt-logo.png" },
  { name: "Techcombank", logo: "/placeholder-6vbkc.png" },
  { name: "Vingroup", logo: "/placeholder-4qqwa.png" },
  { name: "Momo", logo: "/placeholder-5drut.png" },
  { name: "Grab", logo: "/generic-transportation-app-logo.png" },
  { name: "Shopee", logo: "/generic-e-commerce-logo.png" },
  { name: "Tiki", logo: "/placeholder-j3kez.png" },
  { name: "Zalo", logo: "/zalo-logo.jpg" },
  { name: "VinFast", logo: "/vinfast-logo.jpg" },
];

export default function InfiniteLogoCarousel() {
  // Duplicate the companies array to create seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className="w-full overflow-hidden bg-background py-8">
      <div className="relative">
        {/* Scrolling container */}
        <motion.div
          className="flex gap-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            width: `${duplicatedCompanies.length * 200}px`,
          }}>
          {duplicatedCompanies.map((company, index) => (
            <div key={`${company.name}-${index}`} className="flex-shrink-0 flex items-center justify-center h-24 w-64">
              <Image
                // src={company.logo || "/placeholder.svg"}
                src="/images/gg_cloud.png"
                width={400}
                height={200}
                alt={`${company.name} logo`}
                className="w-56 h-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
