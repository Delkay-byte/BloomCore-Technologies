"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BRAND, CONTACT, ROUTES } from "@/lib/brand";
import {
  answerQuestion,
  defaultChips,
  getEntry,
  type AssistantLink,
  type KBEntry,
} from "@/lib/assistant-kb";

/**
 * Floating assistant, modelled on the Grokified mascot button: a friendly
 * character parked flush against the bottom-left edge, idling on a slow
 * float, shaking side to side when the cursor lands on it, with a
 * dismissible "We're here to help" nudge above it. Sitting bottom-left keeps
 * the back-to-top control on the bottom-right clear.
 *
 * Answers come from a knowledge base of the site's own content (see
 * lib/assistant-kb.ts). The panel, mascot and message bubbles use fixed
 * colours — never theme variables — so they stay equally visible in light
 * and dark mode.
 */

const WHATSAPP_NUMBER = `233${CONTACT.phoneCallsWhatsapp.replace(/^0/, "")}`;

type ChatMessage = {
  role: "user" | "bot";
  text: string;
  link?: AssistantLink;
};

/** Original BloomCore assistant character — a soft white blob with an accent antenna. */
function MascotFace({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 88 88"
      role="img"
      aria-hidden="true"
      className={className}
      style={{
        filter: "drop-shadow(0 10px 14px rgba(0, 0, 0, 0.28))",
      }}
    >
      {/* Body */}
      <path
        d="M44 10c17.5 0 30 11.6 30 28.6C74 56.8 61.6 70 44 70S14 56.8 14 38.6C14 21.6 26.5 10 44 10Z"
        fill="#FDFDFC"
      />
      {/* Bottom shading */}
      <path
        d="M44 70c-12.5 0-22.6-6.6-27.1-16.9C21.6 61.5 32 70 44 70s22.4-8.5 27.1-16.9C66.6 63.4 56.5 70 44 70Z"
        fill="#00000014"
      />
      {/* Antenna */}
      <line x1="44" y1="10" x2="44" y2="4" stroke="#FDFDFC" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="44" cy="3.4" r="3.4" fill="#5AC9A9" />
      {/* Eyes */}
      <ellipse cx="34.5" cy="38" rx="3.6" ry="4.6" fill="#1B1B1A" />
      <ellipse cx="53.5" cy="38" rx="3.6" ry="4.6" fill="#1B1B1A" />
      <circle cx="35.7" cy="36.4" r="1.2" fill="#FFFFFF" />
      <circle cx="54.7" cy="36.4" r="1.2" fill="#FFFFFF" />
      {/* Smile */}
      <path
        d="M37.5 48.5c1.8 2.4 4.1 3.6 6.5 3.6s4.7-1.2 6.5-3.6"
        stroke="#1B1B1A"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cheeks */}
      <circle cx="26.5" cy="45.5" r="2.6" fill="#0B5D4B" opacity="0.16" />
      <circle cx="61.5" cy="45.5" r="2.6" fill="#0B5D4B" opacity="0.16" />
    </svg>
  );
}

function entryToChip(entry: KBEntry): string {
  return entry.chip;
}

