import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { headers } from "next/headers";
import { ArrowRight, BookOpen, FileQuestion, MessageSquare, UserRound } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export const metadata: Metadata = {
  title: "Student dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      studentId: true,
      program: true,
      level: true,
    },
  });

  const firstName = (profile?.name || session.user.name || "Student").split(" ")[0];

  return (
    <div className="min-h-screen bg-background px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pt-12">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-[rgb(6,119,0)] p-7 text-white shadow-sm sm:p-10">
          <p className="text-sm font-medium text-white/75">Student dashboard</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Welcome back, {firstName}.</h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/80">
            Your Oguaa Hall academic resources and student support are one click away.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-xs font-medium">
            <span className="rounded-full bg-white/15 px-3 py-1.5">{profile?.studentId || "Student ID pending"}</span>
            {profile?.level && <span className="rounded-full bg-white/15 px-3 py-1.5">Level {profile.level}</span>}
            {profile?.program && <span className="rounded-full bg-white/15 px-3 py-1.5">{profile.program}</span>}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Link href="/resources/lecture-slides" className="group rounded-2xl border border-border bg-background p-7 shadow-sm transition-transform hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(255,217,0)]/30 text-[rgb(6,119,0)]">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Lecture slides & notes</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">Browse course materials organised for your programme and level.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(6,119,0)]">Browse materials <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
          <Link href="/resources/past-questions" className="group rounded-2xl border border-border bg-background p-7 shadow-sm transition-transform hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(255,217,0)]/30 text-[rgb(6,119,0)]">
              <FileQuestion className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Past questions</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">Find revision materials and prepare for upcoming examinations.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(6,119,0)]">Browse questions <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border border-border bg-muted/30 p-7">
            <div className="flex items-start gap-4">
              <MessageSquare className="mt-1 h-5 w-5 text-[rgb(6,119,0)]" />
              <div>
                <h2 className="font-semibold">Need a missing resource?</h2>
                <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">Request a slide, note, or past question from the hall academic team. Resource requests will be enabled as the library is populated.</p>
              </div>
            </div>
          </div>
          <Link href="/contact">
            <Button variant="outline" className="h-full w-full rounded-2xl px-6 sm:w-auto"><UserRound className="h-4 w-4" /> Contact leadership</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
