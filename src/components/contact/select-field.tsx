"use client";

import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  /** Id of the control, targeted by the field's <label htmlFor>. */
  id: string;
  /** Id of the field's <label>, used to name the listbox. */
  labelId: string;
  name: string;
  options: readonly SelectOption[];
  /** Shown, muted, while nothing is chosen. Omit when an option has the value "". */
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  /** Shared visual style of the form's controls. */
  controlClassName: string;
  onValueChange?: (value: string) => void;
}

const noop = () => () => {};

/**
 * A select-only combobox (WAI-ARIA APG pattern) that matches the form's
 * other controls, replacing the browser's native option menu.
 *
 * Before hydration — and without JavaScript — a native <select> with the
 * same look is rendered, so the form always works. Focus stays on the
 * combobox; the highlighted option is conveyed with aria-activedescendant.
 */
export function SelectField(props: SelectFieldProps) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  return hydrated ? <Combobox {...props} /> : <NativeSelect {...props} />;
}

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 8"
      className={cn(
        "pointer-events-none h-2 w-3 shrink-0 transition-transform duration-300 ease-architectural",
        open && "rotate-180",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
    >
      <path d="M1 1.5l5 5 5-5" />
    </svg>
  );
}

function NativeSelect({
  id,
  name,
  options,
  placeholder,
  defaultValue,
  required,
  invalid,
  describedBy,
  controlClassName,
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        data-field={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
        className={cn(controlClassName, "cursor-pointer appearance-none pr-8")}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2">
        <Chevron />
      </span>
    </div>
  );
}

const TYPEAHEAD_RESET_MS = 600;
const MENU_MAX_HEIGHT = 352; // 22rem: all seven project types without scrolling

function Combobox({
  id,
  labelId,
  name,
  options,
  placeholder,
  defaultValue,
  required,
  invalid,
  describedBy,
  controlClassName,
  onValueChange,
}: SelectFieldProps) {
  const listId = useId();
  const comboRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", at: 0 });

  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState<"below" | "above">("below");
  const [maxHeight, setMaxHeight] = useState(MENU_MAX_HEIGHT);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;
  const optionId = (index: number) => `${listId}-option-${index}`;

  function scrollIntoView(index: number) {
    // After render, keep the highlighted option visible inside the menu.
    requestAnimationFrame(() => {
      document.getElementById(optionId(index))?.scrollIntoView({ block: "nearest" });
    });
  }

  function openMenu(index = Math.max(selectedIndex, 0)) {
    // Open where there is room, and never past the viewport.
    const rect = comboRef.current?.getBoundingClientRect();
    if (rect) {
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) * 16 || 72;
      const below = window.innerHeight - rect.bottom - 12;
      const above = rect.top - header - 12;
      const needed = Math.min(MENU_MAX_HEIGHT, options.length * 48 + 2);
      const up = below < needed && above > below;
      setPlacement(up ? "above" : "below");
      setMaxHeight(Math.max(144, Math.min(MENU_MAX_HEIGHT, up ? above : below)));
    }
    setActive(index);
    setOpen(true);
    scrollIntoView(index);
  }

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    setValue(option.value);
    setOpen(false);
    if (option.value !== value) onValueChange?.(option.value);
  }

  function move(index: number) {
    const next = Math.max(0, Math.min(options.length - 1, index));
    setActive(next);
    scrollIntoView(next);
  }

  /** Type-ahead: matches the start of an option; repeating one letter cycles through matches. */
  function findByTyping(key: string): number {
    const now = Date.now();
    const state = typeahead.current;
    state.text = now - state.at > TYPEAHEAD_RESET_MS ? key : state.text + key;
    state.at = now;
    const query = state.text.toLowerCase();
    const singleLetter = [...query].every((c) => c === query[0]);
    const search = singleLetter ? query[0] : query;
    // A single letter looks past the current option; a longer prefix may match it.
    const current = open ? active : selectedIndex;
    const first = singleLetter ? current + 1 : Math.max(current, 0);
    for (let i = 0; i < options.length; i++) {
      const index = (first + i + options.length) % options.length;
      if (options[index].label.toLowerCase().startsWith(search)) return index;
    }
    return -1;
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key, altKey } = event;
    if (!open) {
      if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ") {
        event.preventDefault();
        openMenu(altKey ? Math.max(selectedIndex, 0) : selectedIndex >= 0 ? selectedIndex : 0);
      } else if (key === "Home" || key === "End") {
        event.preventDefault();
        openMenu(key === "Home" ? 0 : options.length - 1);
      } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !altKey) {
        const match = findByTyping(key);
        if (match >= 0) openMenu(match);
      }
      return;
    }

    switch (key) {
      case "ArrowDown":
        event.preventDefault();
        if (altKey) choose(active);
        else move(active + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (altKey) choose(active);
        else move(active - 1);
        break;
      case "Home":
        event.preventDefault();
        move(0);
        break;
      case "End":
        event.preventDefault();
        move(options.length - 1);
        break;
      case "PageDown":
        event.preventDefault();
        move(active + 5);
        break;
      case "PageUp":
        event.preventDefault();
        move(active - 5);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Escape":
        // Close without changing the value; do not let it close outer layers.
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        break;
      case "Tab":
        // APG: Tab commits the highlighted option, then focus moves on.
        choose(active);
        break;
      default:
        if (key.length === 1 && !event.ctrlKey && !event.metaKey && !altKey) {
          const match = findByTyping(key);
          if (match >= 0) move(match);
        }
    }
  }

  return (
    <div className="relative">
      <button
        ref={comboRef}
        id={id}
        type="button"
        role="combobox"
        data-field={name}
        aria-labelledby={labelId}
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-required={required ? true : undefined}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
        className={cn(controlClassName, "flex cursor-pointer items-center justify-between gap-4 text-left")}
      >
        <span className={cn("truncate", !selected && "text-olive-ink")}>
          {selected ? selected.label : placeholder}
        </span>
        <Chevron open={open} />
      </button>
      <input type="hidden" name={name} value={value} />

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-labelledby={labelId}
        tabIndex={-1}
        hidden={!open}
        // Keep focus on the combobox while choosing with a pointer.
        onMouseDown={(event) => event.preventDefault()}
        style={{ maxHeight }}
        className={cn(
          "absolute inset-x-0 z-30 overflow-y-auto overscroll-contain border border-[var(--line-strong)] bg-limestone py-1.5 shadow-[0_22px_48px_-28px_rgb(37_39_34/0.55)]",
          placement === "below" ? "top-[calc(100%+0.375rem)]" : "bottom-[calc(100%+0.375rem)]",
        )}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          return (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={isSelected}
              onClick={() => choose(index)}
              onMouseMove={() => active !== index && setActive(index)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-between gap-4 px-4 py-2.5 text-[1rem] transition-colors duration-150",
                index === active && "bg-limestone-deep",
                isSelected && "font-medium",
              )}
            >
              <span>{option.label}</span>
              {isSelected ? (
                <svg aria-hidden="true" viewBox="0 0 14 10" className="h-2.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M1 5l4 4 8-8" />
                </svg>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
