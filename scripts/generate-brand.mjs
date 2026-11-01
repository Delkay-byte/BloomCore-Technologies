import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const ACCENT = "#0B5D4B";
const INK = "#080808";
const PAPER = "#FFFFFF";

/**
 * "Core & Frame": a solid core square emerging from an open frame.
 * The frame is the expanding structure; its missing corner is the opening the
 * core moves through. No letterforms, no arrows, no leaves.
 */
const glyph = (colour) => `
  <path d="M20 10h30v30" fill="none" stroke="${colour}" stroke-width="7" stroke-linecap="square"/>
  <rect x="24" y="32" width="18" height="18" rx="3" fill="${colour}"/>`;

const tile = (bg) => `<rect width="64" height="64" rx="14" fill="${bg}"/>`;

const clean = (svg) => svg.replace(/[ \t]+$/gm, "");

const mark = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="BloomCore Technologies symbol">
  <title>BloomCore Technologies symbol</title>
  <desc>An open geometric frame with a solid core emerging through the opening.</desc>
  ${tile(ACCENT)}
  ${glyph(PAPER)}
</svg>
`;

const markMono = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="BloomCore Technologies symbol">
  <title>BloomCore Technologies symbol, single colour</title>
  ${glyph(INK)}
</svg>
`;

const lockup = (textColour, bg, glyphColour, showTile) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 64" width="420" height="64" role="img" aria-label="BloomCore Technologies logo">
  <title>BloomCore Technologies logo</title>
  <desc>Horizontal lockup: the Core &amp; Frame symbol and the full company wordmark.</desc>
  ${showTile ? tile(bg) : ""}
  ${glyph(glyphColour)}
  <text x="84" y="41" font-family="Inter, Helvetica, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="-0.4" fill="${textColour}">BloomCore Technologies</text>
</svg>
`;

await writeFile("src/assets/brand/bloomcore-mark.svg", clean(mark));
await writeFile("src/assets/brand/bloomcore-mark-mono.svg", clean(markMono));
await writeFile(
  "src/assets/brand/bloomcore-logo-dark.svg",
  clean(lockup(INK, ACCENT, PAPER, true)),
);
await writeFile(
  "src/assets/brand/bloomcore-logo-light.svg",
  clean(lockup(PAPER, ACCENT, PAPER, true)),
);
await writeFile(
  "src/assets/brand/bloomcore-logo-mono-black.svg",
  clean(lockup(INK, ACCENT, INK, false)),
);
await writeFile(
  "src/assets/brand/bloomcore-logo-mono-white.svg",
  clean(lockup(PAPER, ACCENT, PAPER, false)),
);
await writeFile("src/app/icon.svg", clean(mark.replace('width="64" height="64" ', "")));

await sharp("src/app/icon.svg").resize(180, 180).png().toFile("src/app/apple-icon.png");

console.log("brand assets written");
