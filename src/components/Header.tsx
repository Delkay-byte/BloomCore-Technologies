"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/brand/bloomcore-logo-white.png";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { BRAND, NAVIGATION } from "@/lib/brand";
import { cn } from "@/lib/utils";

function BrandLockup() {
  return (
    <Link
      href="/"
      className="inline-flex items-center rounded-md bg-[#080808] px-2.5 py-1.5"
      aria-label={`${BRAND.name} — home`}
    >
      <Image
        src={logo}
        alt={BRAND.name}
        priority
        sizes="140px"
        className="h-9 w-auto sm:h-10"
      />
    </Link>
  );
}

function DesktopNav() {
  const pathname = usePathname();
  // The open menu is tied to the path it was opened on, so navigating closes it
  // without an effect that resets state.
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
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
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
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-5 lg:gap-7">
        {NAVIGATION.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

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
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={(event) => {
                    // Mouse clicks always open: hover may already have opened it,
                    // and a click should not immediately close the menu again.
                    const opened = { label: item.label, path: pathname };
                    if (event.detail === 0) {
                      setOpenMenu(isOpen ? null : opened);
                    } else {
                      setOpenMenu(opened);
                    }
                  }}
                  onFocus={() => setOpenMenu({ label: item.label, path: pathname })}
                  className={cn(
                    "flex items-center gap-1.5 py-2 text-sm font-medium tracking-tight transition-colors",
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
                  <div className="absolute top-full left-0 z-50 w-64 pt-2">
                    <ul className="overflow-hidden rounded-lg border border-border bg-background p-1.5 shadow-lg">
                      <li>
                        <Link
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                        >
                          All products
                        </Link>
                      </li>
                      <li aria-hidden="true" className="my-1.5 h-px bg-border" />
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm transition-colors",
                              pathname === child.href
                                ? "bg-muted font-medium text-foreground"
                                : "text-foreground-subtle hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
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
                  "py-2 text-sm font-medium tracking-tight transition-colors",
                  isActive ? "text-foreground" : "text-foreground-subtle hover:text-foreground",
                )}
              >
                {item.label}
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
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpenPath(open ? null : pathname)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {open ? (
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed inset-x-0 top-16 bottom-0 z-40 border-t border-border bg-background"
        >
          <div
            id="mobile-navigation"
            ref={panelRef}
            className="h-full overflow-y-auto overscroll-contain px-4 py-6"
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {NAVIGATION.map((item) => {
                  const isActive =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                  return (
                    <li key={item.href} className="border-b border-border/70 last:border-0">
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between py-3.5 text-lg font-medium tracking-tight transition-colors",
                          isActive ? "text-foreground" : "text-foreground-subtle",
                        )}
                      >
                        {item.label}
                        {isActive && (
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-foreground" />
                        )}
                      </Link>
                      {item.children && (
                        <ul className="pb-3 pl-3">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "block py-2 text-sm transition-colors",
                                  pathname === child.href
                                    ? "font-medium text-foreground"
                                    : "text-foreground-subtle",
                                )}
                              >
                                {child.label}
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
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLockup />
        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
}
