"use client";

import Link from "next/link";
import {
  useActionState,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
  type Ref,
} from "react";
import { Arrow } from "@/components/ui/arrow-link";
import { submitEnquiry, type EnquiryState } from "@/lib/enquiry/actions";
import { cn } from "@/lib/cn";
import {
  BUDGETS,
  FIELD_ORDER,
  LIMITS,
  PROJECT_TYPES,
  readEnquiry,
  validateEnquiry,
  validateField,
  type EnquiryField,
  type FieldErrors,
} from "@/lib/enquiry/schema";

const initialState: EnquiryState = { status: "idle", attempt: 0 };

const controlClass =
  "w-full rounded-none border-0 border-b border-[var(--line-strong)] bg-transparent px-0 py-3 text-[1.0625rem] text-charcoal transition-colors duration-300 placeholder:text-olive-ink/70 hover:border-charcoal focus:border-charcoal focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-charcoal";

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function isField(name: string): name is EnquiryField {
  return (FIELD_ORDER as string[]).includes(name);
}

function focusFirstInvalid(form: HTMLFormElement | null, found: FieldErrors) {
  const first = FIELD_ORDER.find((field) => found[field]);
  const element = first ? form?.elements.namedItem(first) : null;
  if (element instanceof HTMLElement) element.focus();
}

/** Narrows a bubbled event target to one of the form's enquiry fields. */
function asField(target: EventTarget): (Control & { name: EnquiryField }) | null {
  const isControl =
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement;
  return isControl && isField(target.name) ? (target as Control & { name: EnquiryField }) : null;
}

