import type { Metadata } from "next";
import { STORE, CONTACT } from "./store-info";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vimalasilks.com";

export const SITE_NAME = STORE.name;

export function pageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
    },
  };
}

export function clothingStoreSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: STORE.name,
    image: `${SITE_URL}/og-image.jpg`,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: STORE.address.line1,
      addressLocality: STORE.address.line1,
      addressRegion: `${STORE.address.district}, ${STORE.address.state}`,
      postalCode: STORE.address.pincode,
      addressCountry: "IN",
    },
    telephone: CONTACT.landlineHref.replace("tel:", ""),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "21:30",
    },
    priceRange: "₹₹-₹₹₹",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(STORE.rating.score),
      reviewCount: String(STORE.rating.count),
    },
  };
}

export function productSchema(product: {
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  imageUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: "INR",
      price: String(product.price),
      availability: "https://schema.org/InStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: ["IN", "US", "GB", "AU", "AE", "CA"],
        },
      },
    },
  };
}
