"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import logo from "@/assets/brand/bloomcore-logo-white.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BRAND, NAVIGATION, PRODUCTS, ROUTES } from "@/lib/brand";
import { cn } from "@/lib/utils";

const PRODUCT_PATHS = Object.fromEntries(
  PRODUCTS.map((product) => [`/products/${product.slug}`, product]),
);

function BrandLockup() {
  return (
    <Link
      href="/"
      aria-label={`${BRAND.name} — home`}
      className="inline-flex shrink-0 items-center rounded-[6px] bg-[#0a0a0a] px-2.5 py-1.5"
    >
      <Image
        src={logo}
        alt={BRAND.name}
        priority
        loading="eager"
        sizes="150px"
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  );
}

function DesktopNav() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<{ label: string; path: string } | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 130);
  };

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => () => cancelClose(), []);

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-6 xl:gap-8">
        {NAVIGATION.filter((item) => item.href !== ROUTES.home).map((item) => {
          const isActive = pathname.startsWith(item.href);

          if (item.children) {
            const isOpen = openMenu?.label === item.label && openMenu.path === pathname;
            return (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenMenu({ label: item.label, path: pathname });
                }}
                onMouseLeave={scheduleClose}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setOpenMenu(null);
                  }
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={(event) => {
                    const opened = { label: item.label, path: pathname };
                    setOpenMenu(event.detail === 0 && isOpen ? null : opened);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 py-2 text-[0.9375rem] font-semibold transition-colors",
                    isActive || isOpen
                      ? "text-foreground"
                      : "text-foreground-subtle hover:text-foreground",
                  )}
                >
                  {item.label}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                    className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {isOpen && (
                  <div className="absolute top-full left-0 z-50 w-[19rem] pt-3">
                    <ul className="overflow-hidden rounded-[var(--radius)] border border-line bg-surface p-2 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.28)]">
                      <li>
                        <Link
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="flex items-center justify-between rounded-[6px] px-3 py-2.5 text-[0.9375rem] font-semibold text-foreground transition-colors hover:bg-surface-2"
                        >
                          All products
                          <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                      {item.children.map((child) => {
                        const product = PRODUCT_PATHS[child.href];
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpenMenu(null)}
                              className={cn(
                                "block rounded-[6px] px-3 py-2.5 transition-colors hover:bg-surface-2",
                                pathname === child.href ? "bg-surface-2" : "",
                              )}
                            >
                              <span className="flex items-center justify-between gap-3 text-[0.9375rem] font-semibold text-foreground">
                                {child.label}
                                <span className="text-[0.75rem] font-medium text-foreground-faint">
                                  {product?.statusLabel}
                                </span>
                              </span>
                              <span className="mt-0.5 block text-[0.8125rem] leading-5 text-foreground-subtle">
                                {product?.category}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative py-2 text-[0.9375rem] font-semibold transition-colors",
                  isActive ? "text-foreground" : "text-foreground-subtle hover:text-foreground",
                )}
              >
                {item.label}
                {isActive && (
                  <span aria-hidden="true" className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-foreground" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpenPath(null);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpenPath(open ? null : pathname)}
        className="flex h-11 w-11 items-center justify-center rounded-[7px] border border-line text-foreground transition-colors hover:bg-surface-2 active:translate-y-px"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {open ? (
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <path d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-[76px] h-[calc(100dvh-76px)] bg-accent text-accent-contrast"
        >
          <div
            id="mobile-navigation"
            ref={panelRef}
            className="h-full overflow-y-auto overscroll-contain px-5 py-8 sm:px-8"
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-1">
                {NAVIGATION.map((item) => {
                  const isActive =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <li key={item.href} className="border-b border-white/10">
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setOpenPath(null)}
                        className={cn(
                          "flex items-center justify-between py-3 font-display text-[2.4rem] leading-none transition-colors",
                          isActive ? "text-gold" : "text-accent-contrast hover:text-gold",
                        )}
                      >
                        {item.label}
                        {isActive && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gold" />}
                      </Link>
                      {item.children && (
                        <ul className="flex flex-col gap-1 pb-4 pl-1">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setOpenPath(null)}
                                className={cn(
                                  "flex items-center justify-between gap-3 py-1.5 text-[0.9375rem] font-medium transition-colors",
                                  pathname === child.href
                                    ? "text-gold"
                                    : "text-accent-contrast/70 hover:text-accent-contrast",
                                )}
                              >
                                {child.label}
                                <span className="text-[0.75rem] text-accent-contrast/45">
                                  {PRODUCT_PATHS[child.href]?.statusLabel}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-8 rounded-[var(--radius)] bg-gold p-5 text-gold-contrast">
              <p className="font-display text-[1.9rem] leading-none">
                Have a project in mind?
              </p>
              <p className="mt-2 text-[0.9375rem] leading-6">
                Tell us what the work needs to do. We will say plainly whether it is work we can
                take on.
              </p>
              <Link
                href={ROUTES.contact}
                onClick={() => setOpenPath(null)}
                className="mt-4 inline-flex h-11 items-center rounded-[7px] bg-accent px-5 text-[0.9375rem] font-semibold text-accent-contrast"
              >
                Start a project
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-between text-[0.875rem] text-accent-contrast/60">
              <a href="mailto:bloomcoretechnologies@gmail.com" className="hover:text-accent-contrast">
                Email
              </a>
              <a href="tel:0240064668" className="hover:text-accent-contrast">
                0240064668
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background">
      <div className="page-frame flex h-[76px] items-center justify-between gap-4">
        <BrandLockup />
        <div className="flex items-center gap-3 xl:gap-6">
          <DesktopNav />
          <Link
            href={ROUTES.contact}
            className="hidden h-11 items-center rounded-[7px] bg-accent px-5 text-[0.9375rem] font-semibold text-accent-contrast transition-colors hover:bg-accent-strong active:translate-y-px xl:inline-flex"
          >
            Start a project
          </Link>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
