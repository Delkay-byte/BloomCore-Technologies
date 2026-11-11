"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const SAMPLE = [
  "Week 1 | B7.1.1.1 | Identify hardware components",
  "Week 1 | B7.1.1.2 | Classify input devices",
  "Week 2 | B7.1.2.1 | Explain storage types",
].join("\n");

type Indicator = { week: string; code: string; label: string };

function parseScheme(value: string): Indicator[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length >= 3) {
        return {
          week: parts[0] || `Week ${index + 1}`,
          code: parts[1] || `IND-${index + 1}`,
          label: parts.slice(2).join(" ") || "Untitled indicator",
        };
      }
      return {
        week: `Line ${index + 1}`,
        code: "—",
        label: line,
      };
    });
}

export function SchemeKnitDemo() {
  const [scheme, setScheme] = useState(SAMPLE);
  const [selected, setSelected] = useState(0);
  const indicators = useMemo(() => parseScheme(scheme), [scheme]);
  const active = indicators[Math.min(selected, Math.max(indicators.length - 1, 0))];

  return (
    <div className="overflow-hidden rounded-[var(--radius)] bg-surface">
      <div className="grid lg:grid-cols-12">
        <div className="bg-surface-2 p-5 sm:p-7 lg:col-span-5 lg:p-9">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[1.1rem] font-bold text-foreground">Scheme lines</h3>
            <span className="rounded-full bg-surface px-2.5 py-1 text-[0.75rem] font-semibold text-foreground-subtle">
              Live example
            </span>
          </div>
          <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-6 text-foreground-subtle">
            Edit one indicator per line. The plan preview responds immediately. Nothing typed here
            leaves this browser.
          </p>

          <label htmlFor="scheme-example" className="mt-6 block text-[0.875rem] font-semibold text-foreground">
            Scheme lines
          </label>
          <textarea
            id="scheme-example"
            value={scheme}
            onChange={(event) => setScheme(event.target.value)}
            rows={7}
            spellCheck={false}
            aria-describedby="scheme-example-hint"
            className="mt-2 w-full resize-y rounded-[var(--radius)] border border-line-strong bg-surface p-3.5 font-[family-name:var(--font-sans)] text-[0.9375rem] leading-7 text-foreground placeholder:text-foreground-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          />
          <p id="scheme-example-hint" className="mt-2 text-[0.8125rem] leading-5 text-foreground-faint">
            Format: Week | Indicator code | Description.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setScheme(SAMPLE);
                setSelected(0);
              }}
              className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-4 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface active:translate-y-px"
            >
              Reset example
            </button>
            <span className="text-[0.8125rem] text-foreground-faint">
              {indicators.length} {indicators.length === 1 ? "indicator" : "indicators"} read
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-7 lg:col-span-7 lg:p-9">
          <div data-ui className="overflow-hidden rounded-[8px] border border-line bg-background">
            <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
              <p className="text-[13px] font-bold text-foreground">Lesson plan preview</p>
              <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-semibold text-foreground">
                Draft
              </span>
            </div>

            {indicators.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-1 border-b border-line p-2">
                  {indicators.map((indicator, index) => (
                    <button
                      key={`${indicator.code}-${index}`}
                      type="button"
                      onClick={() => setSelected(index)}
                      aria-pressed={index === selected}
                      className={cn(
                        "max-w-full truncate rounded-[4px] px-2 py-1 text-[10px] font-semibold transition-colors",
                        index === selected
                          ? "bg-accent text-accent-contrast"
                          : "bg-surface-2 text-foreground-subtle hover:text-foreground",
                      )}
                    >
                      {indicator.code === "—" ? indicator.label : indicator.code}
                    </button>
                  ))}
                </div>

                {active && (
                  <div className="p-4 sm:p-5">
                    <p className="text-[10px] font-semibold text-foreground-faint">{active.week}</p>
                    <p className="mt-1 text-[15px] leading-tight font-bold text-foreground">
                      {active.label}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        ["Learning indicator", `${active.code} — ${active.label}`],
                        ["Content standard", "Demonstrate understanding of the strand content"],
                        ["Core competencies", "Critical thinking, digital literacy, collaboration"],
                        ["Phase 1 · Starter", "Recall a familiar example from the learners' environment"],
                        ["Phase 2 · New learning", `Introduce and explain: ${active.label.toLowerCase()}`],
                        ["Phase 3 · Assessment", `Ask learners to demonstrate or describe ${active.label.toLowerCase()}`],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-[6px] bg-surface p-2.5">
                          <p className="text-[10px] font-semibold text-foreground-faint">{label}</p>
                          <p className="mt-1 text-[11px] leading-4 text-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-[5px] bg-accent px-3 py-1.5 text-[10px] font-semibold text-accent-contrast">
                        Preview only
                      </span>
                      <span className="rounded-[5px] border border-line-strong px-3 py-1.5 text-[10px] font-semibold text-foreground-subtle">
                        Editable in the application
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-10">
                <p className="text-[13px] font-semibold text-foreground">No indicators read yet</p>
                <p className="mt-1 text-[11px] leading-4 text-foreground-subtle">
                  Add a line on the left in the format Week | Code | Description.
                </p>
              </div>
            )}
          </div>
          <p className="mt-3 text-[0.8125rem] leading-5 text-foreground-faint">
            Representative plan. The live SchemeKnit application handles real curriculum documents.
          </p>
        </div>
      </div>
    </div>
  );
}
