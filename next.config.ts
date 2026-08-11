import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin paneldan bir formada 4 tagacha fayl (rasm, sertifikat,
      // yo'riqnoma) yuboriladi — standart 1 MB chegarasi yetmaydi.
      bodySizeLimit: "48mb",
    },
  },
};

export default nextConfig;
