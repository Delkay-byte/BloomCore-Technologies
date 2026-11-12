import type { StageProduct } from "@/lib/product-stage";

type Ctx = CanvasRenderingContext2D;

/** Neutral palette. The stage is strictly monochrome; no chromatic accent. */
const C = {
  paper: "#ffffff",
  paper2: "#f5f5f5",
  paper3: "#e9e9e9",
  ink: "#0a0a0a",
  soft: "#4a4a4a",
  faint: "#6e6e6e",
  line: "#dedede",
  field: "#0a0a0a",
  fieldDeep: "#000000",
  fieldMid: "#141414",
  tint: "#ececec",
  mark: "#d4d4d4",
  markSoft: "#ececec",
  onField: "#ffffff",
};

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function text(
  ctx: Ctx,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  weight: number | string = 500,
  family = "Inter",
) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${family}, sans-serif`;
  ctx.fillText(value, x, y);
}

function drawChrome(ctx: Ctx, product: StageProduct, w: number, s: number, dark = false) {
  const bar = 60 * s;
  ctx.fillStyle = dark ? C.fieldDeep : C.field;
  ctx.fillRect(0, 0, w, bar);

  roundRect(ctx, 26 * s, 18 * s, 24 * s, 24 * s, 5 * s);
  ctx.strokeStyle = C.mark;
  ctx.lineWidth = 1.4 * s;
  ctx.stroke();

  text(ctx, product.name, 62 * s, 35 * s, 17 * s, C.onField, 700);
  text(ctx, product.panelMeta, 62 * s, 50 * s, 11.5 * s, "rgba(255,255,255,0.62)", 500);

  const statusBg = product.status === "live" ? C.mark : "rgba(255,255,255,0.1)";
  const statusColor = product.status === "live" ? "#0a0a0a" : C.onField;
  ctx.font = `600 ${12 * s}px Inter, sans-serif`;
  const label = product.statusLabel;
  const pw = ctx.measureText(label).width + 22 * s;
  roundRect(ctx, w - pw - 26 * s, 20 * s, pw, 20 * s, 10 * s);
  ctx.fillStyle = statusBg;
  ctx.fill();
  if (product.status !== "live") {
    ctx.strokeStyle = "rgba(255,255,255,0.26)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  text(ctx, label, w - pw - 15 * s, 34 * s, 11.5 * s, statusColor, 600);

  return bar;
}

function drawSidebar(
  ctx: Ctx,
  nav: string[],
  active: string,
  h: number,
  top: number,
  s: number,
  dark = false,
) {
  const width = 280 * s;
  ctx.fillStyle = dark ? C.fieldMid : C.paper2;
  ctx.fillRect(0, top, width, h - top);
  ctx.fillStyle = dark ? "rgba(255,255,255,0.1)" : C.line;
  ctx.fillRect(width - 1, top, 1, h - top);

  text(ctx, "Workspace", 28 * s, top + 40 * s, 11.5 * s, dark ? "rgba(255,255,255,0.5)" : C.faint, 600);

  let y = top + 54 * s;
  for (const item of nav) {
    const isActive = item === active;
    if (isActive) {
      roundRect(ctx, 14 * s, y, width - 28 * s, 40 * s, 7 * s);
      ctx.fillStyle = dark ? C.mark : C.field;
      ctx.fill();
    }
    text(
      ctx,
      item,
      (isActive ? 28 : 24) * s,
      y + 26 * s,
      14.5 * s,
      isActive ? (dark ? "#0a0a0a" : C.onField) : dark ? "rgba(255,255,255,0.68)" : C.soft,
      isActive ? 700 : 500,
    );
    y += 46 * s;
  }

  const footY = h - 104 * s;
  if (!dark) {
    ctx.fillStyle = C.line;
    ctx.fillRect(22 * s, footY - 18 * s, width - 44 * s, 1);
  }
  text(
    ctx,
    "BloomCore Technologies",
    24 * s,
    footY + 4 * s,
    11 * s,
    dark ? "rgba(255,255,255,0.42)" : C.faint,
    500,
  );
  text(
    ctx,
    "Representative interface",
    24 * s,
    footY + 22 * s,
    11 * s,
    dark ? "rgba(255,255,255,0.42)" : C.faint,
    500,
  );
}

function drawHeading(
  ctx: Ctx,
  left: number,
  y: number,
  title: string,
  meta: string,
  action: string,
  s: number,
  dark = false,
) {
  text(ctx, title, left, y, 30 * s, dark ? C.onField : C.ink, 700);
  text(ctx, meta, left, y + 23 * s, 14 * s, dark ? "rgba(255,255,255,0.6)" : C.faint, 500);

  ctx.font = `700 ${12.5 * s}px Inter, sans-serif`;
  const tw = ctx.measureText(action).width + 32 * s;
  const bh = 38 * s;
  const bx = 1400 * s - 34 * s - tw;
  roundRect(ctx, bx, y - 20 * s, tw, bh, 7 * s);
  ctx.fillStyle = dark ? C.mark : C.field;
  ctx.fill();
  text(ctx, action, bx + 16 * s, y + 4 * s, 12.5 * s, dark ? "#0a0a0a" : C.onField, 700);
}

function drawMetrics(
  ctx: Ctx,
  left: number,
  y: number,
  items: Array<[string, string]>,
  s: number,
  dark = false,
) {
  const gap = 12 * s;
  const width = (1060 * s - gap * (items.length - 1)) / items.length;
  items.forEach(([label, value], index) => {
    const x = left + index * (width + gap);
    roundRect(ctx, x, y, width, 96 * s, 8 * s);
    ctx.fillStyle = dark ? "rgba(255,255,255,0.055)" : C.paper2;
    ctx.fill();
    text(ctx, label, x + 16 * s, y + 28 * s, 11.5 * s, dark ? "rgba(255,255,255,0.52)" : C.faint, 600);
    text(ctx, value, x + 16 * s, y + 64 * s, 22 * s, dark ? C.onField : C.ink, 700);
  });
  return y + 96 * s;
}

function drawRows(
  ctx: Ctx,
  left: number,
  y: number,
  rows: Array<{ title: string; meta: string; tag: string; tagTone?: "mark" | "tint" | "line" }>,
  s: number,
  dark = false,
) {
  const width = 1060 * s;
  y += 18 * s;
  ctx.fillStyle = dark ? "rgba(255,255,255,0.09)" : C.line;
  ctx.fillRect(left, y, width, 1);
  for (const row of rows) {
    y += 20 * s;
    text(ctx, row.title, left, y + 18 * s, 15 * s, dark ? C.onField : C.ink, 600);
    text(ctx, row.meta, left, y + 37 * s, 11.5 * s, dark ? "rgba(255,255,255,0.46)" : C.faint, 500);

    const bg =
      row.tagTone === "mark"
        ? C.mark
        : row.tagTone === "tint"
          ? dark
            ? "rgba(255,255,255,0.16)"
            : C.tint
          : dark
            ? "rgba(255,255,255,0.08)"
            : C.paper3;
    const color =
      row.tagTone === "mark"
        ? "#0a0a0a"
        : dark
          ? "rgba(255,255,255,0.78)"
          : C.soft;
    ctx.font = `600 ${11.5 * s}px Inter, sans-serif`;
    const tw = ctx.measureText(row.tag).width + 20 * s;
    roundRect(ctx, left + width - tw, y + 4 * s, tw, 24 * s, 12 * s);
    ctx.fillStyle = bg;
    ctx.fill();
    text(ctx, row.tag, left + width - tw + 10 * s, y + 20 * s, 11.5 * s, color, 600);

    y += 54 * s;
    ctx.fillStyle = dark ? "rgba(255,255,255,0.08)" : C.line;
    ctx.fillRect(left, y, width, 1);
  }
  return y;
}

function drawSchemeKnit(ctx: Ctx, product: StageProduct, w: number, h: number, s: number) {
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, w, h);
  const top = drawChrome(ctx, product, w, s);
  drawSidebar(
    ctx,
    ["Overview", "Schemes", "Lesson plans", "Exports", "Library"],
    "Lesson plans",
    h,
    top,
    s,
  );

  const left = 314 * s;
  drawHeading(
    ctx,
    left,
    top + 52 * s,
    "Term 1 · Week 3",
    "Basic 7 · Computing · 36 lesson plans from 12 scheme weeks",
    "Generate plan",
    s,
  );
  drawMetrics(
    ctx,
    left,
    top + 92 * s,
    [
      ["Planned", "12 of 36"],
      ["Indicators", "41 mapped"],
      ["Ready", "8 lessons"],
    ],
    s,
  );
  drawRows(
    ctx,
    left,
    top + 216 * s,
    [
      {
        title: "Identify computer output devices",
        meta: "B7.2.1.1 · Week 3 · 40 minutes",
        tag: "Planned",
        tagTone: "tint",
      },
      {
        title: "Compare storage media",
        meta: "B7.2.1.2 · Week 3 · 40 minutes",
        tag: "Draft",
      },
      {
        title: "Explain the data processing cycle",
        meta: "B7.2.2.1 · Week 4 · 40 minutes",
        tag: "Planned",
        tagTone: "tint",
      },
    ],
    s,
  );
}

function drawMaaCash(ctx: Ctx, product: StageProduct, w: number, h: number, s: number) {
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, w, h);
  const top = drawChrome(ctx, product, w, s);
  drawSidebar(
    ctx,
    ["Overview", "Locations", "Staff", "Money & history", "Susu customers"],
    "Overview",
    h,
    top,
    s,
  );

  const left = 314 * s;
  drawHeading(
    ctx,
    left,
    top + 52 * s,
    "Location overview",
    "3 locations · 4 access roles · recorded activity",
    "Add location",
    s,
  );
  drawMetrics(
    ctx,
    left,
    top + 92 * s,
    [
      ["Locations", "3"],
      ["Roles", "4"],
      ["Reconciled", "Today"],
    ],
    s,
  );

  const y = top + 218 * s;
  text(ctx, "Role and scope", left, y, 13 * s, C.ink, 700);
  drawRows(
    ctx,
    left,
    y + 10 * s,
    [
      {
        title: "Administrator · Full configuration",
        meta: "All locations · staff, pricing and records",
        tag: "All",
        tagTone: "mark",
      },
      {
        title: "Manager · Branch scope",
        meta: "Assigned locations · operations and staff",
        tag: "Scoped",
        tagTone: "tint",
      },
      {
        title: "Collector · Assigned customers",
        meta: "Susu routes · collection records",
        tag: "Scoped",
        tagTone: "tint",
      },
    ],
    s,
  );
}

function drawTillProof(ctx: Ctx, product: StageProduct, w: number, h: number, s: number) {
  ctx.fillStyle = C.fieldDeep;
  ctx.fillRect(0, 0, w, h);
  const top = drawChrome(ctx, product, w, s, true);
  drawSidebar(
    ctx,
    ["Shop floor", "Store room", "Transfers", "Price changes", "Audit trail"],
    "Shop floor",
    h,
    top,
    s,
    true,
  );

  const left = 314 * s;
  drawHeading(
    ctx,
    left,
    top + 52 * s,
    "Shop floor stock",
    "Electrical shop · recorded movements · owner oversight",
    "Record transfer",
    s,
    true,
  );
  drawMetrics(
    ctx,
    left,
    top + 92 * s,
    [
      ["Low stock", "4 items"],
      ["Transfers", "2 pending"],
      ["Price changes", "Approved"],
    ],
    s,
    true,
  );
  text(ctx, "Stock by item", left, top + 244 * s, 13 * s, C.onField, 700);
  drawRows(
    ctx,
    left,
    top + 254 * s,
    [
      { title: "Cable · 2.5 mm² · coil", meta: "EL-000001 · shop floor", tag: "24" },
      { title: "Socket · 13 A double", meta: "EL-000142 · shop floor", tag: "6" },
      { title: "Breaker · 32 A", meta: "EL-000208 · store room", tag: "18" },
    ],
    s,
    true,
  );
}

/** Draws a representative product interface for use as a 3D texture or 2D card. */
export function drawProductPanel(
  ctx: Ctx,
  product: StageProduct,
  width: number,
  height: number,
) {
  const s = width / 1400;
  ctx.clearRect(0, 0, width, height);
  ctx.textBaseline = "alphabetic";
  if (product.slug === "schemeknit") drawSchemeKnit(ctx, product, width, height, s);
  else if (product.slug === "maacash") drawMaaCash(ctx, product, width, height, s);
  else drawTillProof(ctx, product, width, height, s);
}

