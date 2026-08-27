import type { Metadata } from "next";
import SiteNav from "@/components/site/site-nav";
import Footer from "@/components/site/footer";
import FloatingCTA from "@/components/site/floating-cta";
import ServicesHero from "@/components/services/hero";
import ServicesBody from "@/components/services/services-body";
import LashMenu from "@/components/services/lash-menu";
import { getAddons, getServices, lashExtras } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Services & booking — BookMyNail",
  description:
    "Nails and lashes at your door in Ahmedabad — gel, builder gel, extensions, custom nail art, and a full lash menu mapped to your eyes. See prices and book in one message.",
};

export default async function ServicesPage() {
  const [services, addons] = await Promise.all([getServices(), getAddons()]);

  return (
    <div className="relative overflow-x-hidden bg-bone text-ink">
      <SiteNav />
      <ServicesHero />
      <ServicesBody
        services={services}
        addons={addons}
        lashMenu={<LashMenu extras={lashExtras(services)} />}
      />
      <FloatingCTA />
      <Footer />
    </div>
  );
}
