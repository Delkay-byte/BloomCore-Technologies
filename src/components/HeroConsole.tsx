"use client";

import { useState } from "react";
import { ProductFragment } from "@/components/ProductFragments";
import { cn } from "@/lib/utils";

const products = [
  {
    slug: "schemeknit" as const,
    name: "SchemeKnit",
    label: "Lesson planning",
  },
  {
    slug: "maacash" as const,
    name: "MaaCash",
    label: "Business operations",
  },
  {
    slug: "tillproof" as const,
    name: "TillProof",
    label: "Retail oversight",
  },
];

export function HeroConsole() {
  const [active, setActive] = useState(0);
  const product = products[active];

  return (
    <div className="relative w-full max-w-[540px]">
      <div aria-hidden="true" className="mb-2 flex h-7 items-center justify-between overflow-hidden bg-foreground px-3 text-background">
        <span className="text-[11px] font-medium">
          {products[(active + 1) % products.length].name}
        </span>
        <span className="text-[10px] opacity-60">
          {products[(active + 1) % products.length].label}
        </span>
      </div>

      <div className="bg-gold p-1.5 sm:p-2">
        <div aria-label={`${product.name} interface preview`} aria-live="polite">
          <ProductFragment kind={product.slug} />
        </div>
      </div>

      <div aria-hidden="true" className="mt-2 flex h-7 items-center justify-between overflow-hidden bg-surface-2 px-3 text-foreground-subtle">
        <span className="text-[11px] font-medium">
          {products[(active + 2) % products.length].name}
        </span>
        <span className="text-[10px]">
          {products[(active + 2) % products.length].label}
        </span>
      </div>

      <div aria-label="Product interface" className="mt-4 flex flex-wrap gap-1.5">
        {products.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={index === active}
            onClick={() => setActive(index)}
            className={cn(
              "px-3 py-2 text-[0.8125rem] font-medium transition-colors",
              index === active
                ? "bg-foreground text-background"
                : "bg-surface text-foreground-subtle hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[0.8125rem] leading-5 text-foreground-faint">
        Representative interfaces, built from the products&apos; documented capabilities. No
        customer, staff or financial data is shown.
      </p>
    </div>
  );
}
