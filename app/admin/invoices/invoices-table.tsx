"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Eye, Edit, Trash2, Search, Send, CheckCircle } from "lucide-react";
import { deleteInvoice, updateInvoiceStatus } from "./actions";

type Invoice = {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: Date | null;
  paidDate: Date | null;
  description: string | null;
  createdAt: Date;
  project: {
    id: string;
    name: string;
    user: {
      name: string | null;
      email: string;
    };
  };
};

interface InvoicesTableProps {
  invoices: Invoice[];
}

export function InvoicesTable({
  invoices: initialInvoices,
}: InvoicesTableProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesFilter = filter === "all" || invoice.status === filter;
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      invoice.project.name.toLowerCase().includes(search.toLowerCase()) ||
      invoice.project.user.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    const result = await updateInvoiceStatus(id, status);
    if (result.success) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === id
            ? {
                ...inv,
                status,
                paidDate: status === "Paid" ? new Date() : null,
              }
            : inv
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    const result = await deleteInvoice(id);
    if (result.success) {
      setInvoices(invoices.filter((inv) => inv.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Pending: "bg-amber-500/10 text-amber-500",
      Paid: "bg-green-500/10 text-green-500",
      Overdue: "bg-red-500/10 text-red-500",
      Cancelled: "bg-muted text-muted-foreground",
    };
    return styles[status] || "bg-muted text-muted-foreground";
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["all", "Pending", "Paid", "Overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-accent"
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Client / Project
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Due Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium font-mono text-sm">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <p className="text-sm font-medium truncate">
                        {invoice.project.user.name ||
                          invoice.project.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {invoice.project.name}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold">
                        ${invoice.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-sm text-muted-foreground">
                        {invoice.dueDate
                          ? new Date(invoice.dueDate).toLocaleDateString()
                          : "—"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {invoice.status === "Pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleStatusUpdate(invoice.id, "Paid")
                              }
                              className="text-green-500 hover:text-green-500 h-9 w-9"
                              title="Mark as Paid"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Send Reminder"
                              className="h-9 w-9"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Link
                          href={`/admin/invoices/${invoice.id}`}
                          className="p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/invoices/${invoice.id}/edit`}
                          className="p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(invoice.id)}
                          className="text-destructive hover:text-destructive h-9 w-9"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
