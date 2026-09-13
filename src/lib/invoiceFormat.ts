export function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

export function formatAmount(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseNumber(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function computeInvoiceTotals(
  items: { quantity: string; price: string }[],
  vat: string,
  shipping: string,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + parseNumber(item.quantity) * parseNumber(item.price),
    0,
  );
  const vatAmount = subtotal * (parseNumber(vat) / 100);
  const shippingAmount = parseNumber(shipping);
  const total = subtotal + vatAmount + shippingAmount;
  return { subtotal, vatAmount, shippingAmount, total };
}
