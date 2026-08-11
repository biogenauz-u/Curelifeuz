import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin paneldan bir formada 4 tagacha fayl (rasm, sertifikat,
      // yo'riqnoma) yuboriladi — standart 1 MB chegarasi yetmaydi.
      bodySizeLimit: "48mb",
    },
  },
  images: {
    // Yuklangan fayllar endi Supabase Storage'da — next/image shu domendan
    // kelgan rasmlarni optimallashtirishi uchun ruxsat berilishi kerak.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
