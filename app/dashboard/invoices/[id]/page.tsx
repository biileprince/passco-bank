"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  CheckCircle2,
  Briefcase,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string | null;
  paidDate: string | null;
  description: string | null;
  items: string | null;
  createdAt: string;
  project: {
    id: string;
    name: string;
  };
}

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setInvoiceId(p.id));
  }, [params]);

  useEffect(() => {
    if (!invoiceId) return;

    async function fetchInvoice() {
      try {
        const response = await fetch(`/api/dashboard/invoices/${invoiceId}`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch invoice");
        }
        const data = await response.json();
        setInvoice(data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [invoiceId, router]);

  const handleDownloadPDF = async () => {
    if (!invoice) return;

    setDownloading(true);
    try {
      const response = await fetch(`/api/dashboard/invoices/${invoice.id}/pdf`);
      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-24 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container py-24">
        <div className="mx-auto max-w-3xl text-center">
          <FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h1 className="mt-4 text-2xl font-bold">Invoice not found</h1>
          <p className="text-muted-foreground mt-2">
            The invoice you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Link href="/dashboard/invoices" className="mt-6 inline-block">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  const lineItems = invoice.items ? JSON.parse(invoice.items) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-20 sm:pt-24 pb-12 sm:pb-16">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="sm" className="mb-3 sm:mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="text-sm">Back to Invoices</span>
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 sm:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                {invoice.invoiceNumber}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Invoice Details
              </p>
            </div>
            <Button
              onClick={handleDownloadPDF}
              disabled={downloading}
              size="sm"
              className="self-start"
            >
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download PDF
            </Button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          {/* Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 sm:justify-between mb-4 sm:mb-6">
            <span
              className={`text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full self-start ${
                invoice.status === "Paid"
                  ? "bg-green-500/10 text-green-600 dark:text-green-500"
                  : invoice.status === "Overdue"
                  ? "bg-red-500/10 text-red-600 dark:text-red-500"
                  : "bg-orange-500/10 text-orange-600 dark:text-orange-500"
              }`}
            >
              {invoice.status}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Issued {format(new Date(invoice.createdAt), "MMM d, yyyy")}
            </span>
          </div>

          {/* Project Link */}
          <Link
            href={`/dashboard/projects/${invoice.project.id}`}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-emerald-600 dark:text-emerald-500 hover:underline mb-4 sm:mb-6"
          >
            <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {invoice.project.name}
          </Link>

          {/* Amount */}
          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
              Total Amount
            </p>
            <p className="text-3xl sm:text-4xl font-bold">
              ${invoice.amount.toLocaleString()}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-4 sm:mb-6">
            {invoice.dueDate && (
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5">
                    Due Date
                  </p>
                  <p className="font-medium text-sm sm:text-base">
                    {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            )}

            {invoice.paidDate && (
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5">
                    Paid Date
                  </p>
                  <p className="font-medium text-sm sm:text-base text-green-600 dark:text-green-500">
                    {format(new Date(invoice.paidDate), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {invoice.description && (
            <div className="mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                Description
              </p>
              <p className="text-xs sm:text-sm">{invoice.description}</p>
            </div>
          )}

          {/* Line Items */}
          {lineItems.length > 0 && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Invoice Items
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {lineItems.map(
                  (
                    item: {
                      description: string;
                      quantity: number;
                      rate: number;
                      amount: number;
                    },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="flex items-start sm:items-center justify-between py-1.5 sm:py-2 gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">
                          {item.description}
                        </p>
                        {item.quantity && (
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                            {item.rate && ` × $${item.rate}`}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold">
                        ${item.amount.toLocaleString()}
                      </p>
                    </div>
                  )
                )}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <p className="font-semibold">Total</p>
                  <p className="text-xl font-bold">
                    ${invoice.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {invoice.status === "Pending" && (
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Payment Required</h3>
                <p className="text-sm text-muted-foreground">
                  Please contact us to arrange payment for this invoice.
                </p>
              </div>
              <Link href="/contact">
                <Button>Contact Us</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
