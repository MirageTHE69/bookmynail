import SiteNav from "@/components/site/site-nav";
import Footer from "@/components/site/footer";
import FloatingCTA from "@/components/site/floating-cta";
import Hero from "@/components/home/hero";
import Marquee from "@/components/home/marquee";
import TrustHighlights from "@/components/home/trust-highlights";
import OfferBanner from "@/components/home/offer-banner";
import About from "@/components/home/about";
import Values from "@/components/home/values";
import Compare from "@/components/home/compare";
import Services from "@/components/home/services";
import LashesTeaser from "@/components/home/lashes-teaser";
import Hygiene from "@/components/home/hygiene";
import Gallery from "@/components/home/gallery";
import How from "@/components/home/how";
import Reviews from "@/components/home/reviews";
import FAQ from "@/components/home/faq";
import Social from "@/components/home/social";
import Contact from "@/components/home/contact";
import { addonChips, getAddons, getServices, lashServices, nailServices } from "@/lib/queries";

export default async function HomePage() {
  const [services, addons] = await Promise.all([getServices(), getAddons()]);

  return (
    <div className="relative overflow-x-hidden bg-bone text-ink">
      <SiteNav />
      <Hero />
      <Marquee />
      <TrustHighlights />
      <OfferBanner />
      <About />
      <Values />
      <Compare />
      <Services services={nailServices(services)} addonChips={addonChips(addons)} />
      <LashesTeaser lashes={lashServices(services)} />
      <Hygiene />
      <Gallery />
      <How />
      <Reviews />
      <FAQ />
      <Social />
      <Contact />
      <FloatingCTA />
      <Footer />
    </div>
  );
}
