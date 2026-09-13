import * as Yup from "yup";

export const signUpSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .test("passwords-match", "Passwords do not match", function (value) {
      if (!value) {
        return true;
      }
      return value === this.parent.password;
    }),
});

function positiveNumberString(message: string) {
  return Yup.string()
    .required(message)
    .test("is-positive-number", message, (value) => {
      if (!value) {
        return false;
      }
      const parsed = Number(value.replace(/,/g, ""));
      return Number.isFinite(parsed) && parsed > 0;
    });
}

const invoiceItemSchema = Yup.object({
  id: Yup.string().required(),
  description: Yup.string().trim().required("Description is required"),
  quantity: positiveNumberString("Enter a quantity greater than 0"),
  price: positiveNumberString("Enter a price greater than 0"),
});

export const invoiceDetailsSchema = Yup.object({
  clientName: Yup.string().trim().required("Client's name is required"),
  yourName: Yup.string().trim().required("Your name is required"),
  invoiceTitle: Yup.string().trim().required("Invoice title is required"),
  currency: Yup.object({
    code: Yup.string().required(),
    symbol: Yup.string().required(),
  })
    .nullable()
    .required("Select a currency"),
  items: Yup.array().of(invoiceItemSchema).min(1, "Add at least one item"),
  vat: Yup.string().test(
    "is-valid-vat",
    "Enter a VAT between 0 and 100",
    (value) => {
      if (!value) {
        return true;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100;
    },
  ),
  shipping: Yup.string().test(
    "is-valid-shipping",
    "Enter a valid shipping amount",
    (value) => {
      if (!value) {
        return true;
      }
      const parsed = Number(value.replace(/,/g, ""));
      return Number.isFinite(parsed) && parsed >= 0;
    },
  ),
});

export const bankDetailsSchema = Yup.object({
  bankNumber: Yup.string()
    .trim()
    .matches(/^\d{6,20}$/, {
      message: "Enter a valid bank number (digits only)",
      excludeEmptyString: true,
    })
    .required("Bank number is required"),
  bankName: Yup.string().trim().required("Bank name is required"),
  accountName: Yup.string().trim().required("Account name is required"),
  terms: Yup.string(),
});
