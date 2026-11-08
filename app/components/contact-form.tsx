"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import { submitContactForm } from "@/app/actions/contact";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) {
        setValue("name", session.user.name);
      }
      if (session.user.email) {
        setValue("email", session.user.email);
      }
    }
  }, [session, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const result = await submitContactForm(data);

      setIsSubmitting(false);
      setSubmitStatus({
        type: result.success ? "success" : "error",
        message: result.message,
      });

      if (result.success) {
        // Only reset non-user fields
        if (!session?.user) {
          reset();
        } else {
          setValue("projectType", "");
          setValue("budget", "");
          setValue("message", "");
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-xs sm:text-sm font-medium mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Your name"
            {...register("name")}
            className={`w-full h-10 sm:h-11 rounded-lg border bg-background px-3 sm:px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${
              errors.name ? "border-destructive" : "border-border"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-medium mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="biileprince@gmail.com"
            {...register("email")}
            className={`w-full h-10 sm:h-11 rounded-lg border bg-background px-3 sm:px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${
              errors.email ? "border-destructive" : "border-border"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="block text-xs sm:text-sm font-medium mb-2"
          >
            Phone{" "}
            <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="0555902675"
            {...register("phone")}
            className="w-full h-10 sm:h-11 rounded-lg border border-border bg-background px-3 sm:px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
          />
        </div>
        <div>
          <label
            htmlFor="projectType"
            className="block text-xs sm:text-sm font-medium mb-2"
          >
            Project Type
          </label>
          <input
            type="text"
            id="projectType"
            placeholder="E.g., E-Commerce, Business Website"
            {...register("projectType")}
            className={`w-full h-10 sm:h-11 rounded-lg border bg-background px-3 sm:px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${
              errors.projectType ? "border-destructive" : "border-border"
            }`}
          />
          {errors.projectType && (
            <p className="text-xs text-destructive mt-1">
              {errors.projectType.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="budget"
          className="block text-xs sm:text-sm font-medium mb-2"
        >
          Budget{" "}
          <span className="text-muted-foreground text-xs">(Optional)</span>
        </label>
        <input
          type="text"
          id="budget"
          placeholder="E.g., GH₵2,000 - GH₵5,000"
          {...register("budget")}
          className="w-full h-10 sm:h-11 rounded-lg border border-border bg-background px-3 sm:px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs sm:text-sm font-medium mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell us about your project..."
          {...register("message")}
          className={`w-full rounded-lg border bg-background px-3 sm:px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all resize-none ${
            errors.message ? "border-destructive" : "border-border"
          }`}
        />
        {errors.message && (
          <p className="text-xs text-destructive mt-1">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Status Message */}
      {submitStatus.type && (
        <div
          className={`rounded-lg border p-3 sm:p-4 text-xs sm:text-sm ${
            submitStatus.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 sm:h-12 rounded-full bg-foreground text-background font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>

      <p className="text-xs sm:text-sm text-muted-foreground text-center">
        We&apos;ll get back to you within 24 hours.
      </p>
    </form>
  );
}
