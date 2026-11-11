"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/brand/bloomcore-logo-white.png";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BRAND, NAVIGATION, ROUTES } from "@/lib/brand";
import { cn } from "@/lib/utils";

function BrandLockup() {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center bg-[#08241f] px-2.5 py-1.5"
      aria-label={`${BRAND.name} — home`}
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
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-6 xl:gap-8">
        {NAVIGATION.filter((item) => item.href !== ROUTES.home).map((item) => {
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
                    const opened = { label: item.label, path: pathname };
                    if (event.detail === 0) {
                      setOpenMenu(isOpen ? null : opened);
                    } else {
                      setOpenMenu(opened);
                    }
                  }}
                  onFocus={() => setOpenMenu({ label: item.label, path: pathname })}
                  className={cn(
                    "flex items-center gap-1.5 py-2 text-[0.9375rem] font-medium tracking-tight transition-colors",
                    isActive || isOpen ? "text-foreground" : "text-foreground-subtle hover:text-foreground",
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
                  <div className="absolute top-full left-0 z-50 w-64 pt-3">
                    <ul className="bg-[#08241f] p-2 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.4)]">
                      <li>
                        <Link
                          href={item.href}
                          className="block px-3 py-2.5 text-[0.9375rem] font-semibold text-[#f7f4ec] transition-colors hover:bg-white/10"
                        >
                          All products
                        </Link>
                      </li>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block px-3 py-2.5 text-[0.9375rem] transition-colors hover:bg-white/10",
                              pathname === child.href
                                ? "text-gold"
                                : "text-[#d6ded4] hover:text-[#f7f4ec]",
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
                  "py-2 text-[0.9375rem] font-medium tracking-tight transition-colors",
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
        className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-surface-2"
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
          className="fixed inset-x-0 top-[68px] h-[calc(100dvh-68px)] bg-[#08241f] sm:top-[76px] sm:h-[calc(100dvh-76px)]"
        >
          <div
            id="mobile-navigation"
            ref={panelRef}
            className="h-full overflow-y-auto overscroll-contain px-5 py-8 sm:px-8"
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {NAVIGATION.map((item) => {
                  const isActive =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setOpenPath(null)}
                        className={cn(
                          "flex items-center justify-between py-3 text-[2rem] leading-tight font-semibold tracking-tight uppercase transition-colors",
                          isActive ? "text-gold" : "text-[#f7f4ec] hover:text-gold",
                        )}
                      >
                        {item.label}
                        {isActive && (
                          <span aria-hidden="true" className="h-2 w-2 bg-gold" />
                        )}
                      </Link>
                      {item.children && (
                        <ul className="flex flex-col gap-1 pb-4 pl-3">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setOpenPath(null)}
                                className={cn(
                                  "block py-1.5 text-[1rem] transition-colors",
                                  pathname === child.href
                                    ? "text-gold"
                                    : "text-[#bfc9bd] hover:text-[#f7f4ec]",
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
            <div className="mt-10 bg-gold p-5 text-[#15170f]">
              <p className="text-[1.35rem] leading-tight font-semibold uppercase">
                Have a project in mind?
              </p>
              <p className="mt-2 text-[0.9375rem] leading-6">
                Describe the problem. We will say plainly whether it is work we can take on.
              </p>
              <Link
                href={ROUTES.contact}
                onClick={() => setOpenPath(null)}
                className="mt-4 inline-flex h-11 items-center bg-[#08241f] px-5 text-[0.9375rem] font-medium text-[#f7f4ec]"
              >
                Contact BloomCore
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="page-frame flex h-[68px] items-center justify-between gap-4 sm:h-[76px]">
        <BrandLockup />
        <div className="flex items-center gap-3 xl:gap-6">
          <DesktopNav />
          <Link
            href={ROUTES.contact}
            className="hidden h-11 items-center bg-accent px-5 text-[0.9375rem] font-medium text-accent-contrast transition-colors hover:bg-accent-strong xl:inline-flex"
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
