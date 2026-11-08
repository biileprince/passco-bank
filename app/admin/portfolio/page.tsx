import Link from "next/link";
import { getPortfolioProjects, getPortfolioCategories } from "./actions";
import { PortfolioTable } from "./portfolio-table";
import { Button } from "@/app/components/ui/button";

export default async function AdminPortfolioPage() {
  const [{ projects, total }, categories] = await Promise.all([
    getPortfolioProjects(),
    getPortfolioCategories(),
  ]);

  const publishedCount = projects.filter((p) => p.published).length;
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Portfolio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your portfolio projects and case studies
          </p>
        </div>
        <Link href="/admin/portfolio/new">
          <Button className="text-sm px-3 py-2 w-full sm:w-auto">
            Add Project
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-background rounded-lg border border-border p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            Total Projects
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">
            {total}
          </div>
        </div>
        <div className="bg-background rounded-lg border border-border p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            Published
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">
            {publishedCount}
          </div>
        </div>
        <div className="bg-background rounded-lg border border-border p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            Featured
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">
            {featuredCount}
          </div>
        </div>
        <div className="bg-background rounded-lg border border-border p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            Categories
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">
            {categories.length}
          </div>
        </div>
      </div>

      {/* Portfolio Table */}
      <PortfolioTable projects={projects} />
    </div>
  );
}
