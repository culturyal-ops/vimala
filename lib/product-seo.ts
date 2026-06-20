import type { Product } from "./catalog";
import { PRODUCTS } from "./catalog";

export type ProductSeo = {
  slug: string;
  sku: string;
  description: string;
  imageAlt: string;
};

export const PRODUCT_SEO: Record<string, ProductSeo> = {
  "kanjivaram-pure-silk-saree-bridal": {
    slug: "kanjivaram-pure-silk-saree-bridal",
    sku: "VSH-SLK-001",
    description:
      "Handpicked Kanjivaram pure silk saree for weddings and bridal trousseaus, chosen for its rich drape and temple-worthy zari work.",
    imageAlt:
      "Kanjivaram pure silk bridal saree in traditional weave with gold zari border",
  },
  "banarasi-zari-bridal-saree": {
    slug: "banarasi-zari-bridal-saree",
    sku: "VSH-SLK-002",
    description:
      "Banarasi zari weave bridal saree with intricate brocade. A festive and wedding favourite from our Kattappana silk collection.",
    imageAlt:
      "Banarasi zari bridal silk saree with brocade pattern for wedding wear",
  },
  "kerala-kasavu-set-festive": {
    slug: "kerala-kasavu-set-festive",
    sku: "VSH-SLK-003",
    description:
      "Classic Kerala Kasavu set in cotton silk. Ideal for Onam, Vishu, and festive gatherings across Kerala and beyond.",
    imageAlt:
      "Kerala Kasavu cotton silk saree set with golden kasavu border for Onam",
  },
  "embroidered-georgette-saree-festive": {
    slug: "embroidered-georgette-saree-festive",
    sku: "VSH-WOM-004",
    description:
      "Lightweight embroidered georgette saree for festive evenings. Easy to drape, photograph beautifully, and ship worldwide.",
    imageAlt:
      "Embroidered georgette festive saree in flowing drape for evening wear",
  },
  "designer-anarkali-gown-party": {
    slug: "designer-anarkali-gown-party",
    sku: "VSH-RDY-005",
    description:
      "Designer Anarkali gown in net and silk. Readymade party wear with the finish families expect from Vimala Silk House.",
    imageAlt:
      "Designer Anarkali party wear gown in net and silk readymade outfit",
  },
  "printed-cotton-kurti-daily-wear": {
    slug: "printed-cotton-kurti-daily-wear",
    sku: "VSH-RDY-006",
    description:
      "Everyday printed cotton kurti. Dependable readymade daily wear from our Kattappana family fashion floor.",
    imageAlt:
      "Printed cotton kurti in everyday readymade daily wear style",
  },
  "mens-silk-blend-formal-shirt": {
    slug: "mens-silk-blend-formal-shirt",
    sku: "VSH-MEN-007",
    description:
      "Men's silk blend formal shirt. Smart readymade menswear for functions, office, and festive occasions.",
    imageAlt:
      "Men's silk blend formal shirt in readymade menswear",
  },
  "mens-cotton-dhoti-set-traditional": {
    slug: "mens-cotton-dhoti-set-traditional",
    sku: "VSH-MEN-008",
    description:
      "Traditional men's cotton dhoti set. A staple for temple visits, weddings, and Kerala festive dressing.",
    imageAlt:
      "Men's traditional cotton dhoti set for Kerala festive and wedding wear",
  },
  "kids-festive-lehenga-silk-blend": {
    slug: "kids-festive-lehenga-silk-blend",
    sku: "VSH-KID-009",
    description:
      "Kids festive lehenga in silk blend. Readymade children's occasion wear for weddings and family celebrations.",
    imageAlt:
      "Kids festive lehenga in silk blend for wedding and celebration wear",
  },
  "kids-cotton-casual-set": {
    slug: "kids-cotton-casual-set",
    sku: "VSH-KID-010",
    description:
      "Comfortable kids cotton casual set. Everyday readymade children's wear from our family fashion department.",
    imageAlt: "Kids cotton casual readymade outfit set for daily wear",
  },
  "temple-jewelry-set-gold-plated": {
    slug: "temple-jewelry-set-gold-plated",
    sku: "VSH-ACC-011",
    description:
      "Temple jewelry set in gold-plated finish. Curated to complete bridal and festive silk saree looks.",
    imageAlt:
      "Temple jewelry set gold-plated to match Kerala bridal silk saree",
  },
  "kundan-earrings-bridal": {
    slug: "kundan-earrings-bridal",
    sku: "VSH-ACC-012",
    description:
      "Kundan earrings chosen to complement our silk and readymade lines. Finishing touches for wedding and festive outfits.",
    imageAlt: "Kundan bridal earrings to pair with silk saree outfits",
  },
  "linen-summer-saree-kerala": {
    slug: "linen-summer-saree-kerala",
    sku: "VSH-SUM-013",
    description:
      "Breathable linen summer saree. Light Kerala-friendly fabric for warm-weather festive and casual ethnic wear.",
    imageAlt:
      "Linen summer saree in light breathable fabric for Kerala heat",
  },
  "cotton-churidar-set-summer": {
    slug: "cotton-churidar-set-summer",
    sku: "VSH-SUM-014",
    description:
      "Cotton churidar set for summer. Readymade comfort wear in standard sizes, ideal for daily ethnic dressing.",
    imageAlt:
      "Cotton churidar readymade set for summer daily ethnic wear",
  },
  "stocklot-mens-cotton-shirt-clearance": {
    slug: "stocklot-mens-cotton-shirt-clearance",
    sku: "VSH-STK-015",
    description:
      "Value stocklot men's cotton shirt. Clearance readymade menswear at an accessible price point.",
    imageAlt: "Stocklot men's cotton shirt clearance readymade garment",
  },
  "stocklot-kurti-pack-clearance": {
    slug: "stocklot-kurti-pack-clearance",
    sku: "VSH-STK-016",
    description:
      "Stocklot kurti pack. Bundled readymade value picks from our clearance floor in Kattappana.",
    imageAlt: "Stocklot kurti pack bundle clearance readymade fashion",
  },
  "chanderi-silk-saree-festive": {
    slug: "chanderi-silk-saree-festive",
    sku: "VSH-SLK-017",
    description:
      "Chanderi silk saree with a refined festive drape. Handpicked for Onam, weddings, and special occasions.",
    imageAlt:
      "Chanderi silk festive saree with lightweight sheer drape",
  },
  "office-wear-salwar-set-crepe": {
    slug: "office-wear-salwar-set-crepe",
    sku: "VSH-WOM-018",
    description:
      "Office wear salwar set in crepe. Polished readymade ethnic workwear in standard sizes.",
    imageAlt:
      "Office wear crepe salwar kameez readymade set for work",
  },
  "mens-formal-trouser-poly-wool": {
    slug: "mens-formal-trouser-poly-wool",
    sku: "VSH-MEN-019",
    description:
      "Men's formal trouser in poly wool blend. Readymade menswear for office and function dressing.",
    imageAlt: "Men's formal poly wool trousers readymade menswear",
  },
  "bridal-silk-lehenga-pure-silk": {
    slug: "bridal-silk-lehenga-pure-silk",
    sku: "VSH-SLK-020",
    description:
      "Pure silk bridal lehenga. A statement wedding piece from our bridal silk collection, shipped with protective packaging.",
    imageAlt:
      "Pure silk bridal lehenga in rich colour for Kerala wedding wear",
  },
  "ethnic-embroidered-handbag": {
    slug: "ethnic-embroidered-handbag",
    sku: "VSH-ACC-021",
    description:
      "Ethnic embroidered handbag. Lifestyle accessory curated to match sarees and festive readymade outfits.",
    imageAlt:
      "Ethnic embroidered handbag accessory for saree and festive outfits",
  },
  "rayon-palazzo-set-casual": {
    slug: "rayon-palazzo-set-casual",
    sku: "VSH-RDY-022",
    description:
      "Rayon palazzo readymade set. Relaxed casual ethnic wear for everyday family fashion shopping.",
    imageAlt: "Rayon palazzo readymade casual ethnic outfit set",
  },
  "mysore-silk-saree-premium": {
    slug: "mysore-silk-saree-premium",
    sku: "VSH-SLK-023",
    description:
      "Premium Mysore silk saree. Soft lustre and classic drape from our curated Kerala silk sarees online collection.",
    imageAlt:
      "Mysore silk premium saree with soft lustre for festive occasions",
  },
  "kids-school-uniform-cotton-set": {
    slug: "kids-school-uniform-cotton-set",
    sku: "VSH-KID-024",
    description:
      "Kids cotton school uniform set. Durable readymade children's daily wear in standard age sizes.",
    imageAlt:
      "Kids cotton school uniform readymade set in standard sizes",
  },
};

