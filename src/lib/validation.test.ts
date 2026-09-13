import {
  bankDetailsSchema,
  invoiceDetailsSchema,
  signUpSchema,
} from "@/lib/validation";

describe("signUpSchema", () => {
  const valid = {
    email: "peter@gmail.com",
    password: "password123",
    confirmPassword: "password123",
  };

  it("accepts a fully valid submission", async () => {
    await expect(signUpSchema.validate(valid)).resolves.toBeTruthy();
  });

  it("rejects a missing email", async () => {
    await expect(
      signUpSchema.validate({ ...valid, email: "" }),
    ).rejects.toThrow("Email is required");
  });

  it("rejects a malformed email", async () => {
    await expect(
      signUpSchema.validate({ ...valid, email: "not-an-email" }),
    ).rejects.toThrow("Enter a valid email address");
  });

  it("rejects a password under 8 characters", async () => {
    await expect(
      signUpSchema.validate({
        ...valid,
        password: "short1",
        confirmPassword: "short1",
      }),
    ).rejects.toThrow("Password must be at least 8 characters");
  });

  it("rejects a missing password", async () => {
    // Validated per-field, matching how Formik surfaces each field's own
    // error independently rather than aborting on the first failure.
    await expect(
      signUpSchema.validateAt("password", { ...valid, password: "" }),
    ).rejects.toThrow("Password is required");
  });

  it("rejects when confirmPassword does not match password", async () => {
    await expect(
      signUpSchema.validate({ ...valid, confirmPassword: "different1" }),
    ).rejects.toThrow("Passwords do not match");
  });

  it("rejects a missing confirmPassword", async () => {
    await expect(
      signUpSchema.validateAt("confirmPassword", {
        ...valid,
        confirmPassword: "",
      }),
    ).rejects.toThrow("Please confirm your password");
  });
});

describe("invoiceDetailsSchema", () => {
  const validItem = { id: "1", description: "Web Design", quantity: "2", price: "500" };
  const valid = {
    clientName: "Mr Peter Abu",
    yourName: "Miss Olasubomi Akin",
    invoiceTitle: "Website Design",
    currency: { code: "NGN", symbol: "N" },
    items: [validItem],
    vat: "",
    shipping: "",
  };

  it("accepts a fully valid invoice", async () => {
    await expect(invoiceDetailsSchema.validate(valid)).resolves.toBeTruthy();
  });

  it("requires a client name", async () => {
    await expect(
      invoiceDetailsSchema.validate({ ...valid, clientName: "" }),
    ).rejects.toThrow("Client's name is required");
  });

  it("requires the issuer's name", async () => {
    await expect(
      invoiceDetailsSchema.validate({ ...valid, yourName: "" }),
    ).rejects.toThrow("Your name is required");
  });

  it("requires an invoice title", async () => {
    await expect(
      invoiceDetailsSchema.validate({ ...valid, invoiceTitle: "" }),
    ).rejects.toThrow("Invoice title is required");
  });

  it("requires a currency to be selected", async () => {
    await expect(
      invoiceDetailsSchema.validate({ ...valid, currency: null }),
    ).rejects.toThrow("Select a currency");
  });

  it("requires at least one item", async () => {
    await expect(
      invoiceDetailsSchema.validate({ ...valid, items: [] }),
    ).rejects.toThrow("Add at least one item");
  });

  it("rejects an item with no description", async () => {
    await expect(
      invoiceDetailsSchema.validate({
        ...valid,
        items: [{ ...validItem, description: "" }],
      }),
    ).rejects.toThrow("Description is required");
  });

  it("rejects an item with a zero quantity", async () => {
    await expect(
      invoiceDetailsSchema.validate({
        ...valid,
        items: [{ ...validItem, quantity: "0" }],
      }),
    ).rejects.toThrow("Enter a quantity greater than 0");
  });

  it("rejects an item with a non-numeric price", async () => {
    await expect(
      invoiceDetailsSchema.validate({
        ...valid,
        items: [{ ...validItem, price: "abc" }],
      }),
    ).rejects.toThrow("Enter a price greater than 0");
  });

  it("accepts a comma-formatted price", async () => {
    await expect(
      invoiceDetailsSchema.validate({
        ...valid,
        items: [{ ...validItem, price: "3,000,000" }],
      }),
    ).resolves.toBeTruthy();
  });

  it("accepts an empty VAT", async () => {
    await expect(
      invoiceDetailsSchema.validate({ ...valid, vat: "" }),
    ).resolves.toBeTruthy();
  });

  it("rejects a VAT above 100", async () => {
    await expect(
      invoiceDetailsSchema.validate({ ...valid, vat: "150" }),
    ).rejects.toThrow("Enter a VAT between 0 and 100");
  });

  it("rejects a negative VAT", async () => {
    await expect(
      invoiceDetailsSchema.validate({ ...valid, vat: "-5" }),
    ).rejects.toThrow("Enter a VAT between 0 and 100");
  });

  it("rejects a negative shipping amount", async () => {
    await expect(
      invoiceDetailsSchema.validate({ ...valid, shipping: "-1" }),
    ).rejects.toThrow("Enter a valid shipping amount");
  });

  it("accepts a comma-formatted shipping amount", async () => {
    await expect(
      invoiceDetailsSchema.validate({ ...valid, shipping: "5,000" }),
    ).resolves.toBeTruthy();
  });
});

describe("bankDetailsSchema", () => {
  const valid = {
    bankNumber: "0123456789",
    bankName: "Lance Bank",
    accountName: "Jane Doe",
    terms: "",
  };

  it("accepts fully valid bank details", async () => {
    await expect(bankDetailsSchema.validate(valid)).resolves.toBeTruthy();
  });

  it("requires a bank number", async () => {
    await expect(
      bankDetailsSchema.validate({ ...valid, bankNumber: "" }),
    ).rejects.toThrow("Bank number is required");
  });

  it("rejects a bank number with letters", async () => {
    await expect(
      bankDetailsSchema.validate({ ...valid, bankNumber: "12ab56789" }),
    ).rejects.toThrow("Enter a valid bank number (digits only)");
  });

  it("rejects a bank number that is too short", async () => {
    await expect(
      bankDetailsSchema.validate({ ...valid, bankNumber: "123" }),
    ).rejects.toThrow("Enter a valid bank number (digits only)");
  });

  it("requires a bank name", async () => {
    await expect(
      bankDetailsSchema.validate({ ...valid, bankName: "" }),
    ).rejects.toThrow("Bank name is required");
  });

  it("requires an account name", async () => {
    await expect(
      bankDetailsSchema.validate({ ...valid, accountName: "" }),
    ).rejects.toThrow("Account name is required");
  });

  it("allows empty terms of payment", async () => {
    await expect(
      bankDetailsSchema.validate({ ...valid, terms: "" }),
    ).resolves.toBeTruthy();
  });
});
