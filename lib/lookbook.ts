export type LookbookScene = {
  imageUrl: string;
  imageAlt: string;
  caption: string;
  productSlugs: string[];
};

export type Lookbook = {
  slug: string;
  title: string;
  subtitle: string;
  heroImageUrl: string;
  scenes: LookbookScene[];
};

export const LOOKBOOKS: Lookbook[] = [
  {
    slug: "bridal",
    title: "Bridal Trousseau",
    subtitle: "Silk, zari, and heirloom weaves for the wedding aisle",
    heroImageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600",
    scenes: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200",
        imageAlt: "Kanjivaram bridal silk saree with temple zari border",
        caption: "Temple zari · Kanjivaram pure silk",
        productSlugs: [
          "kanjivaram-pure-silk-saree-bridal",
          "banarasi-zari-bridal-saree",
        ],
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200",
        imageAlt: "Banarasi brocade bridal saree styled for wedding ceremony",
        caption: "Brocade weave · Wedding ceremony",
        productSlugs: ["banarasi-zari-bridal-saree", "temple-jewelry-set-gold-plated"],
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200",
        imageAlt: "Bridal jewellery and silk saree complete look",
        caption: "Complete the look · Jewellery & silk",
        productSlugs: [
          "kanjivaram-pure-silk-saree-bridal",
          "temple-jewelry-set-gold-plated",
          "kundan-earrings-bridal",
        ],
      },
    ],
  },
  {
    slug: "festive",
    title: "Festive & Onam",
    subtitle: "Kasavu, silk, and celebration-ready ensembles",
    heroImageUrl:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1600",
    scenes: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200",
        imageAlt: "Kerala Kasavu set for Onam and Vishu celebrations",
        caption: "Golden kasavu · Onam morning",
        productSlugs: ["kerala-kasavu-set-festive", "embroidered-georgette-saree-festive"],
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80",
        imageAlt: "Festive silk saree for family gatherings",
        caption: "Pure silk · Family gatherings",
        productSlugs: ["mysore-silk-saree-premium", "kerala-kasavu-set-festive"],
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200",
        imageAlt: "Men's festive readymade for temple and functions",
        caption: "Readymade · Men & kids",
        productSlugs: [
          "mens-cotton-dhoti-set-traditional",
          "kids-festive-lehenga-silk-blend",
        ],
      },
    ],
  },
];

export function getLookbook(slug: string): Lookbook | undefined {
  return LOOKBOOKS.find((l) => l.slug === slug);
}

export function getAllLookbookSlugs(): string[] {
  return LOOKBOOKS.map((l) => l.slug);
}