export type EnrichedProduct = Product & ProductSeo;

export function enrichProduct(product: Product): EnrichedProduct {
  const seo = PRODUCT_SEO[product.slug];
  if (!seo) {
    throw new Error(`Missing SEO data for product slug ${product.slug}`);
  }
  return { ...product, ...seo };
}

export function getEnrichedProducts(): EnrichedProduct[] {
  return PRODUCTS.map(enrichProduct);
}

export function getProductBySlug(slug: string): EnrichedProduct | undefined {
  return getEnrichedProducts().find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return getEnrichedProducts().map((p) => p.slug);
}

export function getRelatedProducts(
  product: EnrichedProduct,
  catalog?: EnrichedProduct[],
  limit = 3
): EnrichedProduct[] {
  const all = catalog ?? getEnrichedProducts();
  return all
    .filter(
      (p) => p.id !== product.id && p.department === product.department
    )
    .slice(0, limit);
}

export function getCompleteTheLook(
  product: EnrichedProduct,
  catalog?: EnrichedProduct[],
  limit = 4
): EnrichedProduct[] {
  const all = (catalog ?? getEnrichedProducts()).filter((p) => p.id !== product.id);

  if (product.department === "accessories") {
    return all
      .filter(
        (p) =>
          p.department === "silks" ||
          p.department === "women" ||
          p.category.toLowerCase() === "bridal"
      )
      .slice(0, limit);
  }

  const accessories = all.filter((p) => p.department === "accessories");
  if (accessories.length >= limit) return accessories.slice(0, limit);

  const extras = all
    .filter(
      (p) =>
        p.department !== product.department &&
        p.department !== "accessories" &&
        (p.category === product.category || p.fabric === product.fabric)
    )
    .slice(0, limit - accessories.length);

  return [...accessories, ...extras].slice(0, limit);
}

export function getProductGalleryImages(product: EnrichedProduct): string[] {
  const images = [product.imageUrl];
  if (product.hoverImageUrl && product.hoverImageUrl !== product.imageUrl) {
    images.push(product.hoverImageUrl);
  }
  return images;
}

export function toBagProduct(product: EnrichedProduct) {
  return {
    productId: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    sizes: product.sizes,
  };
}
