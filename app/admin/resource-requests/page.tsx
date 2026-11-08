import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateResourceRequestFormAction } from "@/app/actions/resource-requests";

export default async function AdminResourceRequestsPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/login?error=unauthorized&redirect=/admin/resource-requests");

  const requests = await prisma.resourceRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, studentId: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resource requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track missing slides, notes, and past questions requested by students.</p>
      </div>
      <section className="rounded-xl border border-border bg-background">
        {requests.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No resource requests have been submitted.</p>
        ) : (
          <div className="divide-y divide-border">
            {requests.map((request) => (
              <article key={request.id} className="space-y-4 p-5">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{request.title}</h2>
                      <span className="rounded-full bg-[rgb(255,217,0)]/30 px-2 py-1 text-xs font-medium uppercase text-[rgb(6,119,0)]">{request.type.replace("-", " ")}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{request.user.studentId || request.user.name || request.user.email} · {request.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{request.details}</p>
                <form action={updateResourceRequestFormAction.bind(null, request.id)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <label className="space-y-2 text-xs font-medium">
                    Status
                    <select name="status" defaultValue={request.status} className="h-10 rounded-lg border border-input bg-background px-3 text-sm font-normal">
                      <option value="pending">Pending</option>
                      <option value="in-progress">In progress</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="closed">Closed</option>
                    </select>
                  </label>
                  <button type="submit" className="h-10 rounded-lg bg-[rgb(6,119,0)] px-4 text-sm font-medium text-white hover:bg-[rgb(6,95,0)]">Save status</button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
