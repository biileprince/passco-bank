import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import {
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  User,
  ExternalLink,
  Clock,
  Tag,
  Code2,
} from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          company: true,
        },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!project) {
    notFound();
  }

  const technologies = project.technologies
    ? project.technologies.split(",").map((t) => t.trim())
    : [];

  const statusColors: Record<string, string> = {
    Planning: "bg-blue-500/10 text-blue-500",
    "In Progress": "bg-amber-500/10 text-amber-500",
    Review: "bg-purple-500/10 text-purple-500",
    Completed: "bg-green-500/10 text-green-500",
    "On Hold": "bg-gray-500/10 text-gray-500",
    Cancelled: "bg-red-500/10 text-red-500",
  };

  const totalInvoiced = project.invoices.reduce(
    (acc, inv) => acc + inv.amount,
    0
  );
  const paidAmount = project.invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">
              {project.category || "Project"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/projects/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Project
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Live
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {project.description || "No description provided."}
            </p>
          </div>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="rounded-xl border border-border bg-background p-6">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Technologies</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-accent px-3 py-1 text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          <div className="rounded-xl border border-border bg-background p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Invoices</h2>
              <Link
                href={`/admin/invoices/new?projectId=${project.id}`}
                className="text-sm text-primary hover:underline"
              >
                Create Invoice
              </Link>
            </div>
            {project.invoices.length > 0 ? (
              <div className="space-y-3">
                {project.invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/admin/invoices/${invoice.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${invoice.amount.toLocaleString()}
                      </p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          invoice.status === "Paid"
                            ? "bg-green-500/10 text-green-500"
                            : invoice.status === "Overdue"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No invoices yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold mb-4">Project Info</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    statusColors[project.status] ||
                    "bg-gray-500/10 text-gray-500"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              {project.budget && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Budget
                  </span>
                  <span className="font-medium">
                    ${project.budget.toLocaleString()}
                  </span>
                </div>
              )}
              {project.startDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </span>
                  <span className="font-medium">
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {project.endDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    End Date
                  </span>
                  <span className="font-medium">
                    {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {project.category && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </span>
                  <span className="font-medium">{project.category}</span>
                </div>
              )}
            </div>
          </div>

          {/* Client Card */}
          {project.user && (
            <div className="rounded-xl border border-border bg-background p-6">
              <h2 className="text-lg font-semibold mb-4">Client</h2>
              <Link
                href={`/admin/clients/${project.user.id}`}
                className="flex items-center gap-3 rounded-lg p-3 -mx-3 hover:bg-accent transition-colors"
              >
                {project.user.image ? (
                  <Image
                    src={project.user.image}
                    alt={project.user.name || "Client"}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {project.user.name || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {project.user.email}
                  </p>
                  {project.user.company && (
                    <p className="text-xs text-muted-foreground">
                      {project.user.company}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          )}

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
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-muted-foreground">Outstanding</span>
                <span className="font-medium text-amber-500">
                  ${(totalInvoiced - paidAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
