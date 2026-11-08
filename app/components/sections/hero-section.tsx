"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-60" />
      </div>

      {/* Floating shapes for aesthetic design - visible in both modes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full blur-3xl"
        />
        {/* Top right shape */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute top-40 right-20 w-96 h-96 bg-primary/15 dark:bg-primary/25 rounded-full blur-3xl"
        />
        {/* Bottom left shape */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-500/15 dark:bg-blue-500/25 rounded-full blur-3xl"
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Text Content */}
          <div className="mx-auto max-w-2xl lg:max-w-none text-center lg:text-left">
            {/* Badge with "Are you looking for a website?" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 sm:mb-8 inline-flex"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 dark:bg-background/90 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-foreground dark:text-foreground">
                  Are you looking for a website or an app?
                </span>
              </div>
            </motion.div>

            {/* Main Headline - More descriptive for everyone */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 sm:mb-6 text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl max-w-2xl lg:max-w-none"
            >
              We build{" "}
              <span className="relative inline-block">
                <span className="text-emerald-500">stunning websites</span>
              </span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              that{" "}
              <span className="text-muted-foreground">grow your business</span>
            </motion.h1>

            {/* Sub-headline - More descriptive */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 sm:mb-8 text-base sm:text-lg text-muted-foreground md:text-xl max-w-2xl lg:max-w-none leading-relaxed"
            >
              Whether you need an online store, business website, or custom web
              app, we design and develop professional websites and mobile apps
              that attract customers and help your business succeed.
            </motion.p>

            {/* Trust points - Quick value props */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mb-8 flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 sm:gap-x-6 text-xs sm:text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                Fast & Secure
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                Mobile Friendly
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                SEO Optimized
              </span>
            </motion.div>

            {/* CTA Buttons - Pill style like Resend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group h-11 sm:h-12 w-full sm:w-auto rounded-full px-6 sm:px-8 text-sm sm:text-base font-semibold shadow-none cursor-pointer"
                >
                  Tell Us Your Project
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/work" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 sm:h-12 w-full sm:w-auto rounded-full px-6 sm:px-8 text-sm sm:text-base font-semibold border-border hover:bg-accent cursor-pointer"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  View Our Work
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right side - Image with decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative mt-8 lg:mt-0"
          >
            {/* Decorative border frame */}
            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 via-primary/10 to-blue-500/20 rounded-3xl blur-2xl" />

            {/* Main image container */}
            <div className="relative rounded-2xl border-2 border-border dark:border-border/80 bg-background/90 dark:bg-background/95 backdrop-blur-sm p-4 shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 via-primary/5 to-blue-500/10">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                  alt="Laptop displaying modern website design"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  unoptimized
                />
              </div>

              {/* Decorative code snippet overlay */}
              <div className="absolute top-8 right-8 bg-background dark:bg-background border-2 border-emerald-500/50 dark:border-emerald-400/50 backdrop-blur-md rounded-lg px-4 py-2 shadow-xl">
                <code className="text-sm text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  &lt;YourIdea /&gt;
                </code>
              </div>

              {/* Floating stat badge */}
              <div className="absolute bottom-8 left-8 bg-background dark:bg-background backdrop-blur-md border-2 border-border dark:border-border/80 rounded-lg px-4 py-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/30 dark:bg-emerald-500/40 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground dark:text-foreground">
                      100%
                    </div>
                    <div className="text-xs text-muted-foreground dark:text-muted-foreground font-medium">
                      Satisfaction
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative geometric shapes */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-8 -right-8 w-20 h-20 border-2 border-emerald-500/30 rounded-lg"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-6 -left-6 w-16 h-16 border-2 border-primary/30 rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
