import prisma from "@/lib/prisma";
import { InvoiceForm } from "../invoice-form";

export default async function NewInvoicePage() {
  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">New Invoice</h1>
        <p className="text-muted-foreground mt-1">
          Create a new invoice for a project
        </p>
      </div>

      {/* Form */}
      <InvoiceForm projects={projects} />
    </div>
  );
}
