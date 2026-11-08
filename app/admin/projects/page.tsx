import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, FolderKanban } from "lucide-react";
import { ProjectsTable } from "./projects-table";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
      _count: {
        select: { invoices: true },
      },
    },
  });

  const stats = {
    total: projects.length,
    discovery: projects.filter((p) => p.status === "Discovery").length,
    design: projects.filter((p) => p.status === "Design").length,
    development: projects.filter((p) => p.status === "Development").length,
    live: projects.filter((p) => p.status === "Live").length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Projects
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage all client projects
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 sm:px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-5">
        <div className="rounded-lg border border-border bg-background p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-blue-500">{stats.discovery}</p>
          <p className="text-sm text-muted-foreground">Discovery</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-purple-500">{stats.design}</p>
          <p className="text-sm text-muted-foreground">Design</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-orange-500">
            {stats.development}
          </p>
          <p className="text-sm text-muted-foreground">Development</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-green-500">{stats.live}</p>
          <p className="text-sm text-muted-foreground">Live</p>
        </div>
      </div>

      {/* Projects Table */}
      {projects.length > 0 ? (
        <ProjectsTable projects={projects} />
      ) : (
        <div className="rounded-xl border border-border bg-background p-12 text-center">
          <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first project to get started
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </div>
      )}
    </div>
  );
}
