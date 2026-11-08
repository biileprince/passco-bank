"use server";

import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

const categories = ["hall-week", "facilities", "sports-socials", "meetings", "community"];

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createGalleryImage(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  const title = String(formData.get("title") || "").trim();
  const caption = String(formData.get("caption") || "").trim();
  const category = String(formData.get("category") || "");
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const publicId = String(formData.get("publicId") || "").trim();

  if (title.length < 2 || !categories.includes(category) || !imageUrl) {
    return { success: false, error: "Complete all required gallery fields." };
  }

  try {
    await prisma.galleryImage.create({
      data: {
        title,
        caption: caption || null,
        category,
        imageUrl,
        publicId: publicId || null,
      },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    console.error("Failed to create gallery image:", error);
    return { success: false, error: "The gallery image could not be saved." };
  }
}

export async function approveGalleryImage(id: string, _formData: FormData) {
  void _formData;
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  try {
    await prisma.galleryImage.update({
      where: { id },
      data: { approved: true },
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve gallery image:", error);
    return { success: false, error: "The gallery image could not be approved." };
  }
}

export async function deleteGalleryImage(id: string, _formData: FormData) {
  void _formData;
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  try {
    const image = await prisma.galleryImage.findUnique({ where: { id } });
    if (!image) return { success: false, error: "Gallery image not found." };

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId, { resource_type: "image" });
    }

    await prisma.galleryImage.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete gallery image:", error);
    return { success: false, error: "The gallery image could not be deleted." };
  }
}

export async function approveGalleryImageFormAction(id: string, formData: FormData): Promise<void> {
  const result = await approveGalleryImage(id, formData);
  if (!result.success) throw new Error(result.error);
}

export async function deleteGalleryImageFormAction(id: string, formData: FormData): Promise<void> {
  const result = await deleteGalleryImage(id, formData);
  if (!result.success) throw new Error(result.error);
}
