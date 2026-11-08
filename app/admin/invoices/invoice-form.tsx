"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import Link from "next/link";
import { createInvoice, updateInvoice } from "./actions";
import { useFormStatus } from "react-dom";

type Project = {
  id: string;
  name: string;
  user: {
    name: string | null;
    email: string;
  };
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: Date | null;
  description: string | null;
  projectId: string;
};

interface InvoiceFormProps {
  projects: Project[];
  invoice?: Invoice;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? isEditing
          ? "Updating..."
          : "Creating..."
        : isEditing
        ? "Update Invoice"
        : "Create Invoice"}
    </Button>
  );
}

export function InvoiceForm({ projects, invoice }: InvoiceFormProps) {
  const isEditing = !!invoice;

  const handleSubmit = async (formData: FormData) => {
    if (isEditing) {
      await updateInvoice(invoice.id, formData);
    } else {
      await createInvoice(formData);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6 max-w-xl">
      <div className="rounded-xl border border-border bg-background p-6 space-y-6">
        {/* Invoice Number (read-only for existing) */}
        {isEditing && (
          <div>
            <Label>Invoice Number</Label>
            <p className="text-lg font-mono font-semibold">
              {invoice.invoiceNumber}
            </p>
          </div>
        )}

        {/* Project Selection */}
        <div>
          <Label htmlFor="projectId">Project *</Label>
          <select
            id="projectId"
            name="projectId"
            required
            defaultValue={invoice?.projectId}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} — {project.user.name || project.user.email}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="amount">Amount ($) *</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={invoice?.amount}
            placeholder="1500.00"
          />
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={invoice?.status || "Pending"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={invoice?.dueDate?.toISOString().split("T")[0]}
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description / Notes</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={invoice?.description || ""}
            placeholder="Invoice details, items, or notes..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <SubmitButton isEditing={isEditing} />
        <Link href="/admin/invoices">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
