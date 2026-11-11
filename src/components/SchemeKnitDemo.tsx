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
    <div className="grid lg:grid-cols-2">
      <div className="flex min-h-[70svh] flex-col justify-between bg-accent p-5 text-accent-contrast sm:p-8 lg:min-h-[86svh] lg:p-12">
        <div className="max-w-[34ch]">
          <p className="text-[0.9375rem] leading-6 text-accent-contrast/75">
            This example reads a short scheme of learning. Type one indicator per line, separated by
            a vertical bar.
          </p>
          <label
            htmlFor="scheme-example"
            className="mt-6 block text-[0.9375rem] font-medium text-accent-contrast"
          >
            Scheme lines
          </label>
          <textarea
            id="scheme-example"
            value={scheme}
            onChange={(event) => setScheme(event.target.value)}
            rows={6}
            spellCheck={false}
            aria-describedby="scheme-example-hint"
            className="mt-2 w-full resize-y border border-accent-contrast/30 bg-accent-strong/40 p-3 font-[inherit] text-[0.9375rem] leading-6 text-accent-contrast placeholder:text-accent-contrast/60 focus-visible:border-accent-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-contrast"
          />
          <p id="scheme-example-hint" className="mt-2 text-[0.8125rem] leading-5 text-accent-contrast/65">
            Format: Week | Indicator code | Description. Your text stays in this browser and is not
            sent anywhere.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setScheme(SAMPLE);
                setSelected(0);
              }}
              className="border border-accent-contrast/40 px-3 py-2 text-[0.8125rem] font-medium transition-colors hover:bg-accent-contrast hover:text-accent"
            >
              Reset the example
            </button>
            <span className="text-[0.8125rem] text-accent-contrast/70">
              {indicators.length} {indicators.length === 1 ? "indicator" : "indicators"} read
            </span>
          </div>
        </div>

        <h2 className="display mt-10 text-[clamp(2.6rem,5.4vw,5.6rem)]">From scheme</h2>
      </div>

      <div className="flex min-h-[70svh] flex-col justify-between bg-surface p-5 sm:p-8 lg:min-h-[86svh] lg:p-12">
        <div data-ui className="w-full max-w-[560px] bg-background">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <p className="text-[13px] font-semibold text-foreground">Lesson plan preview</p>
            <span className="border border-border px-2 py-0.5 text-[10px] text-foreground-subtle">
              Draft
            </span>
          </div>

          {indicators.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-1 border-b border-border p-2">
                {indicators.map((indicator, index) => (
                  <button
                    key={`${indicator.code}-${index}`}
                    type="button"
                    onClick={() => setSelected(index)}
                    aria-pressed={index === selected}
                    className={cn(
                      "max-w-full truncate px-2 py-1 text-[10px] font-medium transition-colors",
                      index === selected
                        ? "bg-[#1c7189] text-white"
                        : "bg-muted text-foreground-subtle hover:text-foreground",
                    )}
                  >
                    {indicator.code === "—" ? indicator.label : indicator.code}
                  </button>
                ))}
              </div>

              {active && (
                <div className="p-4">
                  <p className="text-[10px] text-foreground-faint">{active.week}</p>
                  <p className="mt-1 text-[15px] leading-tight font-semibold text-foreground">
                    {active.label}
                  </p>
                  <div className="mt-4 flex flex-col gap-2.5">
                    {[
                      ["Learning indicator", `${active.code} — ${active.label}`],
                      ["Content standard", "Demonstrate understanding of the strand content"],
                      ["Core competencies", "Critical thinking, digital literacy, collaboration"],
                      ["Phase 1 · Starter", "Recall a familiar example from the learners' environment"],
                      [
                        "Phase 2 · New learning",
                        `Introduce and explain: ${active.label.toLowerCase()}`,
                      ],
                      [
                        "Phase 3 · Assessment",
                        `Ask learners to demonstrate or describe ${active.label.toLowerCase()}`,
                      ],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[10px] text-foreground-faint">{label}</p>
                        <p className="mt-0.5 text-[11px] leading-4 text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-[#1c7189] px-3 py-1.5 text-[10px] font-medium text-white">
                      Save lesson
                    </span>
                    <span className="border border-border px-3 py-1.5 text-[10px] text-foreground-subtle">
                      Export
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-10">
              <p className="text-[13px] font-medium text-foreground">No indicators read yet</p>
              <p className="mt-1 text-[11px] leading-4 text-foreground-subtle">
                Add a line on the left in the format Week | Code | Description.
              </p>
            </div>
          )}
        </div>

        <h2 className="display mt-10 text-right text-[clamp(2.6rem,5.4vw,5.6rem)]">to plan.</h2>
      </div>
    </div>
  );
}
