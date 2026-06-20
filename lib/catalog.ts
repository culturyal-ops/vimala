import { catalogUuid } from "./catalog-ids";

export type DepartmentId =
  | "women"
  | "men"
  | "kids"
  | "silks"
  | "readymade"
  | "accessories"
  | "summer"
  | "stocklot";

export type Product = {
  id: string;
  slug: string;
  name: string;
  department: DepartmentId;
  category: string;
  fabric: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  hoverImageUrl?: string;
  isNew?: boolean;
  discount?: number;
  sizes?: string[];
  scarcityNote?: string;
};

const IMG = {
  silk: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
  fashion: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400",
  men: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
  kids: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400",
  accessories: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400",
};

export const DEPARTMENTS = [
  {
    id: "women" as const,
    label: "Women",
    count: "2,000+",
    description: "Ethnic, contemporary & festive wear",
    imageUrl: IMG.fashion,
    href: "/shop/category/women",
  },
  {
    id: "men" as const,
    label: "Men",
    count: "800+",
    description: "Formal, casual & traditional",
    imageUrl: IMG.men,
    href: "/shop/category/men",
  },
  {
    id: "kids" as const,
    label: "Kids",
    count: "500+",
    description: "Festive & everyday for little ones",
    imageUrl: IMG.kids,
    href: "/shop/category/kids",
  },
  {
    id: "silks" as const,
    label: "Silks & Bridal",
    count: "400+",
    description: "Pure silk sarees & wedding trousseaus",
    imageUrl: IMG.silk,
    href: "/shop/category/silks",
  },
  {
    id: "readymade" as const,
    label: "Readymade",
    count: "1,500+",
    description: "Kurtis, gowns, shirts & more",
    imageUrl: IMG.fashion,
    href: "/shop/category/readymade",
  },
  {
    id: "accessories" as const,
    label: "Accessories",
    count: "300+",
    description: "Jewelry & lifestyle complements",
    imageUrl: IMG.accessories,
    href: "/shop/category/accessories",
  },
  {
    id: "summer" as const,
    label: "Summer Collection",
    count: "600+",
    description: "Light fabrics for Kerala summers",
    imageUrl: IMG.fashion,
    href: "/shop/category/summer",
  },
  {
    id: "stocklot" as const,
    label: "Stocklot Deals",
    count: "200+",
    description: "Value picks & clearance styles",
    imageUrl: IMG.men,
    href: "/shop/category/stocklot",
  },
] as const;

