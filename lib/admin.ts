import { headers } from "next/headers";
import { auth } from "./auth";
import prisma from "./prisma";

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
};

// Check if the current user is an admin
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    return user?.role === "admin";
  } catch {
    return false;
  }
}

// Get admin user or null if not admin
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    if (!user || user.role !== "admin") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

// Get dashboard statistics
export async function getDashboardStats() {
  const [
    totalClients,
    totalProjects,
    totalContacts,
    totalInvoices,
    pendingInvoices,
    newContacts,
    activeProjects,
    recentContacts,
    recentProjects,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "user" } }),
    prisma.project.count(),
    prisma.contact.count(),
    prisma.invoice.count(),
    prisma.invoice.count({ where: { status: "Pending" } }),
    prisma.contact.count({ where: { status: "New" } }),
    prisma.project.count({ where: { status: { not: "Live" } } }),
    prisma.contact.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  // Calculate revenue
  const paidInvoices = await prisma.invoice.aggregate({
    where: { status: "Paid" },
    _sum: { amount: true },
  });

  const pendingRevenue = await prisma.invoice.aggregate({
    where: { status: "Pending" },
    _sum: { amount: true },
  });

  return {
    totalClients,
    totalProjects,
    totalContacts,
    totalInvoices,
    pendingInvoices,
    newContacts,
    activeProjects,
    totalRevenue: paidInvoices._sum.amount || 0,
    pendingRevenue: pendingRevenue._sum.amount || 0,
    recentContacts,
    recentProjects,
  };
}
