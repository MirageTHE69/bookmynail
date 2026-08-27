import type { Metadata } from "next";
import PortfolioPage from "@/components/portfolio/portfolio-page";
import { getPortfolioItems, interleaveByCategory } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Portfolio — BookMyNail",
  description:
    "Recent nail and lash work from the BookMyNail studio, grouped by category. Send us a screenshot when you book and we'll match it.",
};

export default async function Page() {
  // Reads the database, so anything added in /admin/content/portfolio appears
  // here and on the homepage rail. Interleaved for the same reason as the
  // homepage: the "All" view should not bury the smaller lash set at the end.
  const items = interleaveByCategory(await getPortfolioItems());
  return <PortfolioPage items={items} />;
}
