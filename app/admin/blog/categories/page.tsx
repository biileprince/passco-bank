import Link from "next/link";
import { getBlogCategories, getBlogTags } from "../actions";
import { CategoriesManager } from "./categories-manager";

export default async function CategoriesPage() {
  const [categories, tags] = await Promise.all([
    getBlogCategories(),
    getBlogTags(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
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
            Categories & Tags
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize your blog content
          </p>
        </div>
      </div>

      {/* Manager */}
      <CategoriesManager categories={categories} tags={tags} />
    </div>
  );
}
