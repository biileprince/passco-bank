"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { RichTextEditor } from "@/app/components/ui/rich-text-editor";
import { ImageUpload } from "@/app/components/ui/image-upload";
import { MultiImageUpload } from "@/app/components/ui/multi-image-upload";
import { createPortfolioProject, updatePortfolioProject } from "./actions";

interface PortfolioFormProps {
  project?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    coverImage: string | null;
    images: string | null;
    category: string | null;
    technologies: string | null;
    client: string | null;
    liveUrl: string | null;
    githubUrl: string | null;
    featured: boolean;
    published: boolean;
    completedAt: Date | null;
  };
  categories: string[];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PortfolioForm({ project, categories }: PortfolioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Parse gallery images from JSON string to array
  const parseGalleryImages = (images: string | null | undefined): string[] => {
    if (!images) return [];
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Try splitting by newlines if not JSON
      return images.split("\n").filter((url) => url.trim());
    }
  };

  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    description: project?.description || "",
    content: project?.content || "",
    coverImage: project?.coverImage || "",
    images: parseGalleryImages(project?.images),
    category: project?.category || "",
    technologies: project?.technologies || "",
    client: project?.client || "",
    liveUrl: project?.liveUrl || "",
    githubUrl: project?.githubUrl || "",
    featured: project?.featured || false,
    published: project?.published ?? true,
    completedAt: project?.completedAt
      ? new Date(project.completedAt).toISOString().split("T")[0]
      : "",
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !project || !prev.slug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...formData,
      description: formData.description || undefined,
      content: formData.content || undefined,
      coverImage: formData.coverImage || undefined,
      images:
        formData.images.length > 0
          ? JSON.stringify(formData.images)
          : undefined,
      category: formData.category || undefined,
      technologies: formData.technologies || undefined,
      client: formData.client || undefined,
      liveUrl: formData.liveUrl || undefined,
      githubUrl: formData.githubUrl || undefined,
      completedAt: formData.completedAt
        ? new Date(formData.completedAt)
        : undefined,
    };

    const result = project
      ? await updatePortfolioProject(project.id, data)
      : await createPortfolioProject(data);

    if (result?.success) {
      router.push("/admin/portfolio");
    } else {
      console.error("Failed to save project:", result?.error);
      alert(result?.error || "Failed to save project");
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
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter project title"
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
                URL: /work/{formData.slug || "your-slug"}
              </p>
            </div>

            <div>
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief project description for listings"
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Case Study Content</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Detailed write-up about the project, challenges, and solutions
              </p>
              <RichTextEditor
                content={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
                placeholder="Write your case study content here..."
              />
            </div>
          </div>

          {/* Technologies & Client */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Project Details</h3>

            <div>
              <Label htmlFor="technologies">Technologies Used</Label>
              <Input
                id="technologies"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    technologies: e.target.value,
                  }))
                }
                placeholder="React, Next.js, TypeScript, Tailwind CSS"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated list of technologies
              </p>
            </div>

            <div>
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, client: e.target.value }))
                }
                placeholder="Client or company name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="completedAt">Completion Date</Label>
              <Input
                id="completedAt"
                type="date"
                value={formData.completedAt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    completedAt: e.target.value,
                  }))
                }
                className="mt-1"
              />
            </div>
          </div>

          {/* Links */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Project Links</h3>

            <div>
              <Label htmlFor="liveUrl">Live Demo URL</Label>
              <Input
                id="liveUrl"
                type="url"
                value={formData.liveUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))
                }
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="githubUrl">GitHub Repository</Label>
              <Input
                id="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    githubUrl: e.target.value,
                  }))
                }
                placeholder="https://github.com/username/repo"
                className="mt-1"
              />
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
                Featured project
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
                {loading ? "Saving..." : project ? "Update" : "Create"}
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
              folder="portfolio"
              disabled={loading}
              description="Main project thumbnail"
            />
          </div>

          {/* Gallery Images */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Gallery Images</h3>
            <MultiImageUpload
              value={formData.images}
              onChange={(urls) =>
                setFormData((prev) => ({ ...prev, images: urls }))
              }
              onRemove={(url) =>
                setFormData((prev) => ({
                  ...prev,
                  images: prev.images.filter((img) => img !== url),
                }))
              }
              folder="portfolio/gallery"
              disabled={loading}
              maxImages={10}
              description="Project screenshots and images"
            />
          </div>

          {/* Category */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-medium text-foreground">Category</h3>
            <div>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                placeholder="E-Commerce, Web App, Corporate..."
                list="categories"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              <p className="text-xs text-muted-foreground mt-1">
                Type a new category or select existing
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
