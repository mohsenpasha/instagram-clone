import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
          {
            protocol: "http",
            hostname: "localhost",
            port: "8000",
          },
        ],
        domains: ["localhost"],
      },

};

export default nextConfig;
