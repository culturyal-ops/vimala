import fs from "fs";

const seoPath = new URL("../lib/product-seo.ts", import.meta.url);
const catalogPath = new URL("../lib/catalog.ts", import.meta.url);

const seo = fs.readFileSync(seoPath, "utf8");
const slugOrder = [...seo.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

let catalog = fs.readFileSync(catalogPath, "utf8");
let index = 0;

catalog = catalog.replace(
  /(\{\s*\n\s*)id:\s*\d+,/g,
  (match) => {
    index += 1;
    const slug = slugOrder[index - 1];
    const uuid = `a0000000-0000-4000-8000-${String(index).padStart(12, "0")}`;
    return `${match}id: "${uuid}",\n    slug: "${slug}",`;
  }
);

fs.writeFileSync(catalogPath, catalog);
console.log(`patched ${index} products`);