export const SILK_CATEGORIES = [
  { label: "Kanjivaram Silk", count: "120+", imageUrl: IMG.silk },
  { label: "Banarasi", count: "85+", imageUrl: IMG.silk },
  { label: "Kerala Kasavu", count: "60+", imageUrl: IMG.fashion },
  { label: "Bridal", count: "50+", imageUrl: IMG.silk },
  { label: "Embroidered", count: "45+", imageUrl: IMG.fashion },
  { label: "Designer", count: "70+", imageUrl: IMG.silk },
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "a0000000-0000-4000-8000-000000000001",
    slug: "kanjivaram-pure-silk-saree-bridal",
    name: "Kanjivaram Pure Silk Saree",
    department: "silks",
    category: "Bridal",
    fabric: "Kanjivaram",
    price: 22500,
    imageUrl: IMG.silk,
    hoverImageUrl: IMG.fashion,
    isNew: true,
    scarcityNote: "Only 2 pieces left",
  },
  {
    id: "a0000000-0000-4000-8000-000000000002",
    slug: "banarasi-zari-bridal-saree",
    name: "Banarasi Zari Bridal Saree",
    department: "silks",
    category: "Bridal",
    fabric: "Banarasi",
    price: 18900,
    originalPrice: 22000,
    discount: 14,
    imageUrl: IMG.silk,
    isNew: false,
    scarcityNote: "Selling fast this week",
  },
  {
    id: "a0000000-0000-4000-8000-000000000003",
    slug: "kerala-kasavu-set-festive",
    name: "Kerala Kasavu Set",
    department: "silks",
    category: "Festive",
    fabric: "Cotton Silk",
    price: 4800,
    imageUrl: IMG.fashion,
    isNew: true,
    scarcityNote: "Only 3 left in standard sizes",
  },
  {
    id: "a0000000-0000-4000-8000-000000000004",
    slug: "embroidered-georgette-saree-festive",
    name: "Embroidered Georgette Saree",
    department: "women",
    category: "Festive",
    fabric: "Georgette",
    price: 6800,
    imageUrl: IMG.fashion,
    sizes: ["S", "M", "L", "XL"],
    scarcityNote: "Only 3 left in this size",
  },
  {
    id: "a0000000-0000-4000-8000-000000000005",
    slug: "designer-anarkali-gown-party",
    name: "Designer Anarkali Gown",
    department: "readymade",
    category: "Party Wear",
    fabric: "Net & Silk",
    price: 8900,
    imageUrl: IMG.fashion,
    isNew: true,
    sizes: ["S", "M", "L"],
  },
  {
    id: "a0000000-0000-4000-8000-000000000006",
    slug: "printed-cotton-kurti-daily-wear",
    name: "Printed Cotton Kurti",
    department: "readymade",
    category: "Daily Wear",
    fabric: "Cotton",
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    imageUrl: IMG.fashion,
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "a0000000-0000-4000-8000-000000000007",
    slug: "mens-silk-blend-formal-shirt",
    name: "Men's Silk Shirt",
    department: "men",
    category: "Formal",
    fabric: "Silk Blend",
    price: 2499,
    imageUrl: IMG.men,
    sizes: ["38", "40", "42", "44"],
  },
  {
    id: "a0000000-0000-4000-8000-000000000008",
    slug: "mens-cotton-dhoti-set-traditional",
    name: "Men's Dhoti Set",
    department: "men",
    category: "Traditional",
    fabric: "Cotton",
    price: 1899,
    imageUrl: IMG.men,
    isNew: true,
  },
  {
    id: "a0000000-0000-4000-8000-000000000009",
    slug: "kids-festive-lehenga-silk-blend",
    name: "Kids Festive Lehenga",
    department: "kids",
    category: "Festive",
    fabric: "Silk Blend",
    price: 3200,
    imageUrl: IMG.kids,
    sizes: ["4-6Y", "6-8Y", "8-10Y"],
    scarcityNote: "Only 4 left — festive sizes",
  },
  {
    id: "a0000000-0000-4000-8000-000000000010",
    slug: "kids-cotton-casual-set",
    name: "Kids Casual Set",
    department: "kids",
    category: "Daily Wear",
    fabric: "Cotton",
    price: 899,
    imageUrl: IMG.kids,
    sizes: ["2-4Y", "4-6Y", "6-8Y"],
  },
  {
    id: "a0000000-0000-4000-8000-000000000011",
    slug: "temple-jewelry-set-gold-plated",
    name: "Temple Jewelry Set",
    department: "accessories",
    category: "Jewelry",
    fabric: "Gold-plated",
    price: 4500,
    imageUrl: IMG.accessories,
    isNew: true,
  },
  {
    id: "a0000000-0000-4000-8000-000000000012",
    slug: "kundan-earrings-bridal",
    name: "Kundan Earrings",
    department: "accessories",
    category: "Jewelry",
    fabric: "Kundan",
    price: 1800,
    imageUrl: IMG.accessories,
  },
  {
    id: "a0000000-0000-4000-8000-000000000013",
    slug: "linen-summer-saree-kerala",
    name: "Linen Summer Saree",
    department: "summer",
    category: "Summer",
    fabric: "Linen",
    price: 3500,
    imageUrl: IMG.fashion,
    isNew: true,
  },
  {
    id: "a0000000-0000-4000-8000-000000000014",
    slug: "cotton-churidar-set-summer",
    name: "Cotton Churidar Set",
    department: "summer",
    category: "Summer",
    fabric: "Cotton",
    price: 2100,
    imageUrl: IMG.fashion,
    sizes: ["S", "M", "L"],
  },
  {
    id: "a0000000-0000-4000-8000-000000000015",
    slug: "stocklot-mens-cotton-shirt-clearance",
    name: "Stocklot Men's Shirt",
    department: "stocklot",
    category: "Clearance",
    fabric: "Cotton",
    price: 599,
    originalPrice: 1299,
    discount: 54,
    imageUrl: IMG.men,
  },
  {
    id: "a0000000-0000-4000-8000-000000000016",
    slug: "stocklot-kurti-pack-clearance",
    name: "Stocklot Kurti Pack",
    department: "stocklot",
    category: "Clearance",
    fabric: "Mixed",
    price: 999,
    originalPrice: 2499,
    discount: 60,
    imageUrl: IMG.fashion,
  },
  {
    id: "a0000000-0000-4000-8000-000000000017",
    slug: "chanderi-silk-saree-festive",
    name: "Chanderi Silk Saree",
    department: "silks",
    category: "Festive",
    fabric: "Chanderi",
    price: 7500,
    imageUrl: IMG.silk,
    scarcityNote: "Selling fast this week",
  },
  {
    id: "a0000000-0000-4000-8000-000000000018",
    slug: "office-wear-salwar-set-crepe",
    name: "Office Wear Salwar Set",
    department: "women",
    category: "Office Wear",
    fabric: "Crepe",
    price: 3200,
    imageUrl: IMG.fashion,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "a0000000-0000-4000-8000-000000000019",
    slug: "mens-formal-trouser-poly-wool",
    name: "Men's Formal Trouser",
    department: "men",
    category: "Formal",
    fabric: "Poly Wool",
    price: 1699,
    imageUrl: IMG.men,
    sizes: ["30", "32", "34", "36"],
  },
  {
    id: "a0000000-0000-4000-8000-000000000020",
    slug: "bridal-silk-lehenga-pure-silk",
    name: "Bridal Silk Lehenga",
    department: "silks",
    category: "Bridal",
    fabric: "Pure Silk",
    price: 35000,
    imageUrl: IMG.silk,
    isNew: true,
    scarcityNote: "Only 2 pieces left",
  },
  {
    id: "a0000000-0000-4000-8000-000000000021",
    slug: "ethnic-embroidered-handbag",
    name: "Handbag — Ethnic",
    department: "accessories",
    category: "Bags",
    fabric: "Embroidered",
    price: 2200,
    imageUrl: IMG.accessories,
  },
  {
    id: "a0000000-0000-4000-8000-000000000022",
    slug: "rayon-palazzo-set-casual",
    name: "Palazzo Set",
    department: "readymade",
    category: "Casual",
    fabric: "Rayon",
    price: 1899,
    imageUrl: IMG.fashion,
    sizes: ["S", "M", "L"],
  },
  {
    id: "a0000000-0000-4000-8000-000000000023",
    slug: "mysore-silk-saree-premium",
    name: "Mysore Silk Saree",
    department: "silks",
    category: "Premium",
    fabric: "Mysore Silk",
    price: 14200,
    imageUrl: IMG.silk,
  },
  {
    id: "a0000000-0000-4000-8000-000000000024",
    slug: "kids-school-uniform-cotton-set",
    name: "Kids School Uniform Set",
    department: "kids",
    category: "Daily Wear",
    fabric: "Cotton",
    price: 750,
    imageUrl: IMG.kids,
    sizes: ["4-6Y", "6-8Y", "8-10Y", "10-12Y"],
  },
];

export const OCCASIONS = [
  { label: "Wedding", imageUrl: IMG.silk, href: "/shop/category/bridal" },
  { label: "Festive", imageUrl: IMG.fashion, href: "/shop/category/festive" },
  { label: "Daily Wear", imageUrl: IMG.fashion, href: "/shop/category/readymade" },
  { label: "Office", imageUrl: IMG.fashion, href: "/shop/category/women" },
  { label: "Kids", imageUrl: IMG.kids, href: "/shop/category/kids" },
  { label: "Men's", imageUrl: IMG.men, href: "/shop/category/men" },
] as const;

export const FEATURED_COLLECTIONS = DEPARTMENTS.slice(0, 5).map((d) => ({
  label: d.label,
  price: 0,
  imageUrl: d.imageUrl,
  href: d.href,
}));

export function getProductsByDepartment(dept: DepartmentId | "all"): Product[] {
  if (dept === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.department === dept);
}

export function getDepartmentLabel(id: DepartmentId): string {
  return DEPARTMENTS.find((d) => d.id === id)?.label ?? id;
}
