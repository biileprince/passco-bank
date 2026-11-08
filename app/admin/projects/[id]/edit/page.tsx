import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProjectForm } from "../../project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, users] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
    }),
    prisma.user.findMany({
      where: { role: "user" },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground mt-1">Update project details</p>
      </div>

      {/* Form */}
      <ProjectForm users={users} project={project} />
    </div>
  );
}
