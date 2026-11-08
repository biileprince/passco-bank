import { prisma } from "@/lib/prisma";
import { CalendarDays, MapPin } from "lucide-react";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { published: true, startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    take: 30,
  });

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[rgb(6,119,0)]">Oguaa Hall calendar</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">What&apos;s happening.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Hall week, meetings, elections, socials, and other events for the Oguaa community.</p>
        <div className="mt-12 space-y-4">
          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">No upcoming events have been published yet.</div>
          ) : events.map((event) => (
            <article key={event.id} className="flex flex-col gap-5 rounded-2xl border border-border bg-background p-6 shadow-sm sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-[rgb(255,217,0)]/35 text-[rgb(6,119,0)]">
                <span className="text-xs font-bold uppercase">{new Date(event.startsAt).toLocaleDateString(undefined, { month: "short" })}</span>
                <span className="text-2xl font-bold">{new Date(event.startsAt).getDate()}</span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{event.title}</h2>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(event.startsAt).toLocaleString()}</span>
                  {event.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>}
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{event.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
