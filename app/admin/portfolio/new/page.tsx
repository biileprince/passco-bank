import Link from "next/link";
import { getPortfolioCategories } from "../actions";
import { PortfolioForm } from "../portfolio-form";

export default async function NewPortfolioProjectPage() {
  const categories = await getPortfolioCategories();

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
          <h1 className="text-2xl font-bold text-foreground">
            New Portfolio Project
          </h1>
          <p className="text-muted-foreground mt-1">
            Add a new project to your portfolio
          </p>
        </div>
      </div>

      {/* Form */}
      <PortfolioForm categories={categories} />
    </div>
  );
}
