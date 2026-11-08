import Link from "next/link";
import { getBlogPosts } from "./actions";
import { BlogPostsTable } from "./blog-posts-table";
import { Button } from "@/app/components/ui/button";

export default async function AdminBlogPage() {
  const { posts, total } = await getBlogPosts();

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;
  const featuredCount = posts.filter((p) => p.featured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Blog Posts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your blog content and articles
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/admin/blog/categories">
            <Button variant="outline" className="text-sm px-3 py-2">
              Manage Categories
            </Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button className="text-sm px-3 py-2">New Post</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-background rounded-lg border border-border p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            Total Posts
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
            Drafts
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">
            {draftCount}
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
      </div>

      {/* Blog Posts Table */}
      <BlogPostsTable posts={posts} />
    </div>
  );
}
