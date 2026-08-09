"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Shared URL-driven filter chips, so admin views are linkable and refreshable. */
export default function Picker({
  param,
  options,
  current,
  label,
}: {
  param: string;
  options: readonly { value: string; label: string }[];
  current: string;
  label?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const set = (value: string) => {
    const next = new URLSearchParams(params.toString());
    next.set(param, value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-[10px] uppercase tracking-[0.16em] text-ink/40">{label}</span>
      )}
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => set(o.value)}
            aria-pressed={o.value === current}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
              o.value === current
                ? "border-ink bg-ink text-bone"
                : "border-ink/20 bg-transparent text-ink/70 hover:border-ink/40"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
