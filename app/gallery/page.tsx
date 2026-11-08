import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[rgb(6,119,0)]">Hall life</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">The Oguaa community.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">A growing collection of moments from hall events, facilities, sports, and student life.</p>
        {images.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">Gallery images will appear here once they are approved by administrators.</div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <figure key={image.id} className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
                <div className="relative aspect-[4/3] bg-muted">
                  <Image src={image.imageUrl} alt={image.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <figcaption className="p-5">
                  <h2 className="font-semibold">{image.title}</h2>
                  {image.caption && <p className="mt-2 text-sm leading-6 text-muted-foreground">{image.caption}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
