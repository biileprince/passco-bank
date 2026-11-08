"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import { submitContactForm } from "@/app/actions/contact";
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    const result = await submitContactForm(data);

    setIsSubmitting(false);
    setSubmitStatus({
      type: result.success ? "success" : "error",
      message: result.message,
    });

    if (result.success) {
      reset();
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-muted/30 py-16 sm:py-24 md:py-32"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-50" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-4 sm:mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              Get in touch
            </div>
            <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl text-emerald-600 dark:text-emerald-500">
              Let&apos;s build something{" "}
              <span className="text-muted-foreground">great together</span>
            </h2>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Have a project in mind? We&apos;d love to hear about it. Send us a
              message and we&apos;ll get back to you within 24 hours.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-background p-3 sm:p-4">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-muted">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Email</p>
                  <a
                    href="mailto:biileprinceyennuyar5@gmail.com"
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    biileprinceyennuyar5@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-background p-3 sm:p-4">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-muted">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Phone</p>
                  <a
                    href="tel:+233555902675"
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    0555 902 675
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-background p-3 sm:p-4">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-muted">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">WhatsApp</p>
                  <a
                    href="https://wa.me/233555902675"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    0555 902 675
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-background p-3 sm:p-4">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-muted">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">
                    Response Time
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Usually within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-2xl border border-border bg-background p-5 sm:p-8 shadow-sm">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
              >
                {/* Name & Email Row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-xs sm:text-sm font-medium"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Kwame Mensah"
                      {...register("name")}
                      className={`h-10 sm:h-11 rounded-lg text-sm ${
                        errors.name ? "border-destructive" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs sm:text-sm font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="biileprince@gmail.com"
                      {...register("email")}
                      className={`h-10 sm:h-11 rounded-lg text-sm ${
                        errors.email ? "border-destructive" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0555902675"
                    {...register("phone")}
                    className="h-10 sm:h-11 rounded-lg text-sm"
                  />
                </div>

                {/* Project Type */}
                <div className="space-y-2">
                  <Label
                    htmlFor="projectType"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Project Type
                  </Label>
                  <Input
                    id="projectType"
                    placeholder="E.g., E-Commerce, Corporate Website, Web App..."
                    {...register("projectType")}
                    className={`h-10 sm:h-11 rounded-lg text-sm ${
                      errors.projectType ? "border-destructive" : ""
                    }`}
                  />
                  {errors.projectType && (
                    <p className="text-xs text-destructive">
                      {errors.projectType.message}
                    </p>
                  )}
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <Label
                    htmlFor="budget"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Budget{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="budget"
                    placeholder="E.g., GH₵2,000 - GH₵5,000"
                    {...register("budget")}
                    className="h-10 sm:h-11 rounded-lg text-sm"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Project Details
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project, timeline, and requirements..."
                    rows={4}
                    {...register("message")}
                    className={`rounded-lg resize-none text-sm ${
                      errors.message ? "border-destructive" : ""
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive">
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-10 sm:h-12 rounded-full font-semibold text-sm sm:text-base group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
