import SiteNav from "@/components/site/site-nav";
import Footer from "@/components/site/footer";
import Hero from "@/components/home/hero";
import Marquee from "@/components/home/marquee";
import About from "@/components/home/about";
import Values from "@/components/home/values";
import Compare from "@/components/home/compare";
import Services from "@/components/home/services";
import Gallery from "@/components/home/gallery";
import How from "@/components/home/how";
import Reviews from "@/components/home/reviews";
import Contact from "@/components/home/contact";
import { addonChips, getAddons, getServices } from "@/lib/queries";

export default async function HomePage() {
  const [services, addons] = await Promise.all([getServices(), getAddons()]);

  return (
    <div className="relative overflow-x-hidden bg-bone text-ink">
      <SiteNav />
      <Hero />
      <Marquee />
      <About />
      <Values />
      <Compare />
      <Services services={services} addonChips={addonChips(addons)} />
      <Gallery />
      <How />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
}
