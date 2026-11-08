import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProgramForms } from "./program-forms";

export default async function AdminProgramsPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/login?error=unauthorized&redirect=/admin/programs");

  const [programs, courses] = await Promise.all([
    prisma.program.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.course.findMany({
      orderBy: [{ program: { name: "asc" } }, { level: "asc" }, { code: "asc" }],
      include: { program: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Programs & courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">Build the catalogue used to organise hall resources.</p>
      </div>
      <ProgramForms programs={programs} />
      <div className="rounded-xl border border-border bg-background">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold">Course catalogue ({courses.length})</h2>
        </div>
        {courses.length === 0 ? (
          <p className="p-8 text-sm text-muted-foreground">No courses have been added yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {courses.map((course) => (
              <div key={course.id} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{course.code} — {course.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{course.program.name}</p>
                </div>
                <span className="text-xs text-muted-foreground">Level {course.level}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
