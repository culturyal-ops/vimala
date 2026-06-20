const IMG = {
  silk: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600",
  fashion: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600",
  accessories:
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600",
  bulk: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600",
};

export const HOMEPAGE_INTRO =
  "Kattappana's destination for silk sarees, bridal wear, and family fashion.";

export const COLLECTION_TAGLINES = {
  silks: "Pure silk for weddings, festivals, and trousseaus.",
  readymade: "Readymade fashion for the whole family.",
  accessories: "Jewellery and finishing touches for every look.",
} as const;

export const CATEGORY_HIGHLIGHTS = [
  {
    title: "Silk Sarees & Bridal",
    href: "/collections/silk-sarees",
    imageUrl: IMG.silk,
    imageAlt:
      "Pure silk bridal saree collection for weddings and Kerala festivals",
  },
  {
    title: "Readymade Fashion",
    href: "/collections/readymade",
    imageUrl: IMG.fashion,
    imageAlt:
      "Readymade fashion for men women and kids at Vimala Silk House",
  },
  {
    title: "Jewellery & Accessories",
    href: "/collections/accessories",
    imageUrl: IMG.accessories,
    imageAlt:
      "Jewellery and fashion accessories to complement silk sarees",
  },
  {
    title: "Bulk Orders",
    href: "/bulk-orders",
    imageUrl: IMG.bulk,
    imageAlt:
      "Bulk readymade clothing orders for Kerala weddings and functions",
  },
] as const;

export const SILK_SUBCATEGORIES = [
  {
    label: "Kerala Silk Sarees",
    href: "/shop/category/silks",
  },
  {
    label: "Bridal Silk Sarees",
    href: "/shop/category/silks",
  },
  {
    label: "Festive & Onam Collection",
    href: "/shop/category/silks",
  },
  {
    label: "Designer Silk Sarees",
    href: "/shop/category/silks",
  },
] as const;

export const ABOUT_BELIEFS = [
  "Quality over quantity, always",
  "Silk that's worth the occasion",
  "Service that treats every customer like a regular, even the first time",
] as const;
