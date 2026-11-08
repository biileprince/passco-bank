"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Home,
  Menu,
  X,
  PenSquare,
  BookOpen,
  FileQuestion,
  GraduationCap,
  CalendarDays,
  Images,
} from "lucide-react";
import { useState, useEffect } from "react";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Resources",
    href: "/admin/resources",
    icon: BookOpen,
  },
  {
    title: "Resource Requests",
    href: "/admin/resource-requests",
    icon: FileQuestion,
  },
  {
    title: "Programs & Courses",
    href: "/admin/programs",
    icon: GraduationCap,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: Users,
  },
  {
    title: "Complaints",
    href: "/admin/complaints",
    icon: MessageSquare,
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: PenSquare,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    submenu: [
      {
        title: "Overview",
        href: "/admin/analytics",
      },
      {
        title: "Advanced Analytics",
        href: "/admin/analytics-advanced",
      },
    ],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    // Use startTransition to avoid cascading renders
    const timer = setTimeout(() => setIsOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button - Positioned to not conflict with admin header */}
      <button
        className="fixed top-[4.5rem] right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/95 shadow-sm backdrop-blur-xl lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-14 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-50 h-[calc(100vh-3.5rem)] w-64 transform border-r border-border bg-background/95 backdrop-blur-xl transition-transform duration-300 ease-in-out sm:top-16 sm:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "hsl(var(--background) / 0.95)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <span className="text-sm font-bold">A</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold">AxiomCraft</span>
              <span className="ml-2 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Admin
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));

              return (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {link.title}
                  </Link>

                  {/* Submenu */}
                  {link.submenu && isActive && (
                    <div className="ml-8 mt-1 space-y-1">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.href}
                          href={sublink.href}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                            pathname === sublink.href
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {sublink.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Back to Site */}
          <div className="border-t border-border p-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Home className="h-5 w-5 shrink-0" />
              Back to Site
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
