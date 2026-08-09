import type { Metadata, Viewport } from "next";
import { Archivo, Bodoni_Moda } from "next/font/google";
import CursorRing from "@/components/site/cursor-ring";
import Tracker from "@/components/analytics/tracker";
import { SettingsProvider } from "@/components/site/settings-provider";
import { getSettings } from "@/lib/queries";
import "./globals.css";

// --display / --body in the export's :root.
const display = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  // Next ships no fallback metrics for Bodoni Moda; skipping the override
  // keeps the build clean and leaves our Georgia fallback in place.
  adjustFontFallback: false,
});

const body = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookMyNail — Luxury nails, at your door.",
  description:
    "Certified nail artists arrive at your home in Ahmedabad with sanitised tools and premium gel systems. Gel, builder gel, extensions and custom nail art.",
  openGraph: {
    title: "BookMyNail — Luxury nails, at your door.",
    description: "Luxury Nails. Comfort of Home. At-home nail studio serving Ahmedabad.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1614",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">
        <SettingsProvider value={settings}>
          <CursorRing />
          <Tracker />
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
