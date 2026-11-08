"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  FileQuestion,
  GalleryVerticalEnd,
  House,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth-client";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Lecture slides & notes", href: "/resources/lecture-slides", icon: BookOpen },
  { label: "Past questions", href: "/resources/past-questions", icon: FileQuestion },
  { label: "Announcements", href: "/announcements", icon: Newspaper },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Gallery", href: "/gallery", icon: GalleryVerticalEnd },
  { label: "Complaints & suggestions", href: "/contact", icon: MessageSquare },
];

export function StudentSidebar({ name, studentId }: { name: string; studentId: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleLogout() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="fixed right-4 top-20 z-[60] flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background shadow-sm lg:hidden"
        aria-label={isOpen ? "Close student menu" : "Open student menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-14 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close student menu"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-14 z-50 flex w-72 flex-col border-r border-border bg-background transition-transform lg:inset-y-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-border px-6 py-6">
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-bold text-[rgb(6,119,0)]">
            Oguaa Hall
          </Link>
          <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Student portal</p>
        </div>

        <div className="border-b border-border px-6 py-5">
          <p className="truncate text-sm font-semibold">{name || "Student"}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{studentId || "Student account"}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {links.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[rgb(6,119,0)] text-white"
                    : "text-muted-foreground hover:bg-[rgb(255,217,0)]/20 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
