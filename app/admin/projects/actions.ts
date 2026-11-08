"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const progress = parseInt(formData.get("progress") as string) || 0;
    const budget = formData.get("budget")
      ? parseFloat(formData.get("budget") as string)
      : null;
    const category = formData.get("category") as string;
    const technologies = formData.get("technologies") as string;
    const liveUrl = formData.get("liveUrl") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const userId = formData.get("userId") as string;
    const startDate = formData.get("startDate")
      ? new Date(formData.get("startDate") as string)
      : null;
    const endDate = formData.get("endDate")
      ? new Date(formData.get("endDate") as string)
      : null;

    if (!name || !userId) {
      return { success: false, error: "Name and client are required" };
    }

    await prisma.project.create({
      data: {
        name,
        description: description || null,
        status: status || "Discovery",
        progress,
        budget,
        category: category || null,
        technologies: technologies || null,
        liveUrl: liveUrl || null,
        imageUrl: imageUrl || null,
        startDate,
        endDate,
        userId,
      },
    });

    revalidatePath("/admin/projects");
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }

  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const progress = parseInt(formData.get("progress") as string) || 0;
    const budget = formData.get("budget")
      ? parseFloat(formData.get("budget") as string)
      : null;
    const category = formData.get("category") as string;
    const technologies = formData.get("technologies") as string;
    const liveUrl = formData.get("liveUrl") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const userId = formData.get("userId") as string;
    const startDate = formData.get("startDate")
      ? new Date(formData.get("startDate") as string)
      : null;
    const endDate = formData.get("endDate")
      ? new Date(formData.get("endDate") as string)
      : null;

    if (!name || !userId) {
      return { success: false, error: "Name and client are required" };
    }

    await prisma.project.update({
      where: { id },
      data: {
        name,
        description: description || null,
        status: status || "Discovery",
        progress,
        budget,
        category: category || null,
        technologies: technologies || null,
        liveUrl: liveUrl || null,
        imageUrl: imageUrl || null,
        startDate,
        endDate,
        userId,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update project" };
  }

  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    });
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
