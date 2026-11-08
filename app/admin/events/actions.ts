"use server";

import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const startsAt = new Date(String(formData.get("startsAt") || ""));
  const published = formData.get("published") === "on";

  if (title.length < 3 || description.length < 10 || Number.isNaN(startsAt.getTime())) {
    return { success: false, error: "Provide a title, description, and valid event date." };
  }

  try {
    await prisma.event.create({ data: { title, description, location: location || null, startsAt, published } });
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "Event could not be saved." };
  }
}

export async function toggleEvent(id: string, _formData: FormData) {
    void _formData;
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Unauthorized" };

    try {
      const event = await prisma.event.findUnique({ where: { id } });
      if (!event) return { success: false, error: "Event not found." };
      await prisma.event.update({ where: { id }, data: { published: !event.published } });
      revalidatePath("/admin/events");
      revalidatePath("/events");
      return { success: true };
    } catch (error) {
      console.error("Failed to update event publication:", error);
      return { success: false, error: "Event could not be updated." };
    }
}

export async function deleteEvent(id: string, _formData: FormData) {
    void _formData;
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Unauthorized" };

    try {
      await prisma.event.delete({ where: { id } });
      revalidatePath("/admin/events");
      revalidatePath("/events");
      return { success: true };
    } catch (error) {
      console.error("Failed to delete event:", error);
      return { success: false, error: "Event could not be deleted." };
    }
}

export async function toggleEventFormAction(id: string, formData: FormData): Promise<void> {
  const result = await toggleEvent(id, formData);
  if (!result.success) throw new Error(result.error);
}

export async function deleteEventFormAction(id: string, formData: FormData): Promise<void> {
  const result = await deleteEvent(id, formData);
  if (!result.success) throw new Error(result.error);
}
