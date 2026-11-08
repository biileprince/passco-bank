import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { getBlogPost } from "../actions";
import { Button } from "@/app/components/ui/button";

export default async function AdminBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="text-2xl font-bold text-foreground">{post.title}</h1>
            <p className="text-muted-foreground mt-1">
              Created{" "}
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/blog/${post.slug}`} target="_blank">
            <Button variant="outline">View Live</Button>
          </Link>
          <Link href={`/admin/blog/${post.id}/edit`}>
            <Button>Edit Post</Button>
          </Link>
        </div>
      </div>

      {/* Post Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Preview */}
        <div className="lg:col-span-2 space-y-6">
          {post.coverImage && (
            <div className="bg-background rounded-lg border border-border overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={800}
                height={256}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Content Preview
            </h2>
            <div
              className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-code:bg-muted prose-pre:bg-muted"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
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
                    post.published
                      ? "bg-muted text-foreground"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {post.published ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Featured</span>
                <span className="text-sm text-foreground">
                  {post.featured ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Views</span>
                <span className="text-sm text-foreground">
                  {post.views.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Category</h3>
            {post.category ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {post.category.name}
              </span>
            ) : (
              <p className="text-sm text-muted-foreground">No category</p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Tags</h3>
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags</p>
            )}
          </div>

          {/* Dates */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Dates</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-foreground">
                  {format(new Date(post.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="text-foreground">
                  {format(new Date(post.updatedAt), "MMM d, yyyy")}
                </span>
              </div>
              {post.publishedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span className="text-foreground">
                    {format(new Date(post.publishedAt), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="bg-background rounded-lg border border-border p-6 space-y-4">
              <h3 className="font-medium text-foreground">Excerpt</h3>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
