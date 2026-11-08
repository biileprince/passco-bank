import { prisma } from "@/lib/prisma";
import { CalendarDays, Pin } from "lucide-react";

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    where: { published: true },
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    take: 30,
  });

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[rgb(6,119,0)]">Hall notice board</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">Stay informed.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Official updates, deadlines, meeting notices, and opportunities from Oguaa Hall leadership.
        </p>
        <div className="mt-12 space-y-4">
          {announcements.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
              No announcements have been published yet.
            </div>
          ) : announcements.map((announcement) => (
            <article key={announcement.id} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-[rgb(255,217,0)]/30 px-3 py-1 font-medium uppercase tracking-wide text-[rgb(6,119,0)]">{announcement.category}</span>
                {announcement.pinned && <span className="inline-flex items-center gap-1 text-[rgb(6,119,0)]"><Pin className="h-3 w-3" /> Pinned</span>}
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {new Date(announcement.publishedAt || announcement.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold">{announcement.title}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{announcement.content}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
