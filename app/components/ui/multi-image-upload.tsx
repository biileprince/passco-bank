"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "./button";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
  folder?: string;
  disabled?: boolean;
  maxImages?: number;
  description?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  onRemove,
  folder = "uploads",
  disabled = false,
  maxImages = 10,
  description,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    setUploading(true);
    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image`);
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} is too large (max 10MB)`);
        }

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

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...value, ...uploadedUrls]);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;
    handleUpload(e.dataTransfer.files);
  };

  const handleRemove = async (url: string) => {
    if (disabled) return;

    try {
      // Extract public_id from Cloudinary URL
      const urlParts = url.split("/");
      const fileWithExt = urlParts[urlParts.length - 1];
      const publicId = `${folder}/${fileWithExt.split(".")[0]}`;

      // Delete from Cloudinary
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });

      onRemove(url);
    } catch (error) {
      console.error("Delete error:", error);
      // Still remove from UI even if deletion fails
      onRemove(url);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {value.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            transition-colors duration-200
            ${dragActive ? "border-primary bg-primary/5" : "border-border"}
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:border-primary/50"
            }
          `}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files)}
            disabled={disabled || uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="flex flex-col items-center justify-center gap-2 text-center">
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-primary">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB (max {maxImages - value.length} more)
                </p>
                {description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {description}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={url} className="relative group aspect-square">
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover rounded-lg border border-border"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemove(url)}
                  disabled={disabled}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {value.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
}
