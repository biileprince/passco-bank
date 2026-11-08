import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  FolderKanban,
  FileText,
  DollarSign,
  User,
} from "lucide-react";

interface ClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params;

  const client = await prisma.user.findUnique({
    where: { id },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        include: {
          invoices: true,
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  // Calculate statistics
  const totalProjects = client.projects.length;
  const activeProjects = client.projects.filter(
    (p) =>
      p.status === "In Progress" ||
      p.status === "Planning" ||
      p.status === "Review"
  ).length;
  const completedProjects = client.projects.filter(
    (p) => p.status === "Completed"
  ).length;

  const allInvoices = client.projects.flatMap((p) => p.invoices);
  const totalInvoiced = allInvoices.reduce((acc, inv) => acc + inv.amount, 0);
  const paidAmount = allInvoices
    .filter((inv) => inv.status === "Paid")
    .reduce((acc, inv) => acc + inv.amount, 0);
  const pendingAmount = allInvoices
    .filter((inv) => inv.status === "Pending")
    .reduce((acc, inv) => acc + inv.amount, 0);

  const statusColors: Record<string, string> = {
    Planning: "bg-blue-500/10 text-blue-500",
    "In Progress": "bg-amber-500/10 text-amber-500",
    Review: "bg-purple-500/10 text-purple-500",
    Completed: "bg-green-500/10 text-green-500",
    "On Hold": "bg-gray-500/10 text-gray-500",
    Cancelled: "bg-red-500/10 text-red-500",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/admin/clients"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-4">
            {client.image ? (
              <Image
                src={client.image}
                alt={client.name || "Client"}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground border-2 border-border">
                <User className="h-8 w-8" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {client.name || "Unknown Client"}
              </h1>
              {client.company && (
                <p className="text-muted-foreground">{client.company}</p>
              )}
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {client.email}
                </span>
                {client.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {client.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-14 sm:ml-0">
          <a
            href={`mailto:${client.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Mail className="h-4 w-4" />
            Send Email
          </a>
          <Link
            href={`/admin/projects/new?clientId=${client.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <FolderKanban className="h-4 w-4" />
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <FolderKanban className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalProjects}</p>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <FolderKanban className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeProjects}</p>
              <p className="text-sm text-muted-foreground">Active Projects</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                ${paidAmount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Paid</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <DollarSign className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                ${pendingAmount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Projects List */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-background p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Projects</h2>
              <span className="text-sm text-muted-foreground">
                {completedProjects} of {totalProjects} completed
              </span>
            </div>
            {client.projects.length > 0 ? (
              <div className="space-y-3">
                {client.projects.map((project) => {
                  const projectInvoiced = project.invoices.reduce(
                    (acc, inv) => acc + inv.amount,
                    0
                  );
                  const projectPaid = project.invoices
                    .filter((inv) => inv.status === "Paid")
                    .reduce((acc, inv) => acc + inv.amount, 0);

                  return (
                    <Link
                      key={project.id}
                      href={`/admin/projects/${project.id}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{project.name}</h3>
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              statusColors[project.status] ||
                              "bg-gray-500/10 text-gray-500"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description || "No description"}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          {project.category && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {project.category}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {project.invoices.length} invoices
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${projectInvoiced.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${projectPaid.toLocaleString()} paid
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No projects yet</p>
                <Link
                  href={`/admin/projects/new?clientId=${client.id}`}
                  className="text-primary hover:underline text-sm"
                >
                  Create the first project
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Details */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold mb-4">Client Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <a
                  href={`mailto:${client.email}`}
                  className="text-primary hover:underline"
                >
                  {client.email}
                </a>
              </div>
              {client.phone && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <a
                    href={`tel:${client.phone}`}
                    className="text-primary hover:underline"
                  >
                    {client.phone}
                  </a>
                </div>
              )}
              {client.company && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Company</p>
                  <p className="font-medium">{client.company}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Member Since
                </p>
                <p className="font-medium">
                  {new Date(client.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Invoiced</span>
                <span className="font-medium">
                  ${totalInvoiced.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Paid</span>
                <span className="font-medium text-green-500">
                  ${paidAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium text-amber-500">
                  ${pendingAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-muted-foreground">Payment Rate</span>
                <span className="font-medium">
                  {totalInvoiced > 0
                    ? Math.round((paidAmount / totalInvoiced) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
            {allInvoices.length > 0 ? (
              <div className="space-y-2">
                {allInvoices.slice(0, 5).map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/admin/invoices/${invoice.id}`}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${invoice.amount.toLocaleString()}
                      </p>
                      <span
                        className={`text-xs ${
                          invoice.status === "Paid"
                            ? "text-green-500"
                            : invoice.status === "Overdue"
                            ? "text-red-500"
                            : "text-amber-500"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No invoices yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
