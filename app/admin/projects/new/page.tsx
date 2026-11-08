import prisma from "@/lib/prisma";
import { ProjectForm } from "../project-form";

export default async function NewProjectPage() {
  const users = await prisma.user.findMany({
    where: { role: "user" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">New Project</h1>
        <p className="text-muted-foreground mt-1">
          Create a new project for a client
        </p>
      </div>

      {/* Form */}
      <ProjectForm users={users} />
    </div>
  );
}
