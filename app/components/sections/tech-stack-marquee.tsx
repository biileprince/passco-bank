"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiMongodb,
  SiStripe,
  SiVercel,
  SiGit,
  SiDocker,
  SiNestjs,
  SiPhp,
} from "react-icons/si";
import { Server } from "lucide-react";

const technologies = [
  {
    name: "Next.js",
    icon: SiNextdotjs,
    color: "#000000",
    darkColor: "#FFFFFF",
  },
  { name: "React", icon: SiReact, color: "#61DAFB", darkColor: "#61DAFB" },
  {
    name: "React Native",
    icon: SiReact,
    color: "#61DAFB",
    darkColor: "#61DAFB",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    color: "#3178C6",
    darkColor: "#3178C6",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "#06B6D4",
    darkColor: "#06B6D4",
  },
  {
    name: "Node.js",
    icon: SiNodedotjs,
    color: "#339933",
    darkColor: "#339933",
  },
  { name: "NestJS", icon: SiNestjs, color: "#E0234E", darkColor: "#E0234E" },
  {
    name: "PostgreSQL",
    icon: SiPostgresql,
    color: "#4169E1",
    darkColor: "#4169E1",
  },
  { name: "Prisma", icon: SiPrisma, color: "#2D3748", darkColor: "#FFFFFF" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", darkColor: "#47A248" },
  { name: "PHP", icon: SiPhp, color: "#777BB4", darkColor: "#777BB4" },
  {
    name: "VPS Hosting",
    icon: Server,
    color: "#6366F1",
    darkColor: "#818CF8",
    isLucide: true,
  },
  { name: "Stripe", icon: SiStripe, color: "#635BFF", darkColor: "#635BFF" },
  { name: "Vercel", icon: SiVercel, color: "#000000", darkColor: "#FFFFFF" },
  { name: "Git", icon: SiGit, color: "#F05032", darkColor: "#F05032" },
  { name: "Docker", icon: SiDocker, color: "#2496ED", darkColor: "#2496ED" },
];

export function TechStackMarquee() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Start the animation
    controls.start({
      x: [0, -1400],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 40,
        ease: "linear",
      },
    });
  }, [controls]);

  const handleMouseEnter = () => {
    controls.stop();
  };

  const handleMouseLeave = () => {
    controls.start({
      x: [null, -1400], // null means continue from current position
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 40,
        ease: "linear",
      },
    });
  };

  return (
    <section className="relative w-full border-y border-border/50 bg-background py-12 sm:py-16 overflow-hidden">
      {/* Section Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <p className="text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Technologies We Use
        </p>
      </div>

      {/* Marquee Container */}
      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient Overlays */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 sm:w-32 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 sm:w-32 bg-linear-to-l from-background to-transparent" />

        {/* Marquee */}
        <motion.div className="flex gap-6 sm:gap-12" animate={controls}>
          {[...technologies, ...technologies, ...technologies].map(
            (tech, index) => {
              const Icon = tech.icon;
              const iconColor =
                isDark && tech.darkColor ? tech.darkColor : tech.color;
              return (
                <div
                  key={`${tech.name}-${index}`}
                  className="flex min-w-24 sm:min-w-30 flex-col items-center gap-3 sm:gap-4 transition-all duration-300 hover:scale-110"
                >
                  <div
                    className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-muted/50 shadow-lg shadow-black/5 dark:shadow-black/20 transition-shadow duration-300 hover:shadow-xl"
                    style={{
                      boxShadow: `0 4px 20px ${iconColor}20`,
                    }}
                  >
                    <Icon
                      className="h-7 w-7 sm:h-8 sm:w-8 drop-shadow-sm"
                      style={{ color: iconColor }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {tech.name}
                  </span>
                </div>
              );
            }
          )}
        </motion.div>
      </div>
    </section>
  );
}
