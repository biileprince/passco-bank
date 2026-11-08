"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (server-side only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to extract public_id from Cloudinary URL
function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|svg)$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Helper function to delete image from Cloudinary
async function deleteCloudinaryImage(url: string | null | undefined) {
  if (!url) return;
  const publicId = extractPublicId(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  }
}

// Portfolio Project Actions
export async function getPortfolioProjects(options?: {
  published?: boolean;
  featured?: boolean;
  category?: string;
  search?: string;
}) {
  const where: {
    published?: boolean;
    featured?: boolean;
    category?: string;
    description?: { contains: string; mode: "insensitive" };
  } = {};

  if (options?.published !== undefined) {
    where.published = options.published;
  }
  if (options?.featured !== undefined) {
    where.featured = options.featured;
  }
  if (options?.category) {
    where.category = options.category;
  }
  if (options?.search) {
    where.description = { contains: options.search, mode: "insensitive" };
  }

  const [projects, total] = await Promise.all([
    prisma.portfolioProject.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.portfolioProject.count({ where }),
  ]);

  return { projects, total };
}

export async function getPortfolioProject(id: string) {
  return prisma.portfolioProject.findUnique({
    where: { id },
  });
}

export async function getPortfolioProjectBySlug(slug: string) {
  return prisma.portfolioProject.findUnique({
    where: { slug },
  });
}

export async function createPortfolioProject(data: {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  coverImage?: string;
  images?: string;
  category?: string;
  technologies?: string;
  client?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  published?: boolean;
  completedAt?: Date;
}) {
  try {
    await prisma.portfolioProject.create({ data });
  } catch (error) {
    console.error("Failed to create portfolio project:", error);
    return { success: false, error: "Failed to create portfolio project" };
  }

  revalidatePath("/admin/portfolio");
  revalidatePath("/work");
  return { success: true };
}

export async function updatePortfolioProject(
  id: string,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    content?: string;
    coverImage?: string;
    images?: string;
    category?: string;
    technologies?: string;
    client?: string;
    liveUrl?: string;
    githubUrl?: string;
    featured?: boolean;
    published?: boolean;
    completedAt?: Date | null;
  }
) {
  let projectSlug: string;
  try {
    const existingProject = await prisma.portfolioProject.findUnique({
      where: { id },
    });

    if (data.coverImage && existingProject?.coverImage && data.coverImage !== existingProject.coverImage) {
      await deleteCloudinaryImage(existingProject.coverImage);
    }

    const project = await prisma.portfolioProject.update({ where: { id }, data });
    projectSlug = project.slug;
  } catch (error) {
    console.error("Failed to update portfolio project:", error);
    return { success: false, error: "Failed to update portfolio project" };
  }

  revalidatePath("/admin/portfolio");
  revalidatePath("/work");
  revalidatePath(`/work/${projectSlug}`);
  return { success: true };
}

export async function deletePortfolioProject(id: string) {
  // Get the project to access its images before deleting
  const project = await prisma.portfolioProject.findUnique({
    where: { id },
  });

  // Delete from database first
  await prisma.portfolioProject.delete({ where: { id } });

  // Then delete images from Cloudinary
  if (project) {
    if (project.coverImage) {
      await deleteCloudinaryImage(project.coverImage);
    }
    // If images field contains multiple URLs (comma-separated or JSON array)
    if (project.images) {
      try {
        const imageUrls = JSON.parse(project.images);
        if (Array.isArray(imageUrls)) {
          for (const url of imageUrls) {
            await deleteCloudinaryImage(url);
          }
        }
      } catch {
        // If not JSON, try as comma-separated
        const imageUrls = project.images.split(',').map(url => url.trim());
        for (const url of imageUrls) {
          await deleteCloudinaryImage(url);
        }
      }
    }
  }

  revalidatePath("/admin/portfolio");
  revalidatePath("/work");
}

export async function getPortfolioCategories() {
  const projects = await prisma.portfolioProject.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });

  return projects.map((p) => p.category).filter(Boolean) as string[];
}
