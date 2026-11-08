import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioProject, getPortfolioCategories } from "../../actions";
import { PortfolioForm } from "../../portfolio-form";

export default async function EditPortfolioProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, categories] = await Promise.all([
    getPortfolioProject(id),
    getPortfolioCategories(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
          <p className="text-muted-foreground mt-1">
            Update &quot;{project.title}&quot;
          </p>
        </div>
      </div>

      {/* Form */}
      <PortfolioForm project={project} categories={categories} />
    </div>
  );
}
