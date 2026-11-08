"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const complaintSchema = z.object({
  type: z.enum(["complaint", "suggestion"]),
  subject: z.string().trim().min(3).max(150),
  details: z.string().trim().min(10).max(5000),
  anonymous: z.boolean(),
});

export async function submitComplaint(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Please sign in before submitting feedback." };

  const parsed = complaintSchema.safeParse({
    type: formData.get("type"),
    subject: formData.get("subject"),
    details: formData.get("details"),
    anonymous: formData.get("anonymous") === "on",
  });
  if (!parsed.success) return { success: false, error: "Please complete all fields with valid details." };

  try {
    await prisma.complaint.create({
      data: {
        ...parsed.data,
        userId: parsed.data.anonymous ? null : session.user.id,
      },
    });
    revalidatePath("/admin/complaints");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit complaint:", error);
    return { success: false, error: "Your feedback could not be submitted. Please try again." };
  }
}

export async function updateComplaint(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (admin?.role !== "admin") return { success: false, error: "Unauthorized" };

  const status = String(formData.get("status") || "");
  const response = String(formData.get("response") || "").trim();
  if (!["new", "in-review", "resolved", "closed"].includes(status)) {
    return { success: false, error: "Invalid complaint status." };
  }

  try {
    await prisma.complaint.update({
      where: { id },
      data: {
        status,
        response: response || null,
      },
    });
    revalidatePath("/admin/complaints");
    return { success: true };
  } catch (error) {
    console.error("Failed to update complaint:", error);
    return { success: false, error: "The complaint could not be updated." };
  }
}

export async function updateComplaintFormAction(id: string, formData: FormData): Promise<void> {
  const result = await updateComplaint(id, formData);
  if (!result.success) throw new Error(result.error);
}
