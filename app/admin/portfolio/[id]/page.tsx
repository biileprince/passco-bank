import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getPortfolioProject } from "../actions";
import { Button } from "@/app/components/ui/button";

export default async function AdminPortfolioProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getPortfolioProject(id);

  if (!project) {
    notFound();
  }

  const technologies =
    project.technologies?.split(",").map((t) => t.trim()) || [];
  let images: string[] = [];

  if (project.images) {
    try {
      images = JSON.parse(project.images);
    } catch {
      images = project.images.split("\n").filter(Boolean);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/portfolio"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {project.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {project.category || "Uncategorized"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/work/${project.slug}`} target="_blank">
            <Button variant="outline">View Live</Button>
          </Link>
          <Link href={`/admin/portfolio/${project.id}/edit`}>
            <Button>Edit Project</Button>
          </Link>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {project.coverImage && (
            <div className="bg-background rounded-lg border border-border overflow-hidden">
              <Image
                src={project.coverImage}
                alt={project.title}
                width={800}
                height={256}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {project.description && (
            <div className="bg-background rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Description
              </h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          )}

          {project.content && (
            <div className="bg-background rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Case Study
              </h2>
              <div
                className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-code:bg-muted prose-pre:bg-muted"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </div>
          )}

          {/* Gallery */}
          {images.length > 0 && (
            <div className="bg-background rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Gallery
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {images.map((url, i) => (
                  <Image
                    key={i}
                    src={url}
                    alt={`${project.title} screenshot ${i + 1}`}
                    width={400}
                    height={225}
                    className="rounded-lg border border-border object-cover aspect-video"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Published</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.published
                      ? "bg-muted text-foreground"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {project.published ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Featured</span>
                <span className="text-sm text-foreground">
                  {project.featured ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Client */}
          {project.client && (
            <div className="bg-background rounded-lg border border-border p-6 space-y-4">
              <h3 className="font-medium text-foreground">Client</h3>
              <p className="text-foreground">{project.client}</p>
            </div>
          )}

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="bg-background rounded-lg border border-border p-6 space-y-4">
              <h3 className="font-medium text-foreground">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="bg-background rounded-lg border border-border p-6 space-y-4">
              <h3 className="font-medium text-foreground">Links</h3>
              <div className="space-y-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-foreground hover:underline"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-foreground hover:underline"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Dates</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-foreground">
                  {format(new Date(project.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="text-foreground">
                  {format(new Date(project.updatedAt), "MMM d, yyyy")}
                </span>
              </div>
              {project.completedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="text-foreground">
                    {format(new Date(project.completedAt), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
