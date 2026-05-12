// Run once with: node generate-icons.mjs
// Requires: npm install sharp
// Or just use any 192x192 and 512x512 PNG placed in public/icons/

import { createCanvas } from "canvas";
import { writeFileSync } from "fs";

function makeIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  ctx.fillStyle = "#f97316";
  ctx.font = `bold ${size * 0.45}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("FT", size / 2, size / 2);

  return canvas.toBuffer("image/png");
}

writeFileSync("public/icons/icon-192.png", makeIcon(192));
writeFileSync("public/icons/icon-512.png", makeIcon(512));
console.log("Icons generated in public/icons/");
