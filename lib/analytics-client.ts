"use client";

/**
 * Analytics Client
 *
 * Simple client-side utility for tracking custom user events.
 *
 * Usage:
 * ```typescript
 * import { trackEvent } from '@/lib/analytics-client';
 *
 * // Track a button click
 * trackEvent('button_click', 'interaction', 'cta_button', { page: 'home' });
 *
 * // Track a form submission
 * trackEvent('form_submit', 'conversion', 'contact_form');
 * ```
 */

/**
 * Track a custom user event
 *
 * @param action - The action name (e.g., 'button_click', 'form_submit')
 * @param category - Optional category (e.g., 'interaction', 'conversion', 'navigation')
 * @param label - Optional label for additional context
 * @param value - Optional JSON data object
 */
export async function trackEvent(
  action: string,
  category?: string,
  label?: string,
  value?: Record<string, unknown>
): Promise<void> {
  try {
    const sessionId = getSessionId();

    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        category,
        label,
        value,
        sessionId,
      }),
    });
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}

/**
 * Get the current analytics session ID from cookies
 */
function getSessionId(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split("; ");
  const sessionCookie = cookies.find((c) => c.startsWith("analytics_session="));
  return sessionCookie?.split("=")[1];
}

/**
 * Track a page view manually (useful for SPAs with client-side routing)
 * Note: Page views are automatically tracked by the proxy, so this is rarely needed
 */
export async function trackPageView(path?: string): Promise<void> {
  try {
    await trackEvent(
      "page_view",
      "navigation",
      path || window.location.pathname
    );
  } catch (error) {
    console.error("Failed to track page view:", error);
  }
}

/**
 * Track a button click
 */
export async function trackButtonClick(
  buttonName: string,
  location?: string
): Promise<void> {
  await trackEvent("button_click", "interaction", buttonName, { location });
}

/**
 * Track a form submission
 */
export async function trackFormSubmit(
  formName: string,
  success: boolean = true
): Promise<void> {
  await trackEvent("form_submit", "conversion", formName, { success });
}

/**
 * Track a file download
 */
export async function trackDownload(
  fileName: string,
  fileType?: string
): Promise<void> {
  await trackEvent("download", "interaction", fileName, { fileType });
}

/**
 * Track an external link click
 */
export async function trackExternalLink(url: string): Promise<void> {
  await trackEvent("external_link", "navigation", url);
}

/**
 * Track a video play
 */
export async function trackVideoPlay(
  videoName: string,
  duration?: number
): Promise<void> {
  await trackEvent("video_play", "engagement", videoName, { duration });
}

/**
 * Track a search query
 */
export async function trackSearch(
  query: string,
  resultsCount?: number
): Promise<void> {
  await trackEvent("search", "interaction", query, { resultsCount });
}
