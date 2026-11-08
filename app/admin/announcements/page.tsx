import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AnnouncementForm } from "./announcement-form";
import { deleteAnnouncementFormAction, toggleAnnouncementFormAction } from "./actions";

export default async function AdminAnnouncementsPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/login?error=unauthorized&redirect=/admin/announcements");
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Announcements</h1><p className="mt-1 text-sm text-muted-foreground">Publish official notices and updates for hall affiliates.</p></div>
      <AnnouncementForm />
      <div className="rounded-xl border border-border bg-background divide-y divide-border">
        {announcements.length === 0 ? <p className="p-8 text-sm text-muted-foreground">No announcements created yet.</p> : announcements.map((announcement) => (
          <div key={announcement.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div><p className="font-medium">{announcement.title}</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{announcement.content}</p></div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${announcement.published ? "bg-green-500/10 text-green-700" : "bg-muted text-muted-foreground"}`}>{announcement.published ? "Published" : "Draft"}</span>
              <form action={toggleAnnouncementFormAction.bind(null, announcement.id)}>
                <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">{announcement.published ? "Unpublish" : "Publish"}</button>
              </form>
              <form action={deleteAnnouncementFormAction.bind(null, announcement.id)}>
                <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
