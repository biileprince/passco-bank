"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { ImageUpload } from "@/app/components/ui/image-upload";
import Link from "next/link";
import { createProject, updateProject } from "./actions";
import { useFormStatus } from "react-dom";

type User = {
  id: string;
  name: string | null;
  email: string;
};

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  budget: number | null;
  category: string | null;
  technologies: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  userId: string;
};

interface ProjectFormProps {
  users: User[];
  project?: Project;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? isEditing
          ? "Updating..."
          : "Creating..."
        : isEditing
          ? "Update Project"
          : "Create Project"}
    </Button>
  );
}

export function ProjectForm({ users, project }: ProjectFormProps) {
  const isEditing = !!project;
  const [imageUrl, setImageUrl] = useState(project?.imageUrl || "");

  const handleSubmit = async (formData: FormData) => {
    // Add imageUrl to formData
    if (imageUrl) {
      formData.set("imageUrl", imageUrl);
    }

    try {
      if (isEditing) {
        await updateProject(project.id, formData);
      } else {
        await createProject(formData);
      }
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
      // If it's a real error from the action, it will have a message
      console.error("Failed to save project:", error);
      // Don't throw, let the form stay open so user can see the error
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="rounded-xl border border-border bg-background p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={project?.name}
                placeholder="E-commerce Website"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={project?.description || ""}
                placeholder="Brief description of the project..."
              />
            </div>

            <div>
              <Label htmlFor="userId">Client *</Label>
              <select
                id="userId"
                name="userId"
                required
                defaultValue={project?.userId}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select a client</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                defaultValue={project?.category || ""}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select category</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Corporate">Corporate</option>
                <option value="Organization">Organization</option>
                <option value="Web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Redesign">Redesign</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status & Progress */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-lg font-semibold">Status & Progress</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={project?.status || "Discovery"}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="Discovery">Discovery</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Live">Live</option>
              </select>
            </div>

            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                name="progress"
                type="number"
                min="0"
                max="100"
                defaultValue={project?.progress || 0}
              />
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={project?.startDate?.toISOString().split("T")[0]}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={project?.endDate?.toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>

        {/* Financial */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-lg font-semibold">Financial</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                min="0"
                defaultValue={project?.budget || ""}
                placeholder="5000"
              />
            </div>
          </div>
        </div>

        {/* Technical */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-lg font-semibold">Technical Details</h2>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="technologies">Technologies</Label>
              <Input
                id="technologies"
                name="technologies"
                defaultValue={project?.technologies || ""}
                placeholder="Next.js, TypeScript, Prisma, PostgreSQL"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated list of technologies
              </p>
            </div>

            <div>
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input
                id="liveUrl"
                name="liveUrl"
                type="url"
                defaultValue={project?.liveUrl || ""}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">Cover Image</Label>
              <ImageUpload
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                onRemove={() => setImageUrl("")}
                folder="projects"
                description="Project cover image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <SubmitButton isEditing={isEditing} />
        <Link href="/admin/projects">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
