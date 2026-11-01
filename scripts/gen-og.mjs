import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const mark = await sharp("src/assets/brand/bloomcore-mark.svg").resize(120, 120).png().toBuffer();
const markB64 = mark.toString("base64");

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#080808"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#232323" stroke-width="1"/>
  <circle cx="1010" cy="120" r="190" fill="#0B5D4B" opacity="0.22"/>
  <image x="80" y="84" width="76" height="76" href="data:image/png;base64,${markB64}"/>
  <rect x="176" y="96" width="8" height="8" fill="#5AC9A9"/>
  <text x="194" y="105" font-family="Consolas, monospace" font-size="17" letter-spacing="4" fill="#CFCFCF">BLOOMCORE TECHNOLOGIES</text>
  <text x="194" y="132" font-family="Consolas, monospace" font-size="13" letter-spacing="2.6" fill="#7A7A7A">SOFTWARE PRODUCTS · ENGINEERING · DATA</text>
  <text x="80" y="330" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="bold" letter-spacing="-2.5" fill="#FFFFFF">Technology that moves</text>
  <text x="80" y="418" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="bold" letter-spacing="-2.5" fill="#FFFFFF">work forward.</text>
  <rect x="80" y="470" width="64" height="6" fill="#0B5D4B"/>
  <text x="80" y="532" font-family="Consolas, monospace" font-size="16" letter-spacing="2" fill="#8A8A8A">SCHEMEKNIT · BIK PRESTIGE ENTERPRISE · TILLPROOF</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile("public/og-image.png", png);
console.log("wrote public/og-image.png", png.length, "bytes");
