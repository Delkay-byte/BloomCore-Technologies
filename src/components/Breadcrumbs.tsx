import Link from "next/link";
import type { Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ items }: { items: ReadonlyArray<Crumb> }) {
  return (
    <nav aria-label="Breadcrumb" className={items.length > 2 ? "mb-7" : "mb-7 hidden sm:block"}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-foreground-faint">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.href}
              className={cn(
                "min-w-0 items-center gap-2 whitespace-nowrap",
                isLast ? "hidden sm:flex" : "flex",
              )}
            >
              {index > 0 && (
                <span aria-hidden="true" className="shrink-0 text-line-strong">
                  /
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className="max-w-[58vw] truncate font-semibold text-foreground-subtle">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
