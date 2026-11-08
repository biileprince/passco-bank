"use server";

import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const category = String(formData.get("category") || "notice");
  const published = formData.get("published") === "on";
  const pinned = formData.get("pinned") === "on";
  if (title.length < 3 || content.length < 10) return { success: false, error: "Title and content are required." };

  try {
    await prisma.announcement.create({
      data: { title, content, category, published, pinned, publishedAt: published ? new Date() : null },
    });
    revalidatePath("/admin/announcements");
    revalidatePath("/announcements");
    return { success: true };
  } catch (error) {
    console.error("Failed to create announcement:", error);
    return { success: false, error: "Announcement could not be saved." };
  }
}

export async function toggleAnnouncement(id: string, _formData: FormData) {
    void _formData;
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Unauthorized" };

    try {
      const announcement = await prisma.announcement.findUnique({ where: { id } });
      if (!announcement) return { success: false, error: "Announcement not found." };
      await prisma.announcement.update({
        where: { id },
        data: {
          published: !announcement.published,
          publishedAt: !announcement.published ? new Date() : null,
        },
      });
      revalidatePath("/admin/announcements");
      revalidatePath("/announcements");
      return { success: true };
    } catch (error) {
      console.error("Failed to update announcement publication:", error);
      return { success: false, error: "Announcement could not be updated." };
    }
}

export async function deleteAnnouncement(id: string, _formData: FormData) {
    void _formData;
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Unauthorized" };

    try {
      await prisma.announcement.delete({ where: { id } });
      revalidatePath("/admin/announcements");
      revalidatePath("/announcements");
      return { success: true };
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      return { success: false, error: "Announcement could not be deleted." };
    }
}

export async function toggleAnnouncementFormAction(id: string, formData: FormData): Promise<void> {
  const result = await toggleAnnouncement(id, formData);
  if (!result.success) throw new Error(result.error);
}

export async function deleteAnnouncementFormAction(id: string, formData: FormData): Promise<void> {
  const result = await deleteAnnouncement(id, formData);
  if (!result.success) throw new Error(result.error);
}
