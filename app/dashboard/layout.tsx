import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StudentSidebar } from "./components/student-sidebar";

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const profile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, studentId: true, role: true },
  });

  return (
    <div className="min-h-screen bg-muted/20">
      <StudentSidebar
        name={profile?.name || session.user.name || "Student"}
        studentId={profile?.studentId || null}
        role={profile?.role || "user"}
      />
      <main className="min-h-screen pt-14 sm:pt-16 lg:pl-72 lg:pt-16">{children}</main>
    </div>
  );
}
