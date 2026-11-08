import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAdminUser } from "@/lib/admin";
import { AdminSidebar } from "./components/admin-sidebar";
import { AdminHeader } from "./components/admin-header";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/login?error=unauthorized&redirect=/admin");
  }

  return (
    <div className="flex min-h-screen bg-muted/30 overflow-x-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <AdminHeader admin={admin} />
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 pb-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
