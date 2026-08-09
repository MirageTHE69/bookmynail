"use client";

import type { ReactNode } from "react";

export const INPUT =
  "min-h-[42px] w-full rounded-md border border-ink/20 bg-white px-3 text-sm text-ink";

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
      <span className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-ink/45">
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
          className="h-[42px] w-12 cursor-pointer rounded-md border border-ink/20 bg-white p-1"
          aria-label={`${label} picker`}
        />
        <input type="text" name={name} defaultValue={defaultValue} className={INPUT} />
      </div>
    </Field>
  );
}

export function SubmitRow({ children }: { children?: ReactNode }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-4">
      <button
        type="submit"
        className="cursor-pointer rounded-full border-none bg-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-bone"
      >
        Save
      </button>
      {children}
    </div>
  );
}
