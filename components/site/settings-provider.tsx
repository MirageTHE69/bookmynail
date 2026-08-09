"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettings } from "@/lib/queries";
import { DEFAULT_BOOKING_MESSAGE, FALLBACK_WHATSAPP } from "@/lib/site";

const SettingsContext = createContext<SiteSettings | null>(null);

/**
 * Settings are read from the database in the root layout (a server component)
 * and handed to the client tree here, so client components like the hero and
 * contact CTAs use the live WhatsApp number without each doing its own fetch.
 */
export function SettingsProvider({
  value,
  children,
}: {
  value: SiteSettings;
  children: ReactNode;
}) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SiteSettings {
  const ctx = useContext(SettingsContext);
  if (ctx) return ctx;
  // Only reachable if a component renders outside the provider.
  return {
    whatsapp: FALLBACK_WHATSAPP,
    instagram: "https://instagram.com/bookmynail",
    serviceArea: "Ahmedabad and nearby areas\nTravel included in every price",
    hours: "Every day, 9:00 AM – 9:00 PM\nSame-day slots when available",
    eventRetentionDays: "180",
  };
}

/** Builds a wa.me link from the live number in settings. */
export function useWhatsappUrl(text: string = DEFAULT_BOOKING_MESSAGE): string {
  const { whatsapp } = useSettings();
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
}
