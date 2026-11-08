import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border/50 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-bold tracking-tight">Oguaa Hall</p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
            An independent campaign and student-resource platform created by Kwame Eugene, current Oguaa Hall Representative and aspiring Hall President.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <Link href="/resources" className="hover:text-emerald-600">Academic resources</Link>
            <Link href="/about" className="hover:text-emerald-600">About Oguaa Hall</Link>
            <Link href="/contact" className="hover:text-emerald-600">Contact leadership</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Connect</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <a href="mailto:oguaahall@ucc.edu.gh" className="flex items-center gap-2 hover:text-emerald-600"><Mail className="h-4 w-4" /> oguaahall@ucc.edu.gh</a>
            <a href="tel:+233000000000" className="flex items-center gap-2 hover:text-emerald-600"><Phone className="h-4 w-4" /> Hall office contact</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/50 px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Oguaa Hall, University of Cape Coast. Built for students.
      </div>
    </footer>
  );
}
