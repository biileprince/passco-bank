"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { deletePortfolioProject } from "./actions";
import { Button } from "@/app/components/ui/button";

interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  technologies: string | null;
  client: string | null;
  liveUrl: string | null;
  coverImage: string | null;
  featured: boolean;
  published: boolean;
  createdAt: Date;
}

export function PortfolioTable({ projects }: { projects: PortfolioProject[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeleting(id);
    try {
      await deletePortfolioProject(id);
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    } finally {
      setDeleting(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-foreground">
          No portfolio projects yet
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by adding your first project.
        </p>
        <Link href="/admin/portfolio/new">
          <Button className="mt-4">Add Project</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Project
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                Client
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                Created
              </th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-3 sm:px-6 py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {project.coverImage && (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        width={48}
                        height={48}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-border flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <Link
                        href={`/admin/portfolio/${project.id}`}
                        className="text-sm font-medium text-foreground hover:underline block truncate"
                      >
                        {project.title}
                      </Link>
                      {project.featured && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                          Featured
                        </span>
                      )}
                      {project.technologies && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {project.technologies}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {project.category ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {project.category}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">
                  {project.client || "—"}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.published
                        ? "bg-muted text-foreground"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {project.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden lg:table-cell">
                  {formatDistanceToNow(new Date(project.createdAt), {
                    addSuffix: true,
                  })}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 sm:px-3"
                        >
                          Live
                        </Button>
                      </a>
                    )}
                    <Link href={`/work/${project.slug}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 sm:px-3"
                      >
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/portfolio/${project.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 sm:px-3"
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting === project.id}
                      className="text-destructive hover:text-destructive h-8 px-2 sm:px-3"
                    >
                      {deleting === project.id ? "..." : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
