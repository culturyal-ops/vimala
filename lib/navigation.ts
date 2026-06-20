import { DEPARTMENTS, SILK_CATEGORIES, type DepartmentId } from "./catalog";

export const BURGUNDY = "#722F37";

export const QUICK_LINKS = [
  {
    label: "Kanjivaram",
    href: "/shop/category/silks",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200",
  },
  {
    label: "Banarasi",
    href: "/shop/category/silks",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80",
  },
  {
    label: "Bridal",
    href: "/shop/category/bridal",
    imageUrl:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200",
  },
  {
    label: "Kasavu",
    href: "/shop/category/festive",
    imageUrl:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&q=80",
  },
  {
    label: "Readymade",
    href: "/shop/category/readymade",
    imageUrl:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200",
  },
  {
    label: "Men",
    href: "/shop/category/men",
    imageUrl:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200",
  },
  {
    label: "Kids",
    href: "/shop/category/kids",
    imageUrl:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200",
  },
  {
    label: "Jewellery",
    href: "/shop/category/accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200",
  },
] as const;

export type CategorySlug = DepartmentId | "bridal" | "festive" | "all";

export const CATEGORY_SLUGS: CategorySlug[] = [
  "all",
  "silks",
  "bridal",
  "festive",
  "women",
  "men",
  "kids",
  "readymade",
  "accessories",
  "summer",
  "stocklot",
];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  all: "All Products",
  silks: "Silk Sarees",
  bridal: "Bridal Wear",
  festive: "Festive Collection",
  women: "Women",
  men: "Men",
  kids: "Kids",
  readymade: "Readymade",
  accessories: "Accessories",
  summer: "Summer",
  stocklot: "Clearance",
};

export const MEGA_MENU_SHOP = {
  id: "shop" as const,
  label: "Shop",
  href: "/shop",
  columns: [
    {
      title: "Collections",
      links: [
        { label: "Silk Sarees & Bridal", href: "/collections/silk-sarees" },
        { label: "Readymade Fashion", href: "/collections/readymade" },
        { label: "Jewellery & Accessories", href: "/collections/accessories" },
        { label: "Bridal Lookbook", href: "/lookbook/bridal" },
        { label: "Festive Lookbook", href: "/lookbook/festive" },
        { label: "All Products", href: "/shop" },
      ],
    },
    {
      title: "Silk Types",
      links: SILK_CATEGORIES.map((c) => ({
        label: c.label,
        href: "/shop/category/silks",
      })),
    },
    {
      title: "Departments",
      links: DEPARTMENTS.slice(0, 4).map((d) => ({
        label: d.label,
        href: `/shop/category/${d.id}`,
      })),
    },
    {
      title: "More",
      links: [
        ...DEPARTMENTS.slice(4).map((d) => ({
          label: d.label,
          href: `/shop/category/${d.id}`,
        })),
        { label: "Bulk Orders", href: "/bulk-orders" },
      ],
    },
  ],
};

export const MEGA_MENU_SILKS = {
  id: "silks" as const,
  label: "Silk Sarees",
  href: "/collections/silk-sarees",
  columns: [
    {
      title: "Shop by Weave",
      links: SILK_CATEGORIES.map((c) => ({
        label: c.label,
        href: "/shop/category/silks",
      })),
    },
    {
      title: "Occasions",
      links: [
        { label: "Bridal Trousseau", href: "/shop/category/bridal" },
        { label: "Festive & Onam", href: "/shop/category/festive" },
        { label: "Wedding Guest", href: "/shop/category/silks" },
        { label: "Premium Silk", href: "/shop/category/silks" },
      ],
    },
    {
      title: "Departments",
      links: [
        { label: "Women's Ethnic", href: "/shop/category/women" },
        { label: "Accessories", href: "/shop/category/accessories" },
        { label: "Readymade", href: "/shop/category/readymade" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "International Shipping", href: "/shipping" },
        { label: "Bulk Orders", href: "/bulk-orders" },
        { label: "Contact Store", href: "/contact" },
      ],
    },
  ],
};

export const FOOTER_DEEP_LINKS = [
  {
    title: "Silk Sarees",
    links: [
      ...SILK_CATEGORIES.map((c) => ({
        label: c.label,
        href: "/shop/category/silks",
      })),
      { label: "Bridal Collection", href: "/shop/category/bridal" },
      { label: "Festive & Onam", href: "/shop/category/festive" },
    ],
  },
  {
    title: "Women",
    links: [
      { label: "All Women's", href: "/shop/category/women" },
      { label: "Ethnic Wear", href: "/shop/category/women" },
      { label: "Bridal Trousseau", href: "/shop/category/bridal" },
      { label: "Festive Wear", href: "/shop/category/festive" },
    ],
  },
  {
    title: "Men & Kids",
    links: [
      { label: "Men's Fashion", href: "/shop/category/men" },
      { label: "Kids' Wear", href: "/shop/category/kids" },
      { label: "Summer Collection", href: "/shop/category/summer" },
      { label: "Clearance", href: "/shop/category/stocklot" },
    ],
  },
  {
    title: "Readymade",
    links: [
      { label: "All Readymade", href: "/shop/category/readymade" },
      { label: "Women", href: "/shop/category/women" },
      { label: "Men", href: "/shop/category/men" },
      { label: "Kids", href: "/shop/category/kids" },
    ],
  },
  {
    title: "Accessories",
    links: [
      { label: "Jewellery", href: "/shop/category/accessories" },
      { label: "All Accessories", href: "/shop/category/accessories" },
      { label: "Complete the Look", href: "/collections/accessories" },
    ],
  },
  {
    title: "Store",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Bulk Orders", href: "/bulk-orders" },
      { label: "International Shipping", href: "/shipping" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
] as const;

export const HERO_SLIDES = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400",
    title: "Pure Silk for Every Occasion",
    subtitle: "Bridal, festive & heirloom weaves",
    href: "/shop/category/silks",
    cta: "Shop Silks",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1400",
    title: "Readymade for the Whole Family",
    subtitle: "Women, men & kids — under one roof",
    href: "/shop/category/readymade",
    cta: "Explore Fashion",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1400",
    title: "Complete the Look",
    subtitle: "Jewellery & accessories curated in-store",
    href: "/shop/category/accessories",
    cta: "Shop Accessories",
  },
] as const;