export function EnquiryForm() {
  const [state, formAction, isPending] = useActionState(submitEnquiry, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  // Server results replace client-side errors once per submission.
  const [errors, setErrors] = useState<FieldErrors>({});
  const [seenAttempt, setSeenAttempt] = useState(0);
  if (state.attempt !== seenAttempt) {
    setSeenAttempt(state.attempt);
    setErrors(state.errors ?? {});
  }

  // Hide a stale outcome when the visitor navigates away and back.
  const [dismissedAttempt, setDismissedAttempt] = useState(-1);
  const attemptRef = useRef(state.attempt);
  useEffect(() => {
    attemptRef.current = state.attempt;
  }, [state.attempt]);
  useLayoutEffect(() => {
    return () => setDismissedAttempt(attemptRef.current);
  }, []);
  const showStatus = state.status !== "idle" && state.attempt !== dismissedAttempt;

  // Move focus to the outcome (or the first invalid field) after each submission.
  useEffect(() => {
    if (state.attempt === 0) return;
    if (state.status === "invalid") {
      focusFirstInvalid(formRef.current, state.errors ?? {});
    } else {
      statusRef.current?.focus();
    }
  }, [state.attempt, state.status, state.errors]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const found = validateEnquiry(readEnquiry(new FormData(event.currentTarget)));
    if (Object.keys(found).length > 0) {
      event.preventDefault();
      setErrors(found);
      focusFirstInvalid(formRef.current, found);
    }
  }

  function revalidate(field: Control & { name: EnquiryField }) {
    if (!field.form) return;
    const message = validateField(field.name, readEnquiry(new FormData(field.form)));
    setErrors((previous) => ({ ...previous, [field.name]: message }));
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    const field = asField(event.target);
    // Only judge a field once the visitor has written something in it.
    if (field && field.value.trim() !== "") revalidate(field);
  }

  function handleChange(event: ChangeEvent<HTMLFormElement>) {
    const field = asField(event.target);
    if (field && errors[field.name]) revalidate(field);
  }

  // Selects are keyed by attempt below: React's post-action form reset only
  // re-applies defaults reliably on mount, so remounting keeps the chosen options.
  const errorCount = FIELD_ORDER.filter((field) => errors[field]).length;
  const values = state.values;
  const describe = (field: EnquiryField, hint?: boolean) =>
    [hint ? `${formId}-${field}-hint` : null, errors[field] ? `${formId}-${field}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      onChange={handleChange}
      noValidate
      aria-describedby={`${formId}-required`}
      className="grid grid-cols-1 gap-x-[var(--gutter)] gap-y-9 sm:grid-cols-2"
    >
      <p id={`${formId}-required`} className="t-small text-olive-ink sm:col-span-2">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <Field id={`${formId}-name`} label="Name" required error={errors.name} errorId={`${formId}-name-error`}>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={LIMITS.name}
          defaultValue={values?.name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describe("name")}
          className={controlClass}
        />
      </Field>

      <Field id={`${formId}-email`} label="Email" required error={errors.email} errorId={`${formId}-email-error`}>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          maxLength={LIMITS.email}
          defaultValue={values?.email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describe("email")}
          className={controlClass}
        />
      </Field>

      <Field
        id={`${formId}-projectType`}
        label="Project type"
        required
        error={errors.projectType}
        errorId={`${formId}-projectType-error`}
      >
        <SelectFrame>
          <select
            key={`projectType-${state.attempt}`}
            id={`${formId}-projectType`}
            name="projectType"
            required
            defaultValue={values?.projectType ?? ""}
            aria-invalid={errors.projectType ? true : undefined}
            aria-describedby={describe("projectType")}
            className={cn(controlClass, "cursor-pointer appearance-none pr-8")}
          >
            <option value="" disabled>
              Choose one
            </option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </SelectFrame>
      </Field>

      <Field
        id={`${formId}-budget`}
        label="Indicative budget"
        optional
        error={errors.budget}
        errorId={`${formId}-budget-error`}
      >
        <SelectFrame>
          <select
            key={`budget-${state.attempt}`}
            id={`${formId}-budget`}
            name="budget"
            defaultValue={values?.budget ?? ""}
            aria-invalid={errors.budget ? true : undefined}
            aria-describedby={describe("budget")}
            className={cn(controlClass, "cursor-pointer appearance-none pr-8")}
          >
            <option value="">Prefer not to say</option>
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </SelectFrame>
      </Field>

      <Field
        id={`${formId}-message`}
        label="About the project"
        required
        error={errors.message}
        errorId={`${formId}-message-error`}
        hint="The site, timeline and what you hope the space will feel like."
        hintId={`${formId}-message-hint`}
        className="sm:col-span-2"
      >
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={5}
          minLength={LIMITS.messageMin}
          maxLength={LIMITS.message}
          defaultValue={values?.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describe("message", true)}
          className={cn(
            controlClass,
            "mt-3 min-h-40 resize-y border px-4 leading-relaxed aria-[invalid=true]:border-charcoal",
          )}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-website`}>Leave this field empty</label>
        <input id={`${formId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-small max-w-sm text-olive-ink">
          Your details are used only to reply to this enquiry. See the{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:no-underline">
            privacy notice
          </Link>
          .
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="group inline-flex min-h-13 shrink-0 items-center justify-center gap-5 bg-charcoal px-8 text-[0.9375rem] font-medium text-limestone transition-colors duration-300 hover:bg-olive-ink disabled:cursor-progress disabled:bg-olive-ink"
        >
          {isPending ? "Sending…" : "Send enquiry"}
          <Arrow />
        </button>
      </div>

      <div className="sm:col-span-2">
        {showStatus ? (
          <StatusMessage ref={statusRef} status={state.status} errorCount={errorCount} />
        ) : null}
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
  error?: string;
  errorId: string;
  hint?: string;
  hintId?: string;
  className?: string;
}

function Field({ id, label, children, required, optional, error, errorId, hint, hintId, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="t-label flex items-baseline gap-2 text-olive-ink">
        {label}
        {required ? <span aria-hidden="true">*</span> : null}
        {optional ? <span className="font-medium tracking-normal normal-case">(optional)</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="t-small mt-1 text-olive-ink">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} className="t-small mt-2 flex items-start gap-2 font-medium text-charcoal">
          <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-current" />
          <span>
            <span className="sr-only">Error: </span>
            {error}
          </span>
        </p>
      ) : null}
    </div>
  );
}

function SelectFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        className="pointer-events-none absolute top-1/2 right-1 h-2 w-3 -translate-y-1/2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      >
        <path d="M1 1.5l5 5 5-5" />
      </svg>
    </div>
  );
}

const STATUS_COPY: Record<
  Exclude<EnquiryState["status"], "idle">,
  { title: string; body: string }
> = {
  sent: {
    title: "Thank you — your enquiry has been sent.",
    body: "It was delivered successfully. Thank you for getting in touch.",
  },
  unavailable: {
    title: "Your enquiry has not been sent.",
    body: "Online enquiries are not connected on this concept site yet, so nothing was delivered. Your message is still in the form.",
  },
  error: {
    title: "Your enquiry could not be sent.",
    body: "Something went wrong while delivering it. Your message is still in the form — please try again in a moment.",
  },
  invalid: {
    title: "Please check the form.",
    body: "Some fields need attention before the enquiry can be sent.",
  },
};

function StatusMessage({
  ref,
  status,
  errorCount,
}: {
  ref: Ref<HTMLDivElement>;
  status: EnquiryState["status"];
  errorCount: number;
}) {
  if (status === "idle") return null;
  const copy = STATUS_COPY[status];
  const success = status === "sent";
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={success ? "status" : "alert"}
      className={cn(
        "border-l-2 py-1 pl-5 focus:outline-none",
        success ? "border-olive" : "border-charcoal",
      )}
    >
      <p className="font-semibold">{copy.title}</p>
      <p className="t-small mt-1 text-olive-ink">
        {status === "invalid" && errorCount > 0
          ? `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} attention before the enquiry can be sent.`
          : copy.body}
      </p>
    </div>
  );
}
