import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  User,
  Briefcase,
  Edit,
  Send,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/login");
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      project: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              company: true,
            },
          },
        },
      },
    },
  });

  if (!invoice) {
    redirect("/admin/invoices");
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/admin/invoices/${invoice.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Header */}
      <div className="rounded-xl border border-border bg-background p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{invoice.invoiceNumber}</h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                invoice.status
              )}`}
            >
              {invoice.status}
            </span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              ${invoice.amount.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Invoice Total</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Info */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Bill To
            </h3>
            <div className="space-y-1">
              <p className="font-medium">
                {invoice.project.user.name || "Unknown"}
              </p>
              {invoice.project.user.company && (
                <p className="text-muted-foreground">
                  {invoice.project.user.company}
                </p>
              )}
              <p className="text-muted-foreground">
                {invoice.project.user.email}
              </p>
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Project
            </h3>
            <div className="space-y-1">
              <p className="font-medium">{invoice.project.name}</p>
              <p className="text-muted-foreground">
                {invoice.project.description || "No description"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dates & Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <span className="text-sm">Invoice Date</span>
          </div>
          <p className="font-medium">
            {invoice.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Due Date</span>
          </div>
          <p className="font-medium">
            {invoice.dueDate
              ? invoice.dueDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Not set"}
          </p>
        </div>

        {invoice.paidDate && (
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Paid Date</span>
            </div>
            <p className="font-medium">
              {invoice.paidDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {invoice.description && (
        <div className="rounded-xl border border-border bg-background p-6">
          <h3 className="font-semibold mb-3">Description / Notes</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {invoice.description}
          </p>
        </div>
      )}
    </div>
  );
}
