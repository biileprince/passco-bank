"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const requestSchema = z.object({
  title: z.string().trim().min(3).max(150),
  details: z.string().trim().min(10).max(3000),
  type: z.enum(["lecture-slide", "note", "past-question"]),
});

export async function submitResourceRequest(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: "Please sign in before requesting a resource." };
  }

  const parsed = requestSchema.safeParse({
    title: formData.get("title"),
    details: formData.get("details"),
    type: formData.get("type"),
  });
  if (!parsed.success) {
    return { success: false, error: "Please complete the request with valid details." };
  }

  try {
    await prisma.resourceRequest.create({
      data: { ...parsed.data, userId: session.user.id },
    });
    revalidatePath("/admin/resource-requests");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit resource request:", error);
    return { success: false, error: "Your resource request could not be submitted." };
  }
}

export async function updateResourceRequest(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (admin?.role !== "admin") return { success: false, error: "Unauthorized" };

  const status = String(formData.get("status") || "");
  if (!["pending", "in-progress", "fulfilled", "closed"].includes(status)) {
    return { success: false, error: "Invalid request status." };
  }

  try {
    await prisma.resourceRequest.update({ where: { id }, data: { status } });
    revalidatePath("/admin/resource-requests");
    return { success: true };
  } catch (error) {
    console.error("Failed to update resource request:", error);
    return { success: false, error: "The resource request could not be updated." };
  }
}

export async function updateResourceRequestFormAction(id: string, formData: FormData): Promise<void> {
  const result = await updateResourceRequest(id, formData);
  if (!result.success) throw new Error(result.error);
}
