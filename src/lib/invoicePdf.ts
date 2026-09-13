import { reportError } from "@/lib/errorReporting";
import { formatAmount } from "@/lib/invoiceFormat";
import type { SavedInvoice } from "@/store/invoices";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateInvoiceHtml(invoice: SavedInvoice) {
  const symbol = invoice.currency.symbol;

  const itemRows = invoice.items
    .map((item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price.replace(/,/g, "")) || 0;
      return `
        <tr>
          <td>${escapeHtml(item.description)}</td>
          <td class="num">${item.quantity}</td>
          <td class="num">${symbol}${formatAmount(price)}</td>
          <td class="num">${symbol}${formatAmount(quantity * price)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, Helvetica, Arial, sans-serif;
            color: #1A1D1F;
            padding: 32px;
          }
          h1 {
            font-size: 22px;
            margin: 0 0 4px;
          }
          .invoice-number {
            color: #6B7280;
            font-size: 13px;
            margin-bottom: 24px;
          }
          .parties {
            display: flex;
            justify-content: space-between;
            margin-bottom: 24px;
          }
          .parties div { width: 48%; }
          .label {
            font-size: 11px;
            color: #9CA3AF;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .value {
            font-size: 13px;
            font-weight: 600;
            color: #0D3B66;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          th {
            text-align: left;
            font-size: 11px;
            color: #9CA3AF;
            border-bottom: 1px solid #E2E8F0;
            padding: 8px 4px;
          }
          td {
            font-size: 12px;
            padding: 8px 4px;
            border-bottom: 1px solid #F1F5F9;
          }
          .num { text-align: right; }
          .summary {
            width: 260px;
            margin-left: auto;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            padding: 4px 0;
            color: #6B7280;
          }
          .summary-total {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 700;
            border-top: 1px solid #E2E8F0;
            padding-top: 8px;
            margin-top: 4px;
            color: #1A1D1F;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #E2E8F0;
          }
          .footer div { width: 48%; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(invoice.invoiceTitle || "Invoice")}</h1>
        <div class="invoice-number">Invoice No. #${invoice.invoiceNumber} · ${invoice.issuanceDate}</div>

        <div class="parties">
          <div>
            <div class="label">Bill To</div>
            <div class="value">${escapeHtml(invoice.clientName)}</div>
          </div>
          <div>
            <div class="label">From</div>
            <div class="value">${escapeHtml(invoice.yourName)}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="num">Qty</th>
              <th class="num">Unit Price</th>
              <th class="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${symbol}${formatAmount(invoice.subtotal)}</span>
          </div>
          <div class="summary-row">
            <span>Tax</span>
            <span>${symbol}${formatAmount(invoice.vatAmount)}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>${symbol}${formatAmount(invoice.shippingAmount)}</span>
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span>${symbol}${formatAmount(invoice.total)}</span>
          </div>
        </div>

        <div class="footer">
          <div>
            <div class="label">Terms of Payment</div>
            <div class="value">${escapeHtml(invoice.terms || "—")}</div>
          </div>
          <div>
            <div class="label">Payment Details</div>
            <div class="value">Bank Number: ${escapeHtml(invoice.bankNumber)}</div>
            <div class="value">Bank Name: ${escapeHtml(invoice.bankName)}</div>
            <div class="value">Account Name: ${escapeHtml(invoice.accountName)}</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function downloadInvoicePdf(invoice: SavedInvoice) {
  const { uri } = await Print.printToFileAsync({
    html: generateInvoiceHtml(invoice),
  });

  Sharing.isAvailableAsync()
    .then((canShare) => {
      if (!canShare) {
        return;
      }
      return Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: `Invoice #${invoice.invoiceNumber}`,
        UTI: "com.adobe.pdf",
      });
    })
    .catch((error) => {
      reportError(error, "invoicePdf:shareAsync");
    });

  return uri;
}
