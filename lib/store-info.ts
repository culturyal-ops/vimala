export const STORE = {
  name: "Vimala Silk House",
  tagline: "Kattappana's Premier Fashion Destination",
  address: {
    line1: "Kattappana",
    district: "Idukki",
    state: "Kerala",
    pincode: "685508",
    full: "Kattappana, Idukki - 685508, Kerala, India",
  },
  hours: {
    label: "Open 7 Days a Week",
    open: "08:00 AM",
    close: "09:30 PM",
    note: "Extended hours up to 10:00 PM on select festival days",
  },
  rating: { score: 4.3, count: 500 },
  gstin: "32**********1ZT",
  parking: "Ample dedicated parking for family shopping trips",
  note: "Readymade garments only. Bespoke tailoring not available",
} as const;

export const CONTACT = {
  landline: "+91 4868 272 429",
  landlineHref: "tel:+914868272429",
  mobile: "+91 88480 80291",
  mobileHref: "tel:+918848080291",
  whatsapp: "+91 92170 02598",
  whatsappNumber: "919217002598",
  whatsappUrl: "https://wa.me/919217002598",
  email: "enquiry@vimalasilks.com",
} as const;

export const WHATSAPP_NUMBER = CONTACT.whatsappNumber;
export const WHATSAPP_URL = CONTACT.whatsappUrl;
export const WHATSAPP_DISPLAY = CONTACT.whatsapp;

export const BRAND_ECOSYSTEM = [
  {
    name: "Vimala Textiles",
    description: "The foundation of the Vimala brand in the high ranges",
  },
  {
    name: "Vimala Tourist Home",
    description: "Hospitality trusted by travellers since generations",
  },
  {
    name: "Vimala Auditorium",
    description: "Community events and celebrations under one roof",
  },
  {
    name: "Vimala Lodge",
    description: "A legacy of comfort in Kattappana since 2004",
  },
] as const;

export const STORE_HIGHLIGHTS = [
  {
    title: "Vibrant Boutique Layout",
    description: "Modern shelving and organised departments across floors",
  },
  {
    title: "Ample Parking",
    description: "Dedicated parking in busy Kattappana commercial centre",
  },
  {
    title: "500+ Reviews",
    description: "4.3★ rating for friendly staff and excellent service",
  },
  {
    title: "Bulk Orders Welcome",
    description: "Festivals, weddings, and community programmes",
  },
] as const;
