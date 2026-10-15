/**
 * Enquiry validation shared by the client (instant feedback) and the server
 * action (the authority). Keep this module free of server-only imports.
 */

export const PROJECT_TYPES = [
  "Private residence",
  "Apartment or interior",
  "Renovation",
  "Hospitality",
  "Cultural or public",
  "Commercial",
  "Something else",
] as const;

export const BUDGETS = [
  "Not yet defined",
  "Up to €250k",
  "€250k – €750k",
  "€750k – €2m",
  "Above €2m",
] as const;

export const LIMITS = {
  name: 120,
  email: 254,
  messageMin: 20,
  message: 4000,
} as const;

export type EnquiryField = "name" | "email" | "projectType" | "budget" | "message";

export interface EnquiryValues {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

export type FieldErrors = Partial<Record<EnquiryField, string>>;

export const FIELD_ORDER: EnquiryField[] = ["name", "email", "projectType", "budget", "message"];

// Deliberately permissive: one "@", no spaces, a dot in the domain.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function readEnquiry(formData: FormData): EnquiryValues {
  return {
    name: text(formData, "name"),
    email: text(formData, "email"),
    projectType: text(formData, "projectType"),
    budget: text(formData, "budget"),
    message: text(formData, "message"),
  };
}

export function validateField(field: EnquiryField, values: EnquiryValues): string | undefined {
  switch (field) {
    case "name":
      if (!values.name) return "Please tell us your name.";
      if (values.name.length > LIMITS.name) return `Please keep your name under ${LIMITS.name} characters.`;
      return undefined;
    case "email":
      if (!values.email) return "Please add an email address so a reply can reach you.";
      if (values.email.length > LIMITS.email || !EMAIL_PATTERN.test(values.email))
        return "This email address looks incomplete. Please check it, e.g. name@example.com.";
      return undefined;
    case "projectType":
      if (!values.projectType) return "Please choose the type of project.";
      if (!(PROJECT_TYPES as readonly string[]).includes(values.projectType))
        return "Please choose one of the listed project types.";
      return undefined;
    case "budget":
      if (values.budget && !(BUDGETS as readonly string[]).includes(values.budget))
        return "Please choose one of the listed budget ranges, or leave it blank.";
      return undefined;
    case "message":
      if (!values.message) return "Please add a short message about the project.";
      if (values.message.length < LIMITS.messageMin)
        return `A little more detail helps — please write at least ${LIMITS.messageMin} characters.`;
      if (values.message.length > LIMITS.message)
        return `Please keep the message under ${LIMITS.message} characters.`;
      return undefined;
  }
}

export function validateEnquiry(values: EnquiryValues): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of FIELD_ORDER) {
    const error = validateField(field, values);
    if (error) errors[field] = error;
  }
  return errors;
}
