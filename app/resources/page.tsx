import Link from "next/link";
import { ArrowRight, BookOpen, FileQuestion, Search, LockKeyhole, NotebookPen } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";

const resourceTypes = [
  {
    title: "Lecture Slides & Notes",
    description: "Browse course materials by programme, level, and course.",
    href: "/resources/lecture-slides",
    icon: BookOpen,
  },
  {
    title: "Course Notes",
    description: "Read and download organised notes shared by the Oguaa student community.",
    href: "/resources/notes",
    icon: NotebookPen,
  },
  {
    title: "Past Questions",
    description: "Prepare with previous examinations and revision materials.",
    href: "/resources/past-questions",
    icon: FileQuestion,
  },
];

export default function ResourcesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <Image src="/kwame-eugene.jpeg" alt="" fill className="pointer-events-none object-cover object-top opacity-[0.08]" sizes="100vw" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(252,217,20,0.25),transparent_35%),linear-gradient(120deg,rgba(6,119,0,0.07),transparent_58%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[rgb(6,119,0)]">Academic resource centre</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Everything you need to study with confidence.</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Select a resource type to begin. The             library will be organised by programme, level, and course, with search and academic-year filters. This is a student initiative by Kwame Eugene, not the official Oguaa Hall website.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {resourceTypes.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link key={resource.href} href={resource.href} className="group rounded-3xl border border-border bg-background/90 p-8 shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(255,217,0)]/30 text-[rgb(6,119,0)]">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="mt-8 text-2xl font-semibold">{resource.title}</h2>
                <p className="mt-3 max-w-md leading-7 text-muted-foreground">{resource.description}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(6,119,0)]">
                  Browse collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-5 rounded-3xl bg-[rgb(6,119,0)] p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="flex items-start gap-4">
            <Search className="mt-1 h-5 w-5 shrink-0 text-white" />
            <div>
              <h2 className="font-semibold">Can&apos;t find what you need?</h2>
              <p className="mt-1 text-sm leading-6 text-white/80">Sign in to request a missing slide, note, or past question from the hall academic team.</p>
            </div>
          </div>
          <Link href="/login">
            <Button variant="outline" className="w-full rounded-full border-white/40 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto">
              <LockKeyhole className="h-4 w-4" /> Student sign in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
