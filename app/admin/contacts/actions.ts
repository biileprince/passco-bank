"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateContactStatus(id: string, status: string) {
  try {
    await prisma.contact.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    console.error("Failed to update contact status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    });
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return { success: false, error: "Failed to delete contact" };
  }
}
