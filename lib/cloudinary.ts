// Client-side helper functions for Cloudinary uploads
// The actual Cloudinary SDK is only used in the API route (server-side)

export const uploadToCloudinary = async (
  file: File,
  folder: string = "axiomcraft"
): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }

  return response.json();
};

export const deleteFromCloudinary = async (
  publicId: string
): Promise<{ success: boolean }> => {
  const response = await fetch("/api/upload", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Delete failed");
  }

  return response.json();
};
