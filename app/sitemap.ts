import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getAllProductSlugs } from "@/lib/product-seo";
import { CATEGORY_SLUGS } from "@/lib/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/shipping",
    "/checkout",
    "/collections/silk-sarees",
    "/collections/readymade",
    "/collections/accessories",
    "/lookbook",
    "/lookbook/bridal",
    "/lookbook/festive",
  ];

  const categoryPages = CATEGORY_SLUGS.filter((s) => s !== "all").map(
    (slug) => `/shop/category/${slug}`
  );

  const productPages = getAllProductSlugs().map((slug) => `/shop/${slug}`);

  return [...staticPages, ...categoryPages, ...productPages].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/shop/") ? 0.8 : 0.7,
  }));
}
