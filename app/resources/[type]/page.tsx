import Link from "next/link";
import { ArrowLeft, Download, FileText, Search } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ResourceRequestForm } from "../request-form";

const pageCopy = {
  "lecture-slides": {
    title: "Lecture Slides & Notes",
    description: "Find approved slides and notes by programme, level, and course.",
  },
  "past-questions": {
    title: "Past Questions",
    description: "Prepare with previous examination papers and revision materials.",
  },
  notes: {
    title: "Course Notes",
    description: "Read and download approved notes shared by students and course representatives.",
  },
} as const;

export default async function ResourceTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ q?: string; level?: string; year?: string; semester?: string }>;
}) {
  const { type } = await params;
  const filters = await searchParams;
  const copy = pageCopy[type as keyof typeof pageCopy] ?? pageCopy["lecture-slides"];
  const resourceType = type === "past-questions" ? "past-question" : type === "notes" ? "note" : "lecture-slide";
  const query = filters.q?.trim();
  const level = filters.level ? Number(filters.level) : undefined;
  const resources = await prisma.resource.findMany({
    where: {
      type: resourceType,
      approved: true,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { fileName: { contains: query, mode: "insensitive" } },
              { course: { title: { contains: query, mode: "insensitive" } } },
              { course: { code: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {}),
      ...(level ? { level } : {}),
      ...(filters.year ? { academicYear: filters.year } : {}),
      ...(filters.semester ? { semester: filters.semester } : {}),
    },
    include: {
      course: { include: { program: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const formatSize = (bytes?: number | null) => {
    if (!bytes) return "Size unavailable";
    if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(6,119,0)] hover:text-[rgb(6,95,0)]">
          <ArrowLeft className="h-4 w-4" /> Back to resources
        </Link>
        <div className="mt-8 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[rgb(6,119,0)]">Academic resource centre</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">{copy.title}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{copy.description}</p>
        </div>

        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:flex-row">
          <form method="get" className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-muted px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="search"
              name="q"
              defaultValue={filters.q}
              placeholder="Search by course or file name"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-[#7b8490]"
              aria-label="Search resources"
            />
          </div>
          <select name="level" defaultValue={filters.level || ""} className="h-12 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="">All levels</option>
            {[100, 200, 300, 400, 500, 600].map((item) => <option key={item} value={item}>Level {item}</option>)}
          </select>
          <select name="semester" defaultValue={filters.semester || ""} className="h-12 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="">All semesters</option>
            <option value="First">First semester</option>
            <option value="Second">Second semester</option>
          </select>
          <Button type="submit" className="h-12 rounded-xl bg-[rgb(6,119,0)] px-6 text-white hover:bg-[rgb(6,95,0)]">Search library</Button>
          </form>
        </div>

        {resources.length > 0 ? (
          <div className="mt-8 grid gap-4">
            {resources.map((resource) => (
              <article key={resource.id} className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[rgb(6,119,0)]">
                      {resource.course.program.name} • Level {resource.level}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">{resource.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {resource.course.code} — {resource.course.title}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-muted px-3 py-1">{resource.fileFormat.toUpperCase()}</span>
                      <span className="rounded-full bg-muted px-3 py-1">{formatSize(resource.fileSize)}</span>
                      {resource.academicYear && <span className="rounded-full bg-muted px-3 py-1">{resource.academicYear}</span>}
                      {resource.semester && <span className="rounded-full bg-muted px-3 py-1">{resource.semester} semester</span>}
                    </div>
                  </div>
                  <a href={resource.fileUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[rgb(6,119,0)] px-4 text-sm font-medium text-white hover:bg-[rgb(6,95,0)]">
                    <Download className="h-4 w-4" /> Preview
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-border bg-muted/30 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(255,217,0)]/30 text-[rgb(6,119,0)]">
            <FileText className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold">The collection is being prepared</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
            Programme, level, course, semester, and year filters will appear here once approved materials are added by hall executives and course representatives.
          </p>
          <Link href="/login" className="mt-7 inline-block">
            <Button variant="outline" className="rounded-full border-[rgb(6,119,0)] text-[rgb(6,119,0)] hover:bg-[rgb(255,217,0)]/20">
              <Download className="h-4 w-4" /> Sign in to request a resource
            </Button>
          </Link>
        </div>
        )}
        <ResourceRequestForm type={resourceType} />
      </div>
    </div>
  );
}
