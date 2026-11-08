import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import {
  Briefcase,
  ArrowLeft,
  Activity,
  DollarSign,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { headers } from "next/headers";

async function getProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          invoices: true,
        },
      },
    },
  });
}

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const projects = await getProjects(session.user.id);

  // Group projects by status
  const activeProjects = projects.filter((p) => p.status !== "Live");
  const completedProjects = projects.filter((p) => p.status === "Live");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-20 sm:pt-24 pb-12 sm:pb-16">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-3 sm:mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="text-sm">Back to Dashboard</span>
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                My Projects
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                View and track all your projects
              </p>
            </div>
            <Link href="/contact">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                Request a Website or App
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 mb-6 sm:mb-8">
          <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Projects
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                  {projects.length}
                </h3>
              </div>
              <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Active
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                  {activeProjects.length}
                </h3>
              </div>
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-500" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                  {completedProjects.length}
                </h3>
              </div>
              <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-500" />
            </div>
          </div>
        </div>

        {/* Active Projects */}
        {activeProjects.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Active Projects
            </h2>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {activeProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="block rounded-lg border border-border bg-card p-4 sm:p-6 hover:bg-accent transition-colors"
                >
                  <div className="mb-3 sm:mb-4">
                    <div className="flex-1">
                      {project.imageUrl && (
                        <div className="mb-3 sm:mb-4 aspect-video rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={project.imageUrl}
                            alt={project.name}
                            width={600}
                            height={338}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-base sm:text-lg mb-1">
                        {project.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {project.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-emerald-600 h-1.5 sm:h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-border">
                    <span
                      className={`text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full self-start ${
                        project.status === "Development"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-500"
                          : project.status === "Design"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-500"
                          : "bg-orange-500/10 text-orange-600 dark:text-orange-500"
                      }`}
                    >
                      {project.status}
                    </span>
                    <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                      {project.budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span className="text-xs">
                            ${project.budget.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {project._count.invoices} invoices
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Completed Projects */}
        {completedProjects.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Completed Projects
            </h2>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {completedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="block rounded-lg border border-border bg-card p-4 sm:p-6 hover:bg-accent transition-colors"
                >
                  <div className="mb-3 sm:mb-4">
                    <div className="flex-1">
                      {project.imageUrl && (
                        <div className="mb-3 sm:mb-4 aspect-video rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={project.imageUrl}
                            alt={project.name}
                            width={600}
                            height={338}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-lg mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
                      Live
                    </span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {project.liveUrl && (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Visit Site
                        </div>
                      )}
                      {project.endDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(project.endDate), "MMM yyyy")}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12 rounded-lg border border-border bg-card">
            <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Your projects will appear here once they are created.
            </p>
            <Link href="/contact" className="mt-6 inline-block">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Request a Website or App
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
