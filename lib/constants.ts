import { SILK_CATEGORIES } from "./catalog";

export {
  STORE,
  CONTACT,
  BRAND_ECOSYSTEM,
  STORE_HIGHLIGHTS,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
  WHATSAPP_DISPLAY,
} from "./store-info";

export {
  DEPARTMENTS,
  SILK_CATEGORIES,
  PRODUCTS,
  OCCASIONS,
  FEATURED_COLLECTIONS,
  getProductsByDepartment,
  getDepartmentLabel,
  type DepartmentId,
  type Product,
} from "./catalog";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Silk Sarees", href: "/collections/silk-sarees" },
  { label: "About", href: "/about" },
  { label: "Shipping", href: "/shipping" },
  { label: "Contact", href: "/contact" },
] as const;

export const CATEGORIES = SILK_CATEGORIES;

export const HERO_ARCH_IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
] as const;

export const TRUST_FEATURES = [
  {
    title: "Multi-Brand Fashion",
    description: "Women, men, kids — silks to everyday wear under one roof",
  },
  {
    title: "Bridal Specialists",
    description: "Pure silk sarees and wedding trousseaus",
  },
  {
    title: "Ample Parking",
    description: "Comfortable family shopping in Kattappana",
  },
  {
    title: "WhatsApp Orders",
    description: "Enquire anytime — we're open 7 days a week",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Anjali Menon",
    city: "Kochi",
    text: "Bought my entire wedding trousseau here — silks, jewelry, and readymade sets. The store is massive and the staff really knows their collections.",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    city: "Kattappana",
    text: "Best place in the high ranges for men's formal and traditional wear. Parking is a huge plus — we shop here for every festival.",
    rating: 5,
  },
  {
    name: "Deepa Krishnan",
    city: "Idukki",
    text: "From kids' festive wear to my mother's Kasavu saree — one stop for the whole family. The boutique layout makes browsing easy.",
    rating: 5,
  },
] as const;

export const CRAFT_STATS = [
  { value: "35+ Years", label: "of Trust" },
  { value: "8 Departments", label: "Under One Roof" },
  { value: "500+ Reviews", label: "4.3★ Rated" },
] as const;

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}
