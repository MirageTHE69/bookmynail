import type { Metadata } from "next";
import PortfolioPage from "@/components/portfolio/portfolio-page";
import { PORTFOLIO_ITEMS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Portfolio — BookMyNail",
  description:
    "Recent nail sets from the BookMyNail studio, grouped by category. Send us a screenshot when you book and we'll match it.",
};

export default function Page() {
  return <PortfolioPage items={PORTFOLIO_ITEMS} />;
}
