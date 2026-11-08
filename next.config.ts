import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Add headers for FedCM and Better Auth CORS
  async headers() {
    const headers = [];

    // FedCM requires specific Referrer-Policy in development
    if (process.env.NODE_ENV !== "production") {
      headers.push({
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
        ],
      });
    }

    // CORS headers for Better Auth API endpoints (both dev and prod)
    headers.push({
      source: "/api/auth/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value:
            process.env.NODE_ENV === "production"
              ? process.env.NEXT_PUBLIC_SITE_URL || "https://www.axiomcraft.dev"
              : "http://localhost:3000",
        },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET, POST, PUT, DELETE, OPTIONS",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type, Authorization, X-Requested-With",
        },
        {
          key: "Access-Control-Allow-Credentials",
          value: "true",
        },
      ],
    });

    return headers;
  },
};

export default nextConfig;
