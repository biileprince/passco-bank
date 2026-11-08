"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { RichTextEditor } from "@/app/components/ui/rich-text-editor";
import { ImageUpload } from "@/app/components/ui/image-upload";
import { createBlogPost, updateBlogPost } from "./actions";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

interface BlogPostFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    published: boolean;
    featured: boolean;
    categoryId: string | null;
    tags: { id: string }[];
  };
  categories: BlogCategory[];
  tags: BlogTag[];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BlogPostForm({ post, categories, tags }: BlogPostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverImage: post?.coverImage || "",
    published: post?.published || false,
    featured: post?.featured || false,
    categoryId: post?.categoryId || "",
    tagIds: post?.tags.map((t) => t.id) || [],
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      // Auto-generate slug if creating new post or slug is empty
      slug: !post || !prev.slug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        categoryId: formData.categoryId || undefined,
        excerpt: formData.excerpt || undefined,
        coverImage: formData.coverImage || undefined,
      };

      if (post) {
        await updateBlogPost(post.id, data);
      } else {
        await createBlogPost(data);
      }
      // If we reach here, the operation succeeded (redirect will take over)
      // The error catch block below handles redirect() throws
    } catch (error: unknown) {
      // redirect() in Next.js throws an error, so we need to check if it's that
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("NEXT_REDIRECT") ||
        errorMessage.includes("redirect")
      ) {
        // This is a successful redirect, not an actual error
        return;
      }
      console.error("Failed to save blog post:", error);
      alert("Failed to save blog post");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter blog post title"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="url-friendly-slug"
                required
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL: /blog/{formData.slug || "your-slug"}
              </p>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Brief description for previews and SEO"
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Content</Label>
              <div className="mt-1">
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                  placeholder="Write your blog post content here..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Publish</h3>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    published: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="published" className="font-normal">
                Published
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featured: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="featured" className="font-normal">
                Featured post
              </Label>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : post ? "Update" : "Create"}
              </Button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Cover Image</h3>
            <ImageUpload
              value={formData.coverImage}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, coverImage: url }))
              }
              onRemove={() =>
                setFormData((prev) => ({ ...prev, coverImage: "" }))
              }
              folder="blog"
              disabled={loading}
              description="Featured image for the blog post"
            />
          </div>

          {/* Category */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Category</h3>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Tags</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tags available
                </p>
              ) : (
                tags.map((tag) => (
                  <div key={tag.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={formData.tagIds.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            tagIds: [...prev.tagIds, tag.id],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            tagIds: prev.tagIds.filter((id) => id !== tag.id),
                          }));
                        }
                      }}
                      className="h-4 w-4 rounded border-border"
                    />
                    <Label htmlFor={`tag-${tag.id}`} className="font-normal">
                      {tag.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
