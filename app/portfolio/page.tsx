import type { Metadata } from "next";
import PortfolioPage from "@/components/portfolio/portfolio-page";
import { getPortfolioItems, portfolioFilters } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Portfolio — BookMyNail",
  description:
    "Recent nail sets from the BookMyNail studio, grouped by category. Send us a screenshot when you book and we'll match it.",
};

export default async function Page() {
  const items = await getPortfolioItems();
  return <PortfolioPage items={items} filters={portfolioFilters(items)} />;
}
