import type { Metadata } from "next";
import SiteNav from "@/components/site/site-nav";
import Footer from "@/components/site/footer";
import FloatingCTA from "@/components/site/floating-cta";
import ServicesHero from "@/components/services/hero";
import ServicesBody from "@/components/services/services-body";
import { getAddons, getServices } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Services & booking — BookMyNail",
  description:
    "Gel manicure, builder gel, gel extensions and custom nail art at your door in Ahmedabad. See prices and book in one message.",
};

export default async function ServicesPage() {
  const [services, addons] = await Promise.all([getServices(), getAddons()]);

  return (
    <div className="relative overflow-x-hidden bg-bone text-ink">
      <SiteNav />
      <ServicesHero />
      <ServicesBody services={services} addons={addons} />
      <FloatingCTA />
      <Footer />
    </div>
  );
}
