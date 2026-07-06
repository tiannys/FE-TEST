import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // รับทุก origin ใน dev mode — ไม่ต้อง hardcode IP
  allowedDevOrigins: ["*"],
};

export default nextConfig;
