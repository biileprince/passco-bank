import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        project: {
          userId: session.user.id,
        },
      },
      include: {
        project: {
          select: {
            name: true,
            userId: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const lineItems = invoice.items ? JSON.parse(invoice.items) : [];

    // Generate HTML for PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${invoice.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      padding: 60px;
      color: #1a1a1a;
      background: white;
    }
    .header {
      margin-bottom: 50px;
      border-bottom: 3px solid #10b981;
      padding-bottom: 30px;
    }
    .company-name {
      font-size: 32px;
      font-weight: bold;
      color: #10b981;
      margin-bottom: 8px;
    }
    .invoice-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .invoice-number {
      font-size: 18px;
      color: #666;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 50px;
    }
    .detail-section h3 {
      font-size: 12px;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 10px;
      letter-spacing: 1px;
    }
    .detail-section p {
      margin-bottom: 6px;
      line-height: 1.5;
    }
    .amount-box {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 40px;
    }
    .amount-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    .amount-value {
      font-size: 42px;
      font-weight: bold;
      color: #10b981;
    }
    .status-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .status-paid {
      background: #d1fae5;
      color: #065f46;
    }
    .status-pending {
      background: #fed7aa;
      color: #9a3412;
    }
    .status-overdue {
      background: #fecaca;
      color: #991b1b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }
    thead {
      background: #f9fafb;
    }
    th {
      text-align: left;
      padding: 15px;
      font-size: 12px;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 1px;
      border-bottom: 2px solid #e5e7eb;
    }
    td {
      padding: 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    .item-description {
      font-weight: 500;
      margin-bottom: 4px;
    }
    .item-details {
      font-size: 13px;
      color: #666;
    }
    .amount {
      text-align: right;
      font-weight: 600;
    }
    .total-row {
      background: #f9fafb;
      border-top: 2px solid #10b981;
    }
    .total-row td {
      padding: 20px 15px;
      font-size: 18px;
      font-weight: bold;
    }
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">AxiomCraft</div>
    <div class="invoice-title">Invoice</div>
    <div class="invoice-number">${invoice.invoiceNumber}</div>
  </div>

  <div class="status-badge status-${invoice.status.toLowerCase()}">
    ${invoice.status.toUpperCase()}
  </div>

  <div class="details-grid">
    <div class="detail-section">
      <h3>Bill To</h3>
      <p><strong>${user?.name || "Client"}</strong></p>
      ${user?.email ? `<p>${user.email}</p>` : ""}
      ${user?.company ? `<p>${user.company}</p>` : ""}
    </div>

    <div class="detail-section">
      <h3>Invoice Details</h3>
      <p><strong>Project:</strong> ${invoice.project.name}</p>
      <p><strong>Issue Date:</strong> ${format(
        new Date(invoice.createdAt),
        "MMMM d, yyyy"
      )}</p>
      ${
        invoice.dueDate
          ? `<p><strong>Due Date:</strong> ${format(
              new Date(invoice.dueDate),
              "MMMM d, yyyy"
            )}</p>`
          : ""
      }
      ${
        invoice.paidDate
          ? `<p><strong>Paid Date:</strong> ${format(
              new Date(invoice.paidDate),
              "MMMM d, yyyy"
            )}</p>`
          : ""
      }
    </div>
  </div>

  ${
    invoice.description
      ? `
  <div style="margin-bottom: 30px;">
    <h3 style="font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 10px;">Description</h3>
    <p style="line-height: 1.6;">${invoice.description}</p>
  </div>
  `
      : ""
  }

  ${
    lineItems.length > 0
      ? `
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Quantity</th>
        <th style="text-align: right;">Rate</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${lineItems
        .map(
          (item: {
            description: string;
            quantity: number;
            rate: number;
            amount: number;
          }) => `
        <tr>
          <td>
            <div class="item-description">${item.description}</div>
          </td>
          <td style="text-align: center;">${item.quantity || "-"}</td>
          <td class="amount">${
            item.rate ? `$${item.rate.toLocaleString()}` : "-"
          }</td>
          <td class="amount">$${item.amount.toLocaleString()}</td>
        </tr>
      `
        )
        .join("")}
      <tr class="total-row">
        <td colspan="3"><strong>Total Amount</strong></td>
        <td class="amount">$${invoice.amount.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>
  `
      : `
  <div class="amount-box">
    <div class="amount-label">Total Amount</div>
    <div class="amount-value">$${invoice.amount.toLocaleString()}</div>
  </div>
  `
  }

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>For questions about this invoice, please contact us.</p>
  </div>
</body>
</html>
    `;

    // For now, return the HTML. In production, you'd use a library like puppeteer or playwright
    // to convert HTML to PDF. For this demo, we'll just return the HTML as a downloadable file
    return new Response(html, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
