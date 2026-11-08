import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateComplaintFormAction } from "@/app/actions/complaints";

export default async function AdminComplaintsPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/login?error=unauthorized&redirect=/admin/complaints");

  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { name: true, studentId: true } } },
  });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Complaints & suggestions</h1><p className="mt-1 text-sm text-muted-foreground">Review private feedback from hall affiliates.</p></div>
      <div className="space-y-4">
        {complaints.length === 0 ? <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No feedback has been submitted.</div> : complaints.map((complaint) => (
          <article key={complaint.id} className="rounded-xl border border-border bg-background p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-[rgb(255,217,0)]/30 px-3 py-1 font-medium uppercase text-[rgb(6,119,0)]">{complaint.type}</span>
              <span>{complaint.anonymous ? "Anonymous" : complaint.user?.studentId || complaint.user?.name || "Student"}</span>
              <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
            </div>
            <h2 className="mt-4 font-semibold">{complaint.subject}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{complaint.details}</p>
            <form action={updateComplaintFormAction.bind(null, complaint.id)} className="mt-5 grid gap-3 rounded-lg bg-muted/40 p-4 sm:grid-cols-[170px_1fr_auto] sm:items-end">
              <label className="space-y-2 text-xs font-medium">
                Status
                <select name="status" defaultValue={complaint.status} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal">
                  <option value="new">New</option>
                  <option value="in-review">In review</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
              <label className="space-y-2 text-xs font-medium">
                Response
                <textarea name="response" defaultValue={complaint.response || ""} rows={2} placeholder="Optional response to the student" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal" />
              </label>
              <button type="submit" className="h-10 rounded-lg bg-[rgb(6,119,0)] px-4 text-sm font-medium text-white hover:bg-[rgb(6,95,0)]">Save</button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
