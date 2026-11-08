"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { deleteBlogPost } from "./actions";
import { Button } from "@/app/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: Date;
  publishedAt: Date | null;
  category: {
    id: string;
    name: string;
  } | null;
  tags: {
    id: string;
    name: string;
  }[];
}

export function BlogPostsTable({ posts }: { posts: BlogPost[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setDeleting(id);
    try {
      await deleteBlogPost(id);
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      alert("Failed to delete blog post");
    } finally {
      setDeleting(null);
    }
  };

  if (posts.length === 0) {
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-foreground">
          No blog posts yet
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by creating your first blog post.
        </p>
        <Link href="/admin/blog/new">
          <Button className="mt-4">Create Blog Post</Button>
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
                Title
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                Views
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
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-3 sm:px-6 py-4">
                  <div>
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      {post.title}
                    </Link>
                    {post.featured && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                        Featured
                      </span>
                    )}
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {post.category ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {post.category.name}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.published
                        ? "bg-muted text-foreground"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">
                  {post.views.toLocaleString()}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden lg:table-cell">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 sm:px-3"
                      >
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/blog/${post.id}/edit`}>
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
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      className="text-destructive hover:text-destructive h-8 px-2 sm:px-3"
                    >
                      {deleting === post.id ? "..." : "Delete"}
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
