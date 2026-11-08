import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { InvoicesTable } from "./invoices-table";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  const stats = {
    total: invoices.length,
    pending: invoices.filter((i) => i.status === "Pending").length,
    paid: invoices.filter((i) => i.status === "Paid").length,
    overdue: invoices.filter((i) => i.status === "Overdue").length,
    totalAmount: invoices.reduce((acc, i) => acc + i.amount, 0),
    paidAmount: invoices
      .filter((i) => i.status === "Paid")
      .reduce((acc, i) => acc + i.amount, 0),
    pendingAmount: invoices
      .filter((i) => i.status === "Pending")
      .reduce((acc, i) => acc + i.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Manage invoices and payments
          </p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Invoice
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Invoices</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-green-500">{stats.paid}</p>
          <p className="text-sm text-muted-foreground">Paid</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
          <p className="text-sm text-muted-foreground">Overdue</p>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold">
            ${stats.totalAmount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Invoiced</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-green-500">
            ${stats.paidAmount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Paid</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-2xl font-bold text-amber-500">
            ${stats.pendingAmount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Pending Payment</p>
        </div>
      </div>

      {/* Invoices Table */}
      {invoices.length > 0 ? (
        <InvoicesTable invoices={invoices} />
      ) : (
        <div className="rounded-xl border border-border bg-background p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first invoice to track payments
          </p>
          <Link
            href="/admin/invoices/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </Link>
        </div>
      )}
    </div>
  );
}
