import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // รับทุก origin ใน dev mode
  allowedDevOrigins: ["*"],

  // Proxy /api/* ไปยัง backend container โดยใช้ Docker service name
  // ทำให้ browser เรียก relative URL ได้ — ไม่ต้อง hardcode IP เลย
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://backend:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
