"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { createGalleryImage } from "./actions";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

const categoryOptions = [
  ["hall-week", "Hall Week"],
  ["facilities", "Facilities"],
  ["sports-socials", "Sports & Socials"],
  ["meetings", "General Meetings"],
  ["community", "Community"],
];

export function GalleryForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setStatus("Select an image to upload.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Uploading image...");
    try {
      const upload = await uploadToCloudinary(file, "oguaa-hall/gallery");
      const formData = new FormData(event.currentTarget);
      formData.set("imageUrl", upload.url);
      formData.set("publicId", upload.publicId);
      const result = await createGalleryImage(formData);
      setStatus(result.success ? "Image uploaded and queued for approval." : result.error || "Image could not be saved.");
      if (result.success) {
        event.currentTarget.reset();
        setFile(null);
      }
    } catch (error) {
      console.error("Gallery upload failed:", error);
      setStatus("Upload failed. Check the image and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-background p-5">
      <div>
        <h2 className="font-semibold">Upload gallery image</h2>
        <p className="mt-1 text-xs text-muted-foreground">New images remain hidden until approved.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="gallery-title">Title</Label>
        <Input id="gallery-title" name="title" placeholder="Oguaa Hall Week opening" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gallery-category">Category</Label>
          <select id="gallery-category" name="category" defaultValue="community" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
            {categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gallery-file">Image</Label>
          <Input id="gallery-file" type="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="gallery-caption">Caption <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <textarea id="gallery-caption" name="caption" rows={3} placeholder="Event name, date, and context" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <Button type="submit" disabled={isSubmitting} className="bg-[rgb(6,119,0)] text-white hover:bg-[rgb(6,95,0)]">
        {isSubmitting ? "Uploading..." : "Upload image"}
      </Button>
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
    </form>
  );
}
