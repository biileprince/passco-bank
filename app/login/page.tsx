"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowLeft, BookOpen } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const checkAdminAndRedirect = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/check-admin");
      const data = (await response.json()) as { isAdmin?: boolean };
      router.push(data.isAdmin ? "/admin" : redirectTo);
    } catch (redirectError) {
      console.error("Redirect check failed:", redirectError);
      router.push(redirectTo);
    }
  }, [router, redirectTo]);

  useEffect(() => {
    if (session?.user) void checkAdminAndRedirect();
  }, [session, checkAdminAndRedirect]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const phone = String(formData.get("phone") || "").trim();
    const password = String(formData.get("password") || "");

    if (!phone || !password) {
      setError("Enter your phone number and password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/phone-sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      if (!response.ok) {
        setError("Invalid phone number or password.");
        return;
      }

      router.refresh();
      await checkAdminAndRedirect();
    } catch (loginError) {
      console.error("Login error:", loginError);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-28">
      <Image src="/kwame-eugene.jpeg" alt="" fill className="pointer-events-none object-cover object-top opacity-20" sizes="100vw" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(6,119,0,0.72),rgba(252,217,20,0.22)_55%,rgba(255,255,255,0.78))]" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <div className="rounded-2xl border border-border bg-background/95 p-8 shadow-xl backdrop-blur-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(255,217,0)]/40 text-[rgb(6,119,0)]">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to access Oguaa Hall resources.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="024 000 0000" required autoComplete="tel" className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" className="h-11 pr-11" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <Button type="submit" className="h-11 w-full bg-[rgb(6,119,0)] text-white hover:bg-[rgb(6,95,0)]" disabled={isLoading}>
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to the platform? <Link href="/register" className="font-medium text-[rgb(6,119,0)] hover:underline">Create a student account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
