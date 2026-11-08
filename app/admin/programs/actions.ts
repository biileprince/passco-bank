"use server";

import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProgram(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  const name = String(formData.get("name") || "").trim();
  const college = String(formData.get("college") || "").trim();
  if (name.length < 2) return { success: false, error: "Program name is required." };

  try {
    await prisma.program.create({ data: { name, college: college || null } });
    revalidatePath("/admin/programs");
    return { success: true };
  } catch (error) {
    console.error("Failed to create program:", error);
    return { success: false, error: "Program already exists or could not be created." };
  }
}

export async function createCourse(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  const code = String(formData.get("code") || "").trim().toUpperCase();
  const title = String(formData.get("title") || "").trim();
  const programId = String(formData.get("programId") || "");
  const level = Number(formData.get("level"));

  if (!code || title.length < 2 || !programId || ![100, 200, 300, 400, 500, 600].includes(level)) {
    return { success: false, error: "Provide a course code, title, program, and valid level." };
  }

  try {
    await prisma.course.create({ data: { code, title, programId, level } });
    revalidatePath("/admin/programs");
    return { success: true };
  } catch (error) {
    console.error("Failed to create course:", error);
    return { success: false, error: "Course already exists or could not be created." };
  }
}
