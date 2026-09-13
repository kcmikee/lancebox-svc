import { createEmptyItem, useInvoiceDraft } from "@/store/invoiceDraft";

const INITIAL_FIELDS = {
  clientName: "",
  yourName: "",
  invoiceTitle: "",
  vat: "",
  shipping: "",
  currency: null,
  bankNumber: "",
  bankName: "",
  accountName: "",
  terms: "",
};

describe("createEmptyItem", () => {
  it("creates a blank item", () => {
    const item = createEmptyItem();
    expect(item.description).toBe("");
    expect(item.quantity).toBe("");
    expect(item.price).toBe("");
  });

  it("gives every item a unique id", () => {
    const a = createEmptyItem();
    const b = createEmptyItem();
    expect(a.id).not.toBe(b.id);
  });
});

describe("useInvoiceDraft", () => {
  beforeEach(() => {
    useInvoiceDraft.setState({
      ...INITIAL_FIELDS,
      items: [createEmptyItem()],
    });
  });

  it("starts empty with a single blank item", () => {
    const state = useInvoiceDraft.getState();
    expect(state.clientName).toBe("");
    expect(state.items).toHaveLength(1);
    expect(state.currency).toBeNull();
  });

  it("merges partial field updates without touching the rest", () => {
    useInvoiceDraft.getState().setDraft({ clientName: "Mr Peter Abu" });
    useInvoiceDraft.getState().setDraft({ yourName: "Jane Doe" });

    const state = useInvoiceDraft.getState();
    expect(state.clientName).toBe("Mr Peter Abu");
    expect(state.yourName).toBe("Jane Doe");
  });

  it("replaces the items array wholesale via setDraft", () => {
    const items = [
      { id: "1", description: "Web Design", quantity: "1", price: "1000" },
    ];
    useInvoiceDraft.getState().setDraft({ items });
    expect(useInvoiceDraft.getState().items).toEqual(items);
  });

  it("restores every field to its default on reset", () => {
    useInvoiceDraft.getState().setDraft({
      clientName: "Mr Peter Abu",
      currency: { code: "USD", symbol: "$" },
      bankName: "Lance Bank",
    });

    useInvoiceDraft.getState().reset();

    const state = useInvoiceDraft.getState();
    expect(state.clientName).toBe("");
    expect(state.currency).toBeNull();
    expect(state.bankName).toBe("");
    expect(state.items).toHaveLength(1);
    expect(state.items[0].description).toBe("");
  });
});
