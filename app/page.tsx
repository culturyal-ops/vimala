import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { clothingStoreSchema } from "@/lib/seo";
import { getCatalogProducts } from "@/lib/catalog-db";
import { EditorialHero } from "@/components/home/EditorialHero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryQuickLinks } from "@/components/home/CategoryQuickLinks";
import { TabbedProductSection } from "@/components/home/TabbedProductSection";
import { CraftStory } from "@/components/home/CraftStory";
import { HorizontalDiscoveryRow } from "@/components/home/HorizontalDiscoveryRow";
import { StoreExperience } from "@/components/home/StoreExperience";
import { RecentlyViewedRow } from "@/components/shop/RecentlyViewedRow";
import { CustomerVideoReel } from "@/components/home/CustomerVideoReel";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";

export const metadata: Metadata = pageMetadata({
  title:
    "Vimala Silk House | Premium Silk Sarees & Bridal Wear, Kattappana, Kerala",
  description:
    "Shop pure silk sarees, bridal collections & readymade fashion from Vimala Silk House, Kattappana. Trusted since generations. Worldwide shipping available.",
  path: "/",
});

export default async function HomePage() {
  const catalog = await getCatalogProducts();

  return (
    <>
      <JsonLd data={clothingStoreSchema()} />
      <EditorialHero />
      <TrustStrip />
      <CategoryQuickLinks />
      <TabbedProductSection catalog={catalog} />
      <CraftStory />
      <HorizontalDiscoveryRow />
      <StoreExperience />
      <RecentlyViewedRow />
      <CustomerVideoReel />
      <NewsletterBanner />
    </>
  );
}
