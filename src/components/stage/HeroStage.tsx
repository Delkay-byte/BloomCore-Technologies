"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { STAGE_PRODUCTS } from "@/lib/product-stage";
import { drawProductPanel } from "@/components/stage/draw-product-panel";

const ProductCarousel3D = dynamic(() => import("@/components/stage/ProductCarousel3D"), {
  ssr: false,
  loading: () => <StageSkeleton />,
});

function StageSkeleton() {
  return (
    <div className="carousel-skeleton h-full w-full rounded-[8px] bg-white/5" aria-hidden="true">
      <div className="flex h-full flex-col justify-center gap-3 px-8">
        <div className="h-2.5 w-24 rounded bg-white/10" />
        <div className="h-2.5 w-56 rounded bg-white/10" />
        <div className="mt-4 h-28 w-full rounded bg-white/10" />
      </div>
    </div>
  );
}

function ProductPanel2D({ index }: { index: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const paint = () => {
      drawProductPanel(ctx, STAGE_PRODUCTS[index], canvas.width, canvas.height);
    };
    paint();
    document.fonts?.ready.then(paint).catch(() => {});
  }, [index]);

  return (
    <div className="relative flex h-full items-center justify-center px-4">
      <div
        aria-hidden="true"
        className="absolute top-8 left-8 hidden h-[62%] w-[55%] -rotate-6 rounded-[8px] bg-white/8 sm:block"
      />
      <div
        aria-hidden="true"
        className="absolute top-9 right-8 hidden h-[62%] w-[55%] rotate-6 rounded-[8px] bg-white/8 sm:block"
      />
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-[8px] shadow-[0_28px_60px_-28px_rgba(0,0,0,0.65)]">
        <canvas
          ref={ref}
          width={1400}
          height={870}
          className="block h-auto w-full"
          aria-label={`${STAGE_PRODUCTS[index].name} representative interface`}
          role="img"
        />
      </div>
    </div>
  );
}

class StageBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(context);
  } catch {
    return false;
  }
}

export function HeroStage() {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"checking" | "webgl" | "fallback">("checking");
  const [paused, setPaused] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const reduced = useReducedMotion();
  const product = STAGE_PRODUCTS[((index % 3) + 3) % 3];

  useEffect(() => {
    const id = window.setTimeout(() => setMode(supportsWebGL() ? "webgl" : "fallback"), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const update = () => setCompact(query.matches);
    const id = window.setTimeout(update, 0);
    query.addEventListener("change", update);
    return () => {
      window.clearTimeout(id);
      query.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.visibilityState === "hidden");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (reduced || paused || interacted || hidden) return;
    const timer = window.setInterval(() => setIndex((current) => current + 1), 7200);
    return () => window.clearInterval(timer);
  }, [reduced, paused, interacted, hidden]);

  const choose = (next: number) => {
    setInteracted(true);
    setIndex(next);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      choose(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      choose(index + 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      choose(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      choose(2);
    }
  };

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] bg-accent p-4 text-accent-contrast sm:p-6"
      role="region"
      aria-roledescription="carousel"
      aria-label="BloomCore product showcase"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.8125rem] font-semibold text-accent-contrast/75">
          Product stage
        </p>
        <p aria-live="polite" className="text-[0.8125rem] text-accent-contrast/65">
          {product.name} · {product.statusLabel}
        </p>
      </div>

      <div className="relative order-2 mt-3 min-h-[300px] flex-1 sm:min-h-[350px]">
        {mode === "webgl" ? (
          <StageBoundary fallback={<ProductPanel2D index={index} />}>
            <ProductCarousel3D
              index={index}
              onIndexChange={(next) => {
                setInteracted(true);
                setIndex(next);
              }}
              reducedMotion={Boolean(reduced)}
              compact={compact}
            />
          </StageBoundary>
        ) : mode === "fallback" ? (
          <ProductPanel2D index={index} />
        ) : (
          <StageSkeleton />
        )}
        <span className="sr-only">
          Three BloomCore products are shown. Use the previous and next buttons or the product
          buttons to change the product.
        </span>
      </div>

      <div className="order-1 mt-4 flex flex-wrap items-center gap-1.5" aria-label="Choose a product">
        {STAGE_PRODUCTS.map((item, itemIndex) => {
          const selected = item.slug === product.slug;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => choose(itemIndex)}
              aria-pressed={selected}
              className={
                selected
                  ? "min-h-10 rounded-[7px] bg-gold px-3.5 text-[0.8125rem] font-bold text-gold-contrast transition-colors"
                  : "min-h-10 rounded-[7px] border border-accent-contrast/25 px-3.5 text-[0.8125rem] font-medium text-accent-contrast/75 transition-colors hover:border-accent-contrast/60 hover:text-accent-contrast"
              }
            >
              {item.name}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => choose(index - 1)}
            aria-label="Previous product"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[7px] border border-accent-contrast/25 text-accent-contrast transition-colors hover:border-accent-contrast/70 hover:bg-white/5 active:translate-y-px"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
              <path d="M17 7H1m6.5-6L1 7l6.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => choose(index + 1)}
            aria-label="Next product"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[7px] border border-accent-contrast/25 text-accent-contrast transition-colors hover:border-accent-contrast/70 hover:bg-white/5 active:translate-y-px"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
              <path d="M1 7h16m-6.5-6L17 7l-6.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="order-3 mt-4 sm:mt-5">
        <p className="font-display text-[1.7rem] leading-none text-accent-contrast sm:text-[2rem]">
          {product.headline}
        </p>
        <p className="mt-2 max-w-[46ch] text-[0.9375rem] leading-6 text-accent-contrast/75">
          {product.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.875rem]">
          <a
            href={product.route}
            className="font-semibold text-accent-contrast underline decoration-1 underline-offset-4 hover:decoration-2"
            data-analytics="product_cta_click"
            data-product={product.name}
            data-location="hero_stage"
          >
            Product details
          </a>
          {product.appUrl ? (
            <a
              href={product.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-contrast/75 underline decoration-1 underline-offset-4 hover:text-accent-contrast"
              data-analytics="product_outbound_click"
              data-product={product.name}
              data-location="hero_stage"
              data-destination="product_application"
            >
              Open application
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <span className="text-accent-contrast/55">Application not yet public</span>
          )}
        </div>
      </div>

      <div className="order-4 mt-4 flex gap-1" aria-hidden="true">
        {STAGE_PRODUCTS.map((item) => (
          <span
            key={item.slug}
            className={
              item.slug === product.slug
                ? "h-1 flex-1 bg-gold"
                : "h-1 flex-1 bg-accent-contrast/20"
            }
          />
        ))}
      </div>
    </div>
  );
}
