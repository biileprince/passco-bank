"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Global flag to prevent multiple concurrent One Tap requests
let isOneTapPending = false;

// LocalStorage key for tracking dismissals
const ONE_TAP_DISMISSED_KEY = "google-one-tap-dismissed";

export function GoogleOneTap() {
  const hasInitialized = useRef(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Don't show One Tap if user is already logged in or still loading
    if (isPending || session?.user) return;

    // Check if user previously dismissed One Tap (never show again)
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(ONE_TAP_DISMISSED_KEY)
    ) {
      console.log(
        "Google One Tap: User previously dismissed, not showing again"
      );
      return;
    }

    // Prevent multiple concurrent requests
    if (hasInitialized.current || isOneTapPending) return;

    // Only run on client side
    if (typeof window === "undefined") return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.log("Google One Tap: Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
      return;
    }

    // Mark as initialized and pending
    hasInitialized.current = true;
    isOneTapPending = true;

    // Use Better Auth's built-in oneTap method
    const initOneTap = async () => {
      try {
        await authClient.oneTap({
          callbackURL: "/dashboard", // Where to redirect after successful login
          fetchOptions: {
            onSuccess: (context) => {
              // The user's email is in context.data.user.email
              const userEmail = context?.data?.user?.email;
              console.log("Google One Tap sign-in successful", {
                email: userEmail,
              });

              // Reset flags before navigation
              isOneTapPending = false;

              // Use soft navigation instead of hard reload
              router.push("/dashboard");
              router.refresh();
            },
            onError: (context) => {
              console.error("Google One Tap sign-in failed:", context.error);

              // Check for CORS errors
              if (
                context.error?.message?.includes("CORS") ||
                context.error?.message?.includes("ERR_FAILED")
              ) {
                console.error(
                  "CORS Error - Check your production domain is added to Google Cloud Console:\n" +
                    "1. Go to https://console.cloud.google.com/apis/credentials\n" +
                    "2. Add your production domain to 'Authorized JavaScript origins'\n" +
                    "3. Add your callback URL to 'Authorized redirect URIs'\n" +
                    "4. Make sure BETTER_AUTH_URL environment variable is set to your production domain"
                );
              }

              // Reset flags so user can try again
              hasInitialized.current = false;
              isOneTapPending = false;
            },
          },
          // Handle when user dismisses the prompt
          onPromptNotification: (notification) => {
            console.warn("One Tap prompt dismissed or skipped:", notification);

            // Safely check if notification has the expected methods
            const isNotDisplayed =
              notification && typeof notification.isNotDisplayed === "function"
                ? notification.isNotDisplayed()
                : false;
            const isSkipped =
              notification && typeof notification.isSkippedMoment === "function"
                ? notification.isSkippedMoment()
                : false;
            const isDismissed =
              notification &&
              typeof notification.isDismissedMoment === "function"
                ? notification.isDismissedMoment()
                : false;

            // If user dismissed or skipped, save to localStorage (never show again)
            if (isNotDisplayed || isSkipped || isDismissed) {
              console.log("User closed Google One Tap - will not show again");

              // Save dismissal state to localStorage
              if (typeof window !== "undefined") {
                localStorage.setItem(ONE_TAP_DISMISSED_KEY, "true");
              }

              // Reset flags
              hasInitialized.current = false;
              isOneTapPending = false;
            }
          },
        });
      } catch (error) {
        console.error("Failed to initialize Google One Tap:", error);

        // Provide helpful debugging info for production errors
        if (error instanceof Error) {
          if (
            error.message.includes("IdentityCredentialError") ||
            error.message.includes("CORS") ||
            error.message.includes("ERR_FAILED")
          ) {
            console.error(
              "\n🔧 PRODUCTION SETUP CHECKLIST:\n" +
                "1. Add your production domain to Google Cloud Console > Authorized JavaScript origins\n" +
                "2. Add callback URL to Authorized redirect URIs\n" +
                "3. Set BETTER_AUTH_URL and NEXT_PUBLIC_BETTER_AUTH_URL to your production domain\n" +
                "4. Ensure GOOGLE_CLIENT_ID matches the one in Google Cloud Console\n" +
                "5. Verify your domain is using HTTPS (required for One Tap)\n" +
                "\n📍 Current baseURL: " +
                (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "Not set")
            );
          }
        }

        // Reset flags on error
        hasInitialized.current = false;
        isOneTapPending = false;
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initOneTap, 500);

    return () => {
      clearTimeout(timer);
      // Clean up if component unmounts during pending request
      if (isOneTapPending) {
        isOneTapPending = false;
      }
    };
  }, [session, isPending, router]);

  return null;
}
