"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Founder",
    company: "TechStart Inc",
    content:
      "Working with AxiomCraft was an incredible experience. They delivered our e-commerce site ahead of schedule and it exceeded all expectations. Sales increased by 40% in the first month!",
    rating: 5,
    avatar: "SJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Marketing Director",
    company: "GrowthLabs",
    content:
      "The attention to detail was remarkable. Our new website not only looks stunning but also loads incredibly fast. The SEO improvements have doubled our organic traffic.",
    rating: 5,
    avatar: "MC",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "President",
    company: "Student Council",
    content:
      "They understood exactly what our student association needed. The event management features and member portal have transformed how we engage with our community.",
    rating: 5,
    avatar: "ER",
  },
  {
    id: 4,
    name: "David Park",
    role: "CEO",
    company: "CloudSync Solutions",
    content:
      "Professional, responsive, and highly skilled. The custom dashboard they built has streamlined our operations significantly. Highly recommend their services!",
    rating: 5,
    avatar: "DP",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Owner",
    company: "Bella Boutique",
    content:
      "As a small business owner, I needed someone who could explain things simply. AxiomCraft made the whole process easy and my online store looks amazing!",
    rating: 5,
    avatar: "LT",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Director",
    company: "NonProfit Connect",
    content:
      "They went above and beyond for our organization. The website has helped us reach more donors and volunteers than ever before. Truly grateful for their work.",
    rating: 5,
    avatar: "JW",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="shrink-0 w-70 sm:w-87.5 p-5 sm:p-6 rounded-2xl border border-border bg-background/50 backdrop-blur-sm shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-300 hover:shadow-xl hover:border-border/80">
      {/* Quote icon */}
      <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/30 mb-3 sm:mb-4" />

      {/* Content */}
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Rating */}
      <div className="flex gap-0.5 mb-3 sm:mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-500 text-yellow-500"
          />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-muted text-xs sm:text-sm font-semibold">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-xs sm:text-sm font-semibold">{testimonial.name}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full bg-muted/30 py-16 sm:py-24 overflow-hidden">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Testimonials
          </div>
          <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl text-emerald-600 dark:text-emerald-500">
            Loved by businesses
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Don&apos;t just take my word for it, here&apos;s what clients have
            to say about working together.
          </p>
        </motion.div>
      </div>

      {/* Testimonials Marquee */}
      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient Overlays */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 sm:w-32 bg-linear-to-r from-muted/30 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 sm:w-32 bg-linear-to-l from-muted/30 to-transparent" />

        {/* Single Row - Left to Right */}
        <motion.div
          className="flex gap-4 sm:gap-6"
          animate={{
            x: [0, -1200],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: isPaused ? 10000000 : 35,
              ease: "linear",
            },
          }}
        >
          {[...testimonials, ...testimonials, ...testimonials].map(
            (testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.id}-${index}`}
                testimonial={testimonial}
              />
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
