import { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.axiomcraft.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/api",
          "/login",
          "/register",
          "/_next",
          "/static",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api", "/login", "/register"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api", "/login", "/register"],
      },
      {
        userAgent: "Slurp",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api", "/login", "/register"],
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api", "/login", "/register"],
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
