import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EventForm } from "./event-form";
import { deleteEventFormAction, toggleEventFormAction } from "./actions";

export default async function AdminEventsPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/login?error=unauthorized&redirect=/admin/events");
  const events = await prisma.event.findMany({ orderBy: { startsAt: "asc" }, take: 50 });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Events</h1><p className="mt-1 text-sm text-muted-foreground">Manage hall meetings, socials, elections, and activities.</p></div>
      <EventForm />
      <div className="rounded-xl border border-border bg-background divide-y divide-border">
        {events.length === 0 ? <p className="p-8 text-sm text-muted-foreground">No events created yet.</p> : events.map((event) => (
          <div key={event.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div><p className="font-medium">{event.title}</p><p className="mt-1 text-sm text-muted-foreground">{new Date(event.startsAt).toLocaleString()} {event.location ? `· ${event.location}` : ""}</p></div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${event.published ? "bg-green-500/10 text-green-700" : "bg-muted text-muted-foreground"}`}>{event.published ? "Published" : "Draft"}</span>
              <form action={toggleEventFormAction.bind(null, event.id)}>
                <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">{event.published ? "Unpublish" : "Publish"}</button>
              </form>
              <form action={deleteEventFormAction.bind(null, event.id)}>
                <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
