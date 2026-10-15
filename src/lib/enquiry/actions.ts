"use server";

import { deliverEnquiry } from "./deliver";
import { readEnquiry, validateEnquiry, type EnquiryValues, type FieldErrors } from "./schema";

export interface EnquiryState {
  status: "idle" | "invalid" | "sent" | "unavailable" | "error";
  errors?: FieldErrors;
  /** Echoed back so nothing the visitor typed is lost when delivery does not happen. */
  values?: EnquiryValues;
  /** Increments per submission so the form can tell repeated outcomes apart. */
  attempt: number;
}

export async function submitEnquiry(previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const attempt = previous.attempt + 1;
  const values = readEnquiry(formData);

  // Hidden honeypot field: people never see it, automated scripts tend to fill it.
  if (typeof formData.get("website") === "string" && formData.get("website") !== "") {
    return { status: "error", values, attempt };
  }

  const errors = validateEnquiry(values);
  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors, values, attempt };
  }

  const result = await deliverEnquiry(values);
  if (result.ok) return { status: "sent", attempt };
  if (result.reason === "not-configured") return { status: "unavailable", values, attempt };
  return { status: "error", values, attempt };
}
