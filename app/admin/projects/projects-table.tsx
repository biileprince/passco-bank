"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Eye, Edit, Trash2, Search, ExternalLink } from "lucide-react";
import { deleteProject } from "./actions";

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  budget: number | null;
  category: string | null;
  liveUrl: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
  _count: {
    invoices: number;
  };
};

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({
  projects: initialProjects,
}: ProjectsTableProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === "all" || project.status === filter;
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.user.email.toLowerCase().includes(search.toLowerCase()) ||
      (project.user.name?.toLowerCase().includes(search.toLowerCase()) ??
        false);
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This will also delete all associated invoices."
      )
    )
      return;

    const result = await deleteProject(id);
    if (result.success) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Discovery: "bg-blue-500/10 text-blue-500",
      Design: "bg-purple-500/10 text-purple-500",
      Development: "bg-orange-500/10 text-orange-500",
      Live: "bg-green-500/10 text-green-500",
    };
    return styles[status] || "bg-muted text-muted-foreground";
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {["all", "Discovery", "Design", "Development", "Live"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 text-sm font-medium transition-colors flex-shrink-0 ${
                  filter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-accent"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Project
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Client
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Progress
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Budget
                </th>
                <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="min-w-0">
                        <p className="font-medium truncate text-sm">
                          {project.name}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {project.category || "No category"}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 hidden sm:table-cell">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {project.user.name || "No name"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {project.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 sm:w-20 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 hidden lg:table-cell">
                      <p className="text-sm">
                        {project.budget
                          ? `$${project.budget.toLocaleString()}`
                          : "—"}
                      </p>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center justify-end gap-1">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-accent transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(project.id)}
                          className="text-destructive hover:text-destructive h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
