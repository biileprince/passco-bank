"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, UserRound } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useSession } from "@/lib/auth-client";

const links = [
  { label: "Notices", href: "/announcements" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Oguaa Hall", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = React.useState(false);
  const [accountHref, setAccountHref] = React.useState("/login");
  const resourcesRef = React.useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  React.useEffect(() => {
    function closeResources(event: PointerEvent) {
      if (!resourcesRef.current?.contains(event.target as Node)) {
        setIsResourcesOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeResources);
    return () => document.removeEventListener("pointerdown", closeResources);
  }, []);

  React.useEffect(() => {
    let active = true;

    if (!session?.user) {
      setAccountHref("/login");
      return () => {
        active = false;
      };
    }

    setAccountHref("/dashboard");
    fetch("/api/auth/check-admin")
      .then(async (response) => {
        if (!response.ok) throw new Error(`Admin check failed with status ${response.status}`);
        return (await response.json()) as { isAdmin?: boolean };
      })
      .then((data) => {
        if (active && data.isAdmin) setAccountHref("/admin");
      })
      .catch((error) => {
        console.error("Navigation role check failed:", error);
      });

    return () => {
      active = false;
    };
  }, [session?.user]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/95 text-foreground shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(255,217,0)] shadow-md">
            <Image src="/oguaa-hall-logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight">Oguaa Hall</span>
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">University of Cape Coast</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <div ref={resourcesRef} className="group relative" onMouseEnter={() => setIsResourcesOpen(true)}>
            <button type="button" onClick={() => setIsResourcesOpen((open) => !open)} aria-expanded={isResourcesOpen} aria-haspopup="menu" className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              Resources <ChevronDown className={`h-4 w-4 transition-transform ${isResourcesOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2 transition-all ${isResourcesOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
              <div className="rounded-xl border border-border bg-background p-2 shadow-lg">
                <Link href="/resources" onClick={() => setIsResourcesOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-[rgb(252,217,20)]/25">All resources</Link>
                <Link href="/resources/lecture-slides" onClick={() => setIsResourcesOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-[rgb(255,217,0)]/20 hover:text-foreground">Lecture slides</Link>
                <Link href="/resources/past-questions" onClick={() => setIsResourcesOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-[rgb(255,217,0)]/20 hover:text-foreground">Past questions</Link>
                <Link href="/resources/notes" onClick={() => setIsResourcesOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-[rgb(255,217,0)]/20 hover:text-foreground">Notes</Link>
              </div>
            </div>
          </div>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {link.label}
            </Link>
          ))}
          {!session?.user && (
            <Link href="/register" className="rounded-full px-4 py-2 text-sm font-medium text-[rgb(6,119,0)] transition-colors hover:bg-[rgb(255,217,0)]/20">
              Register
            </Link>
          )}
          <Link href={accountHref}>
            <Button className="ml-2 rounded-full bg-[rgb(6,119,0)] px-5 text-white hover:bg-[rgb(6,95,0)]">
              <UserRound className="h-4 w-4" />
              {session?.user ? "My account" : "Student login"}
            </Button>
          </Link>
        </div>

        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-border bg-background px-4 pb-5 pt-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                Resources <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="ml-3 border-l border-border pl-3">
                <Link href="/resources/lecture-slides" onClick={() => setIsOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-[rgb(255,217,0)]/20 hover:text-foreground">Lecture slides</Link>
                <Link href="/resources/past-questions" onClick={() => setIsOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-[rgb(255,217,0)]/20 hover:text-foreground">Past questions</Link>
                <Link href="/resources/notes" onClick={() => setIsOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-[rgb(255,217,0)]/20 hover:text-foreground">Notes</Link>
              </div>
            </details>
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                {link.label}
              </Link>
            ))}
            {!session?.user && (
              <Link href="/register" onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-[rgb(6,119,0)] hover:bg-[rgb(255,217,0)]/20">
                Register
              </Link>
            )}
            <Link href={accountHref} onClick={() => setIsOpen(false)}>
              <Button className="mt-2 w-full rounded-lg bg-[rgb(6,119,0)] text-white hover:bg-[rgb(6,95,0)]">
                {session?.user ? "Go to my account" : "Student login"}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
