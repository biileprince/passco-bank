import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { InvoiceForm } from "../../invoice-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/login");
  }

  // Fetch invoice and projects
  const [invoice, projects] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        invoiceNumber: true,
        amount: true,
        status: true,
        dueDate: true,
        description: true,
        projectId: true,
      },
    }),
    prisma.project.findMany({
      where: {
        status: { not: "Cancelled" },
      },
      select: {
        id: true,
        name: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!invoice) {
    redirect("/admin/invoices");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Edit Invoice</h1>
        <p className="text-muted-foreground">
          Update invoice {invoice.invoiceNumber}
        </p>
      </div>

      <InvoiceForm projects={projects} invoice={invoice} />
    </div>
  );
}
