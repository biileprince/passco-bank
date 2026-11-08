"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowLeft, BookOpen } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { getStudentAuthEmail } from "@/lib/student-auth";

const programs = [
  "B.Ed. Basic Education",
  "B.Ed. Early Childhood",
  "Accounting",
  "Banking & Finance",
  "Management Studies",
  "Law",
  "English",
  "Political Science",
  "Biology",
  "Chemistry",
  "Computer Science",
  "Mathematics",
  "Nursing",
  "Public Health",
  "Other",
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const studentId = String(formData.get("studentId") || "").trim().toUpperCase();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp.email({
        email: getStudentAuthEmail(studentId),
        password,
        name: String(formData.get("name") || "").trim(),
      });

      if (result.error) {
        setError(result.error.message || "Failed to create account.");
        return;
      }

      const profileResponse = await fetch("/api/student-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          phone: formData.get("phone"),
          program: formData.get("program"),
        }),
      });

      if (!profileResponse.ok) {
        const profileError = (await profileResponse.json()) as { message?: string };
        setError(profileError.message || "Your account was created, but your student profile could not be saved.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (registrationError) {
      console.error("Registration error:", registrationError);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-28">
      <div className="w-full max-w-2xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgb(255,217,0)]/40 text-[rgb(6,119,0)]">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Join Oguaa Hall</h1>
              <p className="text-sm text-muted-foreground">Create your student account to access resources.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" placeholder="Kwame Mensah" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="studentId">UCC Student ID</Label>
              <Input id="studentId" name="studentId" placeholder="AB/XXX/00/0000" required />
              <p className="text-xs text-muted-foreground">This will be your login identifier.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Programme</Label>
              <select id="program" name="program" required className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
                <option value="">Select programme</option>
                {programs.map((program) => <option key={program}>{program}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="024 000 0000" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" required minLength={8} className="pr-11" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} required minLength={8} />
            </div>
            {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive sm:col-span-2">{error}</div>}
            <Button type="submit" className="h-11 bg-[rgb(6,119,0)] text-white hover:bg-[rgb(6,95,0)] sm:col-span-2" disabled={isLoading}>
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : "Create student account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-medium text-[rgb(6,119,0)] hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
