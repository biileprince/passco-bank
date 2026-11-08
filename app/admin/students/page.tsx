import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type StudentsPageProps = {
  searchParams: Promise<{
    q?: string;
    level?: string;
    residence?: string;
  }>;
};

export default async function AdminStudentsPage({ searchParams }: StudentsPageProps) {
  const admin = await getAdminUser();
  if (!admin) redirect("/login?error=unauthorized&redirect=/admin/students");

  const params = await searchParams;
  const query = params.q?.trim() || "";
  const level = Number(params.level);

  const students = await prisma.user.findMany({
    where: {
      role: "user",
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { studentId: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { program: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(Number.isInteger(level) && level > 0 ? { level } : {}),
    },
    select: {
      id: true,
      name: true,
      studentId: true,
      email: true,
      phone: true,
      program: true,
      level: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const totalStudents = await prisma.user.count({ where: { role: "user" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View registered Oguaa Hall affiliates and their academic profiles.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        <form method="get" className="grid gap-3 md:grid-cols-[1fr_150px_auto]">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search name, Student ID, email, or program"
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          />
          <select
            name="level"
            defaultValue={params.level || ""}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">All levels</option>
            {[100, 200, 300, 400, 500, 600].map((item) => (
              <option key={item} value={item}>
                Level {item}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-10 rounded-lg bg-[rgb(6,119,0)] px-4 text-sm font-medium text-white hover:bg-[rgb(6,95,0)]"
          >
            Filter
          </button>
        </form>
      </div>

      <section className="rounded-xl border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold">
            Registered students ({totalStudents})
          </h2>
          <span className="text-xs text-muted-foreground">
            Showing {students.length} result{students.length === 1 ? "" : "s"}
          </span>
        </div>

        {students.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No students match the selected filters.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {students.map((student) => (
              <article
                key={student.id}
                className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">
                      {student.name || "Unnamed student"}
                    </h3>
                    <span className="rounded-full bg-[rgb(255,217,0)]/30 px-2 py-1 text-xs font-medium text-[rgb(6,119,0)]">
                      {student.studentId || "ID pending"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {student.program || "Program not provided"}
                    {student.level ? ` · Level ${student.level}` : ""}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {student.phone || student.email}
                  </p>
                </div>
                <time
                  dateTime={student.createdAt.toISOString()}
                  className="shrink-0 text-xs text-muted-foreground"
                >
                  Joined {student.createdAt.toLocaleDateString()}
                </time>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
