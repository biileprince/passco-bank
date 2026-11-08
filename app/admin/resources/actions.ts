"use server";

import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const resourceTypes = ["lecture-slide", "note", "past-question"];

export async function createResource(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  const title = String(formData.get("title") || "").trim();
  const type = String(formData.get("type") || "");
  const fileUrl = String(formData.get("fileUrl") || "");
  const fileName = String(formData.get("fileName") || "").trim();
  const fileFormat = String(formData.get("fileFormat") || "").trim();
  const cloudinaryPublicId = String(formData.get("cloudinaryPublicId") || "").trim();
  const programId = String(formData.get("programId") || "");
  const courseId = String(formData.get("courseId") || "");
  const level = Number(formData.get("level"));
  const fileSize = Number(formData.get("fileSize")) || null;
  const academicYear = String(formData.get("academicYear") || "").trim();
  const semester = String(formData.get("semester") || "").trim();

  if (
    title.length < 2 ||
    !resourceTypes.includes(type) ||
    !fileUrl ||
    !fileName ||
    !fileFormat ||
    !programId ||
    !courseId ||
    ![100, 200, 300, 400, 500, 600].includes(level)
  ) {
    return { success: false, error: "Complete all required resource fields." };
  }

  try {
    const course = await prisma.course.findFirst({ where: { id: courseId, programId, level } });
    if (!course) return { success: false, error: "The selected course does not match the program and level." };

    await prisma.resource.create({
      data: {
        title,
        type,
        fileUrl,
        fileName,
        fileFormat,
        cloudinaryPublicId: cloudinaryPublicId || null,
        fileSize,
        programId,
        courseId,
        level,
        academicYear: academicYear || null,
        semester: semester || null,
        uploadedById: admin.id,
      },
    });

    revalidatePath("/admin/resources");
    revalidatePath(`/resources/${type === "past-question" ? "past-questions" : "lecture-slides"}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create resource:", error);
    return { success: false, error: "The resource could not be saved." };
  }
}

export async function approveResource(id: string, _formData: FormData) {
  void _formData;
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  try {
    await prisma.resource.update({
      where: { id },
      data: { approved: true, approvedAt: new Date() },
    });
    revalidatePath("/admin/resources");
    revalidatePath("/resources/lecture-slides");
    revalidatePath("/resources/past-questions");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve resource:", error);
    return { success: false, error: "The resource could not be approved." };
  }

}

export async function approveResourceFormAction(id: string, formData: FormData): Promise<void> {
  const result = await approveResource(id, formData);
  if (!result.success) throw new Error(result.error);
}
