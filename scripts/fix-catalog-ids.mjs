import fs from "fs";

const path = new URL("../lib/catalog.ts", import.meta.url);
let s = fs.readFileSync(path, "utf8");
s = s.replace(/id:\s*\d+,\s*id:\s*"([^"]+)",/g, 'id: "$1",');
fs.writeFileSync(path, s);
console.log("fixed duplicate ids");
