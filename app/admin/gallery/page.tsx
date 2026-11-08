import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { GalleryForm } from "./gallery-form";
import { approveGalleryImageFormAction, deleteGalleryImageFormAction } from "./actions";

const categoryLabels: Record<string, string> = {
  "hall-week": "Hall Week",
  facilities: "Facilities",
  "sports-socials": "Sports & Socials",
  meetings: "General Meetings",
  community: "Community",
};

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gallery</h1>
        <p className="mt-1 text-sm text-muted-foreground">Upload and approve photos for the public Oguaa Hall gallery.</p>
      </div>
      <GalleryForm />
      <section className="rounded-xl border border-border bg-background">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold">Gallery images</h2>
        </div>
        {images.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No gallery images uploaded yet.</p>
        ) : (
          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <article key={image.id} className="overflow-hidden rounded-xl border border-border">
                <div className="relative aspect-[4/3] bg-muted">
                  <Image src={image.imageUrl} alt={image.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="font-medium">{image.title}</h3>
                    <p className="text-xs text-muted-foreground">{categoryLabels[image.category] || image.category}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${image.approved ? "bg-green-500/10 text-green-700" : "bg-amber-500/10 text-amber-700"}`}>
                      {image.approved ? "Approved" : "Pending"}
                    </span>
                    <div className="flex gap-2">
                      {!image.approved && (
                        <form action={approveGalleryImageFormAction.bind(null, image.id)}>
                          <button className="rounded-lg bg-[rgb(6,119,0)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[rgb(6,95,0)]">Approve</button>
                        </form>
                      )}
                      <form action={deleteGalleryImageFormAction.bind(null, image.id)}>
                        <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50">Delete</button>
                      </form>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
