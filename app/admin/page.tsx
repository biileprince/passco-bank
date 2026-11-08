import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Images,
  MessageSquare,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [
    students,
    resources,
    approvedResources,
    programs,
    pendingRequests,
    openComplaints,
    publishedAnnouncements,
    upcomingEvents,
    recentRequests,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "user" } }),
    prisma.resource.count(),
    prisma.resource.count({ where: { approved: true } }),
    prisma.program.count({ where: { active: true } }),
    prisma.resourceRequest.count({ where: { status: { in: ["pending", "in-progress"] } } }),
    prisma.complaint.count({ where: { status: { in: ["new", "in-review"] } } }),
    prisma.announcement.count({ where: { published: true } }),
    prisma.event.findMany({
      where: { published: true, startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 4,
      select: { id: true, title: true, startsAt: true, location: true },
    }),
    prisma.resourceRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        user: { select: { name: true, studentId: true } },
      },
    }),
  ]);

  const cards = [
    { title: "Registered students", value: students, href: "/admin/students", icon: Users, tone: "text-blue-600 bg-blue-500/10" },
    { title: "Academic resources", value: resources, href: "/admin/resources", icon: BookOpen, tone: "text-[rgb(6,119,0)] bg-[rgb(6,119,0)]/10" },
    { title: "Awaiting action", value: pendingRequests + openComplaints, href: "/admin/resource-requests", icon: Clock3, tone: "text-amber-700 bg-amber-500/10" },
    { title: "Active programmes", value: programs, href: "/admin/programs", icon: GraduationCap, tone: "text-purple-600 bg-purple-500/10" },
    { title: "Published notices", value: publishedAnnouncements, href: "/admin/announcements", icon: MessageSquare, tone: "text-orange-600 bg-orange-500/10" },
    { title: "Approved resources", value: approvedResources, href: "/admin/resources", icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[rgb(6,119,0)]">Oguaa Hall administration</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Good day, keep the hall connected.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage student support, academic resources, notices, and community activities from one place.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, value, href, icon: Icon, tone }) => (
          <Link key={title} href={href} className="group rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className={`rounded-lg p-2.5 ${tone}`}><Icon className="h-5 w-5" /></span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-4 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{title}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-semibold">Recent resource requests</h2>
              <p className="mt-1 text-xs text-muted-foreground">{pendingRequests} request{pendingRequests === 1 ? "" : "s"} awaiting action</p>
            </div>
            <Link href="/admin/resource-requests" className="text-xs font-medium text-[rgb(6,119,0)] hover:underline">View all</Link>
          </div>
          {recentRequests.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No resource requests yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-start justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{request.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{request.user.studentId || request.user.name || "Student"} · {request.createdAt.toLocaleDateString()}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">{request.status.replace("-", " ")}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-semibold">Upcoming events</h2>
              <p className="mt-1 text-xs text-muted-foreground">Published activities on the hall calendar</p>
            </div>
            <Link href="/admin/events" className="text-xs font-medium text-[rgb(6,119,0)] hover:underline">Manage events</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No upcoming events published.</p>
          ) : (
            <div className="divide-y divide-border">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-5">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[rgb(6,119,0)]" />
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{event.startsAt.toLocaleString()} {event.location ? `· ${event.location}` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/complaints" className="flex items-center justify-between rounded-xl border border-border bg-background p-4 text-sm hover:border-[rgb(6,119,0)]">
          <span>Review complaints</span><span className="font-semibold text-[rgb(6,119,0)]">{openComplaints}</span>
        </Link>
        <Link href="/admin/gallery" className="flex items-center justify-between rounded-xl border border-border bg-background p-4 text-sm hover:border-[rgb(6,119,0)]">
          <span>Manage gallery</span><Images className="h-4 w-4 text-[rgb(6,119,0)]" />
        </Link>
        <Link href="/admin/announcements" className="flex items-center justify-between rounded-xl border border-border bg-background p-4 text-sm hover:border-[rgb(6,119,0)]">
          <span>Post a notice</span><MessageSquare className="h-4 w-4 text-[rgb(6,119,0)]" />
        </Link>
        <Link href="/admin/programs" className="flex items-center justify-between rounded-xl border border-border bg-background p-4 text-sm hover:border-[rgb(6,119,0)]">
          <span>Update catalogue</span><GraduationCap className="h-4 w-4 text-[rgb(6,119,0)]" />
        </Link>
      </div>
    </div>
  );
}
