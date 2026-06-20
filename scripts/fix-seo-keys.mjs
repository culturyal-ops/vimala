import fs from "fs";

const path = new URL("../lib/product-seo.ts", import.meta.url);
let s = fs.readFileSync(path, "utf8");
s = s.replace(/^\s+\d+:\s*\{\n(\s+slug:\s*"([^"]+)")/gm, (_m, slugLine, slug) => {
  return `  "${slug}": {\n${slugLine}`;
});
fs.writeFileSync(path, s);
console.log("fixed PRODUCT_SEO keys");
