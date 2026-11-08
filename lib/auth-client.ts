import { createAuthClient } from "better-auth/react";
import { oneTapClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      autoSelect: true, // Auto-select account if user is already signed in to Google
      cancelOnTapOutside: true, // Close popup when clicking outside
      context: "signin", // Context: "signin", "signup", or "use"
      // Configure prompt behavior
      promptOptions: {
        baseDelay: 0, // No delay for retries
        maxAttempts: 1, // Only show once, no retries
        fedCM: false, // Disable FedCM to fix network errors
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
