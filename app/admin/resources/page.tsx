import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { BookOpen, CheckCircle2, Clock3, FileQuestion, GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";
import { approveResourceFormAction } from "./actions";
import { ResourceForm } from "./resource-form";

export default async function AdminResourcesPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/login?error=unauthorized&redirect=/admin/resources");

  const [total, approved, pending, programCount, programs, courses, recent] = await Promise.all([
    prisma.resource.count(),
    prisma.resource.count({ where: { approved: true } }),
    prisma.resource.count({ where: { approved: false } }),
    prisma.program.count({ where: { active: true } }),
    prisma.program.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.course.findMany({
      orderBy: [{ program: { name: "asc" } }, { level: "asc" }, { code: "asc" }],
      select: { id: true, code: true, title: true, level: true, programId: true },
    }),
    prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        type: true,
        approved: true,
        level: true,
        createdAt: true,
        course: { select: { code: true, title: true } },
      },
    }),
  ]);

  const cards = [
    { label: "Total resources", value: total, icon: BookOpen },
    { label: "Approved", value: approved, icon: CheckCircle2 },
    { label: "Awaiting review", value: pending, icon: Clock3 },
    { label: "Active programs", value: programCount, icon: GraduationCap },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Academic resources</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and manage lecture slides, notes, and past questions.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-background p-5">
            <Icon className="h-5 w-5 text-[rgb(6,119,0)]" />
            <p className="mt-4 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <ResourceForm programs={programs} courses={courses} />
      <div className="rounded-xl border border-border bg-background">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold">Recent uploads</h2>
        </div>
        {recent.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No resources have been uploaded yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="truncate font-medium">{resource.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{resource.course.code} — {resource.course.title} · Level {resource.level}</p>
                </div>
                {resource.approved ? (
                  <span className="shrink-0 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700">Approved</span>
                ) : (
                  <form action={approveResourceFormAction.bind(null, resource.id)}>
                    <button type="submit" className="shrink-0 rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-500/25">Approve</button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        <FileQuestion className="mr-1 inline h-3 w-3" /> Resources remain hidden from students until approved.
      </p>
    </div>
  );
}
