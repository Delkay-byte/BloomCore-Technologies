import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const mark = await sharp("src/assets/brand/bloomcore-mark.svg")
  .resize(112, 112)
  .png()
  .toBuffer();
const markB64 = mark.toString("base64");

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#080808"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#222222" stroke-width="1"/>
  <image x="80" y="84" width="72" height="72" href="data:image/png;base64,${markB64}"/>
  <text x="172" y="118" font-family="Consolas, monospace" font-size="17" letter-spacing="4" fill="#8A8A8A">BLOOMCORE TECHNOLOGIES</text>
  <text x="172" y="142" font-family="Consolas, monospace" font-size="13" letter-spacing="2.6" fill="#555555">AKATSI · GHANA</text>
  <text x="80" y="330" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="bold" letter-spacing="-2.5" fill="#FFFFFF">Technology that moves</text>
  <text x="80" y="418" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="bold" letter-spacing="-2.5" fill="#FFFFFF">work forward.</text>
  <line x1="80" y1="486" x2="1120" y2="486" stroke="#2A2A2A" stroke-width="1"/>
  <text x="80" y="532" font-family="Consolas, monospace" font-size="16" letter-spacing="2" fill="#8A8A8A">SOFTWARE PRODUCTS · ENGINEERING · DATA</text>
  <text x="1120" y="532" text-anchor="end" font-family="Consolas, monospace" font-size="16" letter-spacing="2" fill="#555555">AKATSI · VOLTA REGION · GHANA</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile("public/og-image.png", png);
console.log("wrote public/og-image.png", png.length, "bytes");
