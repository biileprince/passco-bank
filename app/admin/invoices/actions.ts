"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Generate unique invoice number
function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `INV-${year}${month}-${random}`;
}

export async function createInvoice(formData: FormData) {
  try {
    const projectId = formData.get("projectId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate")
      ? new Date(formData.get("dueDate") as string)
      : null;
    const status = (formData.get("status") as string) || "Pending";

    if (!projectId || !amount) {
      return { success: false, error: "Project and amount are required" };
    }

    await prisma.invoice.create({
      data: {
        invoiceNumber: generateInvoiceNumber(),
        projectId,
        amount,
        description: description || null,
        dueDate,
        status,
      },
    });

    revalidatePath("/admin/invoices");
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return { success: false, error: "Failed to create invoice" };
  }

  redirect("/admin/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  try {
    const projectId = formData.get("projectId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate")
      ? new Date(formData.get("dueDate") as string)
      : null;
    const status = formData.get("status") as string;

    if (!projectId || !amount) {
      return { success: false, error: "Project and amount are required" };
    }

    await prisma.invoice.update({
      where: { id },
      data: {
        projectId,
        amount,
        description: description || null,
        dueDate,
        status,
        paidDate: status === "Paid" ? new Date() : null,
      },
    });

    revalidatePath("/admin/invoices");
    revalidatePath(`/admin/invoices/${id}`);
  } catch (error) {
    console.error("Failed to update invoice:", error);
    return { success: false, error: "Failed to update invoice" };
  }

  redirect("/admin/invoices");
}

export async function updateInvoiceStatus(id: string, status: string) {
  try {
    await prisma.invoice.update({
      where: { id },
      data: {
        status,
        paidDate: status === "Paid" ? new Date() : null,
      },
    });
    revalidatePath("/admin/invoices");
    return { success: true };
  } catch (error) {
    console.error("Failed to update invoice status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
    revalidatePath("/admin/invoices");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    return { success: false, error: "Failed to delete invoice" };
  }
}