export function HelpChat() {
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: `Hi there 👋 I'm the ${BRAND.name} assistant. Ask me anything about this site — any page, the three products, services, founder, contact — or pick a question below.`,
    },
  ]);
  const [chips, setChips] = useState<string[]>(
    defaultChips.map((id) => getEntry(id).chip),
  );
  const [pendingChips, setPendingChips] = useState<KBEntry[] | null>(null);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [unreadPing, setUnreadPing] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const typingTimer = useRef<number | null>(null);

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      setNudgeVisible(true);
      // A short attention ping on the mascot once the nudge has been seen.
      window.setTimeout(() => setUnreadPing(true), 1400);
    }, 2200);
    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimer.current !== null) window.clearTimeout(typingTimer.current);
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, typing]);

  const toggleOpen = () => {
    setOpen((current) => {
      const next = !current;
      if (next) {
        setNudgeDismissed(true);
        setUnreadPing(false);
      }
      return next;
    });
  };

  const respond = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || typing) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setInput("");
    setChips([]);
    setTyping(true);
    if (typingTimer.current !== null) window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => {
      const reply = answerQuestion(trimmed);
      setMessages((current) => [
        ...current,
        { role: "bot", text: reply.text, link: reply.link },
      ]);
      setTyping(false);
      setChips(reply.followUps.map(entryToChip));
      setPendingChips(reply.followUps.length > 0 ? reply.followUps : null);
    }, 700);
  };

  const askChip = (chip: string) => {
    if (pendingChips) {
      const match = pendingChips.find((entry) => entry.chip === chip);
      if (match) {
        setMessages((current) => [...current, { role: "user", text: chip }]);
        setInput("");
        setChips([]);
        setTyping(true);
        if (typingTimer.current !== null) window.clearTimeout(typingTimer.current);
        typingTimer.current = window.setTimeout(() => {
          setMessages((current) => [
            ...current,
            { role: "bot", text: match.answer, link: match.link },
          ]);
          setTyping(false);
          const followUps = (match.followUps ?? []).map((id) => getEntry(id));
          setChips(followUps.map(entryToChip));
          setPendingChips(followUps.length > 0 ? followUps : null);
        }, 700);
        return;
      }
    }
    respond(chip);
  };

  return (
    <div className="pointer-events-none fixed bottom-0 left-3 z-[60] sm:left-6">
      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label={`${BRAND.name} assistant`}
          className="bc-panel-in pointer-events-auto absolute bottom-full left-0 mb-3 flex w-[min(22rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/8">
              <MascotFace className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">{BRAND.name} assistant</p>
              <p className="flex items-center gap-1.5 text-[11px] text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                Knows this site · human replies same day
              </p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={toggleOpen}
              className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M1.5 1.5l9 9m0-9l-9 9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div ref={listRef} className="flex max-h-[min(380px,52vh)] flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                  message.role === "user"
                    ? "self-end rounded-br-md bg-[#0B5D4B] text-white"
                    : "self-start rounded-bl-md bg-white/8 text-white/85",
                )}
              >
                {message.text}
                {message.link && (
                  message.link.external ? (
                    <a
                      href={message.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block w-max rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {message.link.label} ↗
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <a
                      href={message.link.href}
                      className="mt-2 block w-max rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {message.link.label} →
                    </a>
                  )
                )}
              </div>
            ))}
            {typing && (
              <div
                aria-label="Assistant is typing"
                className="flex w-max items-center gap-1 self-start rounded-2xl rounded-bl-md bg-white/8 px-3.5 py-3"
              >
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="bc-typing-dot size-1.5 rounded-full bg-white/60"
                    style={{ animationDelay: `${dot * 160}ms` }}
                  />
                ))}
              </div>
            )}
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-4 py-3">
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => askChip(chip)}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-white/10 px-3 py-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  respond(input);
                }
              }}
              placeholder="Ask about any page or product…"
              aria-label="Ask the assistant a question"
              className="h-9 min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 text-[13px] text-white placeholder:text-white/35 focus:border-white/40 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Send question"
              disabled={!input.trim() || typing}
              onClick={() => respond(input)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-black transition-opacity hover:opacity-85 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2 8l12-6-4.5 12L7 9.5 2 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2.5">
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Enquiry — BloomCore Technologies")}`}
              className="flex-1 text-center text-[11px] text-white/45 transition-colors hover:text-white/85"
            >
              Email us
            </a>
            <span aria-hidden="true" className="text-white/20">·</span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-[11px] text-white/45 transition-colors hover:text-white/85"
            >
              WhatsApp
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <span aria-hidden="true" className="text-white/20">·</span>
            <a
              href={ROUTES.contact}
              onClick={toggleOpen}
              className="flex-1 text-center text-[11px] text-white/45 transition-colors hover:text-white/85"
            >
              Contact page
            </a>
          </div>
        </div>
      )}

      {/* Nudge card */}
      {nudgeVisible && !nudgeDismissed && !open && (
        <div className="bc-nudge-in pointer-events-auto absolute bottom-full left-0 mb-1 flex w-max max-w-[min(17rem,calc(100vw-1.5rem))] items-start gap-2 rounded-2xl rounded-bl-md border border-white/12 bg-[#161616] py-3 pr-2 pl-4 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
          <button
            type="button"
            onClick={toggleOpen}
            className="text-left text-[13px] leading-snug text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-white"
          >
            <span className="block font-medium text-white">We&apos;re here to help</span>
            Questions about products, data work, or pricing? Ask us.
          </button>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setNudgeDismissed(true)}
            className="-mt-0.5 shrink-0 rounded-md p-1 text-white/35 transition-colors hover:bg-white/5 hover:text-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
            </svg>
          </button>
        </div>
      )}

      {/* Mascot button */}
      <div className="overflow-hidden px-2 pt-3">
        <button
          type="button"
          onClick={toggleOpen}
          aria-label={open ? "Close help chat" : "Open help chat"}
          aria-expanded={open}
          className={cn(
            "bc-fab pointer-events-auto relative block size-[72px] cursor-pointer rounded-3xl sm:size-[88px]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
          )}
        >
          <span className="bc-mascot-float block size-full">
            <span className="bc-mascot-body relative block size-full">
              <MascotFace className="absolute inset-0 size-full object-contain" />
            </span>
          </span>
          {unreadPing && !open && (
            <span
              aria-hidden="true"
              className="bc-ping absolute top-2 right-2 flex h-3.5 w-3.5"
            >
              <span className="bc-ping-ring absolute inline-flex size-full rounded-full bg-[#5AC9A9] opacity-70" />
              <span className="relative inline-flex size-3.5 rounded-full border-2 border-[#161616] bg-[#5AC9A9]" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
