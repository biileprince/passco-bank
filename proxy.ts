import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseUserAgent(userAgent: string) {
  const os = /Windows/.test(userAgent)
    ? "Windows"
    : /Mac/.test(userAgent)
    ? "MacOS"
    : /Linux/.test(userAgent)
    ? "Linux"
    : /Android/.test(userAgent)
    ? "Android"
    : /iOS|iPhone|iPad/.test(userAgent)
    ? "iOS"
    : "Unknown";

  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /Chrome\//.test(userAgent)
    ? "Chrome"
    : /Safari\//.test(userAgent)
    ? "Safari"
    : /Firefox\//.test(userAgent)
    ? "Firefox"
    : /MSIE|Trident/.test(userAgent)
    ? "IE"
    : "Unknown";

  const device = /Mobile|Android|iPhone|iPad/.test(userAgent)
    ? "Mobile"
    : /Tablet/.test(userAgent)
    ? "Tablet"
    : "Desktop";

  return { os, browser, device };
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Skip tracking for API routes, static files, and internal Next.js routes
  if (
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return response;
  }

  try {
    const userAgent = request.headers.get("user-agent") || "";
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const referrer = request.headers.get("referer") || undefined;
    const deviceInfo = parseUserAgent(userAgent);

    // Get or create session ID from cookie
    let sessionId = request.cookies.get("analytics_session")?.value;
    const isNewSession = !sessionId;

    if (!sessionId) {
      // Use Web Crypto API (available in Edge runtime)
      sessionId = crypto.randomUUID();
      response.cookies.set("analytics_session", sessionId, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        sameSite: "lax",
      });
    }

    // Send analytics data to API route (fire and forget - non-blocking)
    const analyticsData = {
      path: request.nextUrl.pathname,
      referrer,
      ipAddress,
      userAgent,
      os: deviceInfo.os,
      browser: deviceInfo.browser,
      device: deviceInfo.device,
      sessionId,
      isNewSession,
    };

    // Use fetch to send data to API route without blocking
    fetch(new URL("/api/analytics/track-pageview", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(analyticsData),
    }).catch(() => {
      // Silently fail - analytics should never break the site
    });
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
