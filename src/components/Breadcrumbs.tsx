import Link from "next/link";
import type { Crumb } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: ReadonlyArray<Crumb> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-foreground-faint">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-foreground-faint/60">
                  /
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className="text-foreground-subtle">
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
