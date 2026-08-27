"use client";

import type { ReactNode } from "react";

export const INPUT =
  "min-h-[40px] w-full rounded-lg border border-ink/15 bg-white px-3 text-[13.5px] text-ink transition-colors placeholder:text-ink/30 hover:border-ink/25 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/15";

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-ink/45">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink/40">{hint}</span>}
    </label>
  );
}

/** Colour input paired with its hex, so the value stays copy-pasteable. */
export function ColorField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          defaultValue={defaultValue}
          onChange={(e) => {
            const text = e.currentTarget.parentElement?.querySelector("input[type=text]");
            if (text instanceof HTMLInputElement) text.value = e.currentTarget.value;
          }}
          className="h-[40px] w-11 shrink-0 cursor-pointer rounded-lg border border-ink/15 bg-white p-1"
          aria-label={`${label} picker`}
        />
        <input type="text" name={name} defaultValue={defaultValue} className={INPUT} />
      </div>
    </Field>
  );
}

/** Groups related fields inside a long form so it reads in blocks. */
export function FieldGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="m-0 border-none p-0">
      <legend className="mb-2.5 p-0 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/35">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

export function SubmitRow({ children }: { children?: ReactNode }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-ink/[0.08] pt-4">
      <button
        type="submit"
        className="inline-flex min-h-[38px] cursor-pointer items-center rounded-lg border-none bg-ink px-5 text-[12px] font-medium text-white transition-colors hover:bg-ink/85"
      >
        Save changes
      </button>
      {children}
    </div>
  );
}
