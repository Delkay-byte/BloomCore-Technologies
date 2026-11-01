import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const ACCENT = "#0B5D4B";
const INK = "#080808";
const PAPER = "#FFFFFF";

const bGlyph = (fill) =>
  `<path fill-rule="evenodd" fill="${fill}" d="M7 14h18a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H7zM13 19h10v10H13zM13 35h10v10H13z"/>`;

const cGlyph = (stroke) =>
  `<path d="M57 17H42a3 3 0 0 0-3 3v22a3 3 0 0 0 3 3h15" fill="none" stroke="${stroke}" stroke-width="6"/>`;

const tile = (bg) => `<rect width="64" height="64" rx="14" fill="${bg}"/>`;

const mark = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="BloomCore Technologies monogram">
  <title>BloomCore Technologies monogram</title>
  <desc>Geometric BC monogram: a block-built B and an open C on a deep green field.</desc>
  ${tile(ACCENT)}
  ${bGlyph(PAPER)}
  ${cGlyph(PAPER)}
</svg>
`;

const markMono = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="BloomCore Technologies monogram">
  <title>BloomCore Technologies monogram, single colour</title>
  ${bGlyph(INK)}
  ${cGlyph(INK)}
</svg>
`;

const lockup = (textColour, bg, glyphColour, showTile) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 64" width="420" height="64" role="img" aria-label="BloomCore Technologies logo">
  <title>BloomCore Technologies logo</title>
  <desc>Horizontal lockup: geometric BC monogram and the full company wordmark.</desc>
  ${showTile ? tile(bg) : ""}
  ${bGlyph(glyphColour)}
  ${cGlyph(glyphColour)}
  <text x="84" y="41" font-family="Inter, Helvetica, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="-0.4" fill="${textColour}">BloomCore Technologies</text>
</svg>
`;

const clean = (svg) => svg.replace(/[ 	]+$/gm, "");

await writeFile("src/assets/brand/bloomcore-mark.svg", clean(mark));
await writeFile("src/assets/brand/bloomcore-mark-mono.svg", clean(markMono));
await writeFile("src/assets/brand/bloomcore-logo-dark.svg", clean(lockup(INK, ACCENT, PAPER, true)));
await writeFile("src/assets/brand/bloomcore-logo-light.svg", clean(lockup(PAPER, ACCENT, PAPER, true)));
await writeFile("src/assets/brand/bloomcore-logo-mono-black.svg", clean(lockup(INK, ACCENT, INK, false)));
await writeFile("src/assets/brand/bloomcore-logo-mono-white.svg", clean(lockup(PAPER, ACCENT, PAPER, false)));
await writeFile("src/app/icon.svg", mark.replace('width="64" height="64" ', ""));

await sharp("src/app/icon.svg").resize(180, 180).png().toFile("src/app/apple-icon.png");

console.log("brand assets written");
