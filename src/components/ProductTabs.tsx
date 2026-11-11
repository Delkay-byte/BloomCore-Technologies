"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductFragment } from "@/components/ProductFragments";
import { PRODUCTS, PRODUCT_LINKS, ROUTES } from "@/lib/brand";
import { cn } from "@/lib/utils";

const detail = {
  schemeknit: {
    problem:
      "Teachers hold a scheme of learning and separately produce weekly plans. The repetition consumes planning time, and the plan can drift from the indicators the scheme sets out.",
    capabilities: [
      "Upload a scheme and review the extracted weeks, strands and indicators",
      "Generate a lesson plan around each selected indicator",
      "Edit any lesson, with saved changes kept",
      "Export plans for printing, offline use or submission",
    ],
    href: ROUTES.productsSchemeKnit,
    app: PRODUCT_LINKS.schemeknit,
    appLabel: "Visit SchemeKnit",
  },
  maacash: {
    problem:
      "Organisations running several locations keep staff, collection and money records separately. Oversight depends on someone compiling figures by hand.",
    capabilities: [
      "Configure locations as separate operational units",
      "Manage staff and scope access by role",
      "Record mobile-money activity against the person responsible",
      "Track susu collection rounds and customer balances",
    ],
    href: ROUTES.productsMaacash,
    app: PRODUCT_LINKS.maacash,
    appLabel: "Visit MaaCash",
  },
  tillproof: {
    problem:
      "Electrical retailers carry high-value, individually identifiable stock. When records live in a notebook, an owner cannot see what left the shelf, at what price, or who handled the cash.",
    capabilities: [
      "Intended: stock traceability across shops",
      "Intended: controlled price changes with a record of who made them",
      "Intended: cash handling recorded against the person responsible",
      "Intended: an audit trail an owner can investigate",
    ],
    href: ROUTES.productsTillProof,
    app: null,
    appLabel: null,
  },
} as const;

export function ProductTabs() {
  const [active, setActive] = useState(0);
  const product = PRODUCTS[active];
  const info = detail[product.slug];

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div aria-label="Products" className="flex flex-col gap-1.5 lg:col-span-4">
        {PRODUCTS.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(index)}
              className={cn(
                "group flex items-center justify-between gap-4 p-5 text-left transition-colors sm:p-6",
                selected
                  ? "bg-accent text-accent-contrast"
                  : "bg-background text-foreground hover:bg-surface-2",
              )}
            >
              <span>
                <span className="block text-[1.45rem] leading-tight font-semibold tracking-tight sm:text-[1.7rem]">
                  {item.name}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-[0.875rem]",
                    selected ? "text-accent-contrast/70" : "text-foreground-faint",
                  )}
                >
                  {item.category}
                </span>
              </span>
              <span
                className={cn(
                  "shrink-0 px-2 py-1 text-[0.75rem] font-medium",
                  selected
                    ? "bg-gold text-[#15170f]"
                    : item.status === "live"
                      ? "bg-gold-soft text-foreground"
                      : "bg-surface-2 text-foreground-subtle",
                )}
              >
                {item.statusLabel}
              </span>
            </button>
          );
        })}
      </div>

      <div aria-label={product.name} className="lg:col-span-8">
        <div className="grid gap-8 bg-surface p-5 sm:p-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="lead text-foreground">{info.problem}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {info.capabilities.map((capability) => (
                <li key={capability} className="flex items-start gap-3 text-[1rem] leading-6">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-gold" />
                  <span className="text-foreground-subtle">{capability}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={info.href}
                className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-[0.9375rem] font-medium text-background transition-colors hover:bg-accent"
              >
                Read the product page
              </Link>
              {info.app && (
                <a
                  href={info.app}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics="product_outbound_click"
                  data-product={product.name}
                  data-location="homepage_product_tabs"
                  data-destination="product_application"
                  className="text-[0.9375rem] font-medium text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-accent"
                >
                  {info.appLabel}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
          <div className="lg:col-span-7">
            <ProductFragment kind={product.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
