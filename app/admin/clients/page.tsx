import prisma from "@/lib/prisma";
import { Users } from "lucide-react";
import { ClientsTable } from "./clients-table";

export default async function ClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: "user" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { projects: true },
      },
      projects: {
        select: {
          invoices: {
            select: { amount: true, status: true },
          },
        },
      },
    },
  });

  // Calculate stats for each client
  const clientsWithStats = clients.map((client) => {
    const totalSpent = client.projects.reduce((acc, project) => {
      return (
        acc +
        project.invoices
          .filter((inv) => inv.status === "Paid")
          .reduce((sum, inv) => sum + inv.amount, 0)
      );
    }, 0);

    const pendingAmount = client.projects.reduce((acc, project) => {
      return (
        acc +
        project.invoices
          .filter((inv) => inv.status === "Pending")
          .reduce((sum, inv) => sum + inv.amount, 0)
      );
    }, 0);

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      image: client.image,
      createdAt: client.createdAt,
      projectCount: client._count.projects,
      totalSpent,
      pendingAmount,
    };
  });

  const stats = {
    total: clients.length,
    withProjects: clientsWithStats.filter((c) => c.projectCount > 0).length,
    totalRevenue: clientsWithStats.reduce((acc, c) => acc + c.totalSpent, 0),
    pendingRevenue: clientsWithStats.reduce(
      (acc, c) => acc + c.pendingAmount,
      0
    ),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all registered clients
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Clients</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-green-500">
            {stats.withProjects}
          </p>
          <p className="text-sm text-muted-foreground">Active Clients</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-emerald-500">
            ${stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-amber-500">
            ${stats.pendingRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
      </div>

      {/* Clients Table */}
      {clientsWithStats.length > 0 ? (
        <ClientsTable clients={clientsWithStats} />
      ) : (
        <div className="rounded-xl border border-border bg-background p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
          <p className="text-muted-foreground">
            Clients will appear here when they register on your website
          </p>
        </div>
      )}
    </div>
  );
}
