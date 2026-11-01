import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const logo = await readFile("src/assets/brand/bloomcore-logo-white.png");
const logoB64 = logo.toString("base64");

// Logo keeps its intrinsic ratio: the source is 1516 x 424 (3.575:1).
const logoHeight = 62;
const logoWidth = Math.round((logoHeight * 1516) / 424);

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#080808"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#232323" stroke-width="1"/>
  <circle cx="1010" cy="120" r="190" fill="#0B5D4B" opacity="0.22"/>
  <image x="80" y="80" width="${logoWidth}" height="${logoHeight}" href="data:image/png;base64,${logoB64}"/>
  <text x="80" y="330" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="bold" letter-spacing="-2.5" fill="#FFFFFF">Technology that moves</text>
  <text x="80" y="418" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="bold" letter-spacing="-2.5" fill="#FFFFFF">work forward.</text>
  <rect x="80" y="470" width="64" height="6" fill="#0B5D4B"/>
  <text x="80" y="532" font-family="Consolas, monospace" font-size="16" letter-spacing="2" fill="#8A8A8A">SCHEMEKNIT · BIK PRESTIGE ENTERPRISE · TILLPROOF</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile("public/og-image.png", png);
console.log("wrote public/og-image.png", png.length, "bytes");
