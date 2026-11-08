"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Building2,
  ShoppingCart,
  PenTool,
  UserCircle,
  Wrench,
  Smartphone,
  Database,
  Sparkles,
  LucideIcon,
} from "lucide-react";

interface Service {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  icon: LucideIcon;
}

const services: Service[] = [
  {
    title: "E-Commerce Stores",
    tagline: "Sell products online with ease",
    description:
      "Launch your own online shop where customers can browse, add to cart, and pay securely. Perfect for businesses wanting to sell products 24/7.",
    features: ["Secure payments", "Inventory tracking", "Order management"],
    icon: ShoppingCart,
  },
  {
    title: "Business Websites",
    tagline: "Establish your online presence",
    description:
      "Get a professional website that showcases your services, builds trust with visitors, and helps potential customers find and contact you easily.",
    features: ["Professional design", "Contact forms", "Google-friendly"],
    icon: Building2,
  },
  {
    title: "School & Club Websites",
    tagline: "Connect with your community",
    description:
      "Whether it's a student association, sports club, or community group, get a website to share events, news, and keep members engaged.",
    features: ["Event calendar", "Member area", "News updates"],
    icon: GraduationCap,
  },
  {
    title: "Blogs & News Sites",
    tagline: "Share your story with the world",
    description:
      "Start a blog or content website where you can write articles, share ideas, and grow an audience. Easy to update yourself with no tech skills needed.",
    features: ["Easy editing", "SEO optimized", "Social sharing"],
    icon: PenTool,
  },
  {
    title: "Landing Pages",
    tagline: "Convert visitors into customers",
    description:
      "One focused page designed to get visitors to take action, whether that's signing up, booking a call, or making a purchase.",
    features: ["High converting", "Fast loading", "A/B testing ready"],
    icon: UserCircle,
  },
  {
    title: "Mobile-Friendly Apps",
    tagline: "Reach users on any device",
    description:
      "Web applications that work beautifully on phones, tablets, and computers. Your customers can access your service from anywhere.",
    features: ["Works offline", "App-like feel", "Push notifications"],
    icon: Smartphone,
  },
  {
    title: "Mobile App Development",
    tagline: "Native apps for iOS & Android",
    description:
      "Build cross-platform mobile applications using React Native that work seamlessly on both iOS and Android devices, reaching millions of users.",
    features: ["React Native", "Cross-platform", "App Store ready"],
    icon: Smartphone,
  },
  {
    title: "Custom Web Apps",
    tagline: "Tailored solutions for your needs",
    description:
      "Need something specific? We build custom tools like booking systems, client portals, dashboards, and internal business applications.",
    features: ["Booking systems", "Client portals", "Admin dashboards"],
    icon: Database,
  },
  {
    title: "Website Makeovers",
    tagline: "Upgrade your outdated website",
    description:
      "Is your current website slow or looking dated? We'll redesign it with modern looks and faster performance while keeping your existing content.",
    features: ["Modern design", "Faster speed", "Better security"],
    icon: Sparkles,
  },
  {
    title: "Ongoing Support",
    tagline: "Keep your site running smoothly",
    description:
      "Websites need regular care. I provide updates, security checks, backups, and fixes so you can focus on running your business.",
    features: ["Regular updates", "Security patches", "Priority support"],
    icon: Wrench,
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative w-full bg-muted/30 py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 sm:mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              What We Can Build For You
            </div>
            <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl text-emerald-600 dark:text-emerald-500">
              Websites & Apps for every need
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground md:text-xl leading-relaxed px-2">
              From simple landing pages to fully-featured online stores and
              mobile apps, we can develop any website or mobile application that
              helps your business succeed online.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group rounded-2xl border border-border bg-background/50 backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 hover:bg-accent/50 hover:border-accent"
              >
                {/* Icon */}
                <div className="mb-4 sm:mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>

                {/* Content */}
                <h3 className="mb-1 text-base sm:text-lg font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2 sm:mb-3">
                  {service.tagline}
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mb-3 sm:mb-4">
                  {service.description}
                </p>

                {/* Features list */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
