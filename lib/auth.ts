import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { oneTap } from "better-auth/plugins";
import prisma from "./prisma";

// Auto-detect base URL for production
const getBaseURL = () => {
  // Use BETTER_AUTH_URL if set
  if (process.env.BETTER_AUTH_URL && process.env.BETTER_AUTH_URL !== "http://localhost:3000") {
    return process.env.BETTER_AUTH_URL;
  }
  
  // In production (Vercel), use VERCEL_URL or NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Fallback to localhost for development
  return "http://localhost:3000";
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
  },
  plugins: [
    oneTap(),
  ],
  secret: process.env.BETTER_AUTH_SECRET || "secret-key-change-in-production",
  baseURL: getBaseURL(),
});

export type Session = typeof auth.$Infer.Session;
