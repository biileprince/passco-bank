import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
  FileText,
  ArrowLeft,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { format, isPast } from "date-fns";
import { headers } from "next/headers";

async function getInvoices(userId: string) {
  const invoices = await prisma.invoice.findMany({
    where: {
      project: {
        userId,
      },
    },
    include: {
      project: {
        select: {
          name: true,
          id: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return invoices;
}

export default async function InvoicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const invoices = await getInvoices(session.user.id);

  // Calculate stats
  const pending = invoices.filter((i) => i.status === "Pending");
  const paid = invoices.filter((i) => i.status === "Paid");
  const overdue = invoices.filter(
    (i) => i.status === "Pending" && i.dueDate && isPast(new Date(i.dueDate))
  );

  const totalPending = pending.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = paid.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-20 sm:pt-24 pb-12 sm:pb-16">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-3 sm:mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="text-sm">Back to Dashboard</span>
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            My Invoices
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            View and manage all your invoices
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <div className="rounded-lg border border-border bg-card p-3 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Invoices
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                  {invoices.length}
                </h3>
              </div>
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <h3 className="text-2xl font-bold mt-2">
                  ${totalPending.toLocaleString()}
                </h3>
              </div>
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-500" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Paid
                </p>
                <h3 className="text-2xl font-bold mt-2">
                  ${totalPaid.toLocaleString()}
                </h3>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Overdue
                </p>
                <h3 className="text-2xl font-bold mt-2">{overdue.length}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>
          </div>
        </div>

        {/* Invoices List */}
        {invoices.length === 0 ? (
          <div className="text-center py-12 rounded-lg border border-border bg-card">
            <FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No invoices yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Your invoices will appear here once they are created.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-base sm:text-lg font-semibold">
                All Invoices
              </h2>
            </div>
            <div className="divide-y divide-border">
              {invoices.map((invoice) => {
                const isOverdue =
                  invoice.status === "Pending" &&
                  invoice.dueDate &&
                  isPast(new Date(invoice.dueDate));

                return (
                  <Link
                    key={invoice.id}
                    href={`/dashboard/invoices/${invoice.id}`}
                    className="block p-4 sm:p-6 hover:bg-accent transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-0.5 text-sm sm:text-base">
                            {invoice.invoiceNumber}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {invoice.project.name}
                          </p>
                          {invoice.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1">
                              {invoice.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 self-start ${
                          invoice.status === "Paid"
                            ? "bg-green-500/10 text-green-600 dark:text-green-500"
                            : isOverdue
                            ? "bg-red-500/10 text-red-600 dark:text-red-500"
                            : "bg-orange-500/10 text-orange-600 dark:text-orange-500"
                        }`}
                      >
                        {isOverdue ? "Overdue" : invoice.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        {invoice.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-6 text-muted-foreground">
                        {invoice.dueDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              Due{" "}
                              {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                            </span>
                          </div>
                        )}
                        {invoice.paidDate && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-500">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>
                              Paid{" "}
                              {format(
                                new Date(invoice.paidDate),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
