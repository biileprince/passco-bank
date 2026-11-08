"use client";

import { useState } from "react";
import {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  createBlogTag,
  deleteBlogTag,
} from "../actions";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { posts: number };
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CategoriesManager({
  categories,
  tags,
}: {
  categories: Category[];
  tags: Tag[];
}) {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [tagForm, setTagForm] = useState({
    name: "",
    slug: "",
  });

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        await updateBlogCategory(editingCategory.id, categoryForm);
      } else {
        await createBlogCategory(categoryForm);
      }
      setCategoryForm({ name: "", slug: "", description: "" });
      setShowCategoryForm(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createBlogTag(tagForm);
      setTagForm({ name: "", slug: "" });
      setShowTagForm(false);
    } catch (error) {
      console.error("Failed to save tag:", error);
      alert("Failed to save tag");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await deleteBlogCategory(id);
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    await deleteBlogTag(id);
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setShowCategoryForm(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Categories Section */}
      <div className="bg-background rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Categories</h2>
          <Button
            size="sm"
            onClick={() => {
              setShowCategoryForm(!showCategoryForm);
              setEditingCategory(null);
              setCategoryForm({ name: "", slug: "", description: "" });
            }}
          >
            {showCategoryForm ? "Cancel" : "Add Category"}
          </Button>
        </div>

        {showCategoryForm && (
          <form
            onSubmit={handleCategorySubmit}
            className="mb-4 p-4 bg-muted/30 rounded-lg space-y-3"
          >
            <div>
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={categoryForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setCategoryForm((prev) => ({
                    ...prev,
                    name,
                    slug:
                      !editingCategory || !prev.slug
                        ? generateSlug(name)
                        : prev.slug,
                  }));
                }}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={categoryForm.slug}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cat-description">Description</Label>
              <Input
                id="cat-description"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-1"
              />
            </div>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Saving..." : editingCategory ? "Update" : "Create"}
            </Button>
          </form>
        )}

        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet</p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div>
                  <div className="font-medium text-foreground">
                    {category.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    /{category.slug} · {category._count.posts} posts
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditCategory(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tags Section */}
      <div className="bg-background rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Tags</h2>
          <Button
            size="sm"
            onClick={() => {
              setShowTagForm(!showTagForm);
              setTagForm({ name: "", slug: "" });
            }}
          >
            {showTagForm ? "Cancel" : "Add Tag"}
          </Button>
        </div>

        {showTagForm && (
          <form
            onSubmit={handleTagSubmit}
            className="mb-4 p-4 bg-muted/30 rounded-lg space-y-3"
          >
            <div>
              <Label htmlFor="tag-name">Name</Label>
              <Input
                id="tag-name"
                value={tagForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setTagForm((prev) => ({
                    ...prev,
                    name,
                    slug: !prev.slug ? generateSlug(name) : prev.slug,
                  }));
                }}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="tag-slug">Slug</Label>
              <Input
                id="tag-slug"
                value={tagForm.slug}
                onChange={(e) =>
                  setTagForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Saving..." : "Create"}
            </Button>
          </form>
        )}

        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tags yet</p>
          ) : (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-full"
              >
                <span className="text-sm text-foreground">{tag.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({tag._count.posts})
                </span>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
