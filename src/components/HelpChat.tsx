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
 * Floating assistant: a square "Ask" trigger at the bottom-right, with the
 * transcript panel opening above it. Answers come from a knowledge base of
 * the site's own content (see lib/assistant-kb.ts). The panel uses fixed
 * colours — never theme variables — so it stays equally visible in light and
 * dark mode. Back-to-top sits above the trigger.
 */

const WHATSAPP_NUMBER = `233${CONTACT.phoneCallsWhatsapp.replace(/^0/, "")}`;

type ChatMessage = {
  role: "user" | "bot";
  text: string;
  link?: AssistantLink;
};

function entryToChip(entry: KBEntry): string {
  return entry.chip;
}

export function HelpChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: `BloomCore assistant. Ask about this site — the three products, services, the founder, or how to make contact — or pick a question below.`,
    },
  ]);
  const [chips, setChips] = useState<string[]>(
    defaultChips.map((id) => getEntry(id).chip),
  );
  const [pendingChips, setPendingChips] = useState<KBEntry[] | null>(null);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const typingTimer = useRef<number | null>(null);

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
    setOpen((current) => !current);
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
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {open && (
        <div
          role="dialog"
          aria-label={`${BRAND.name} assistant`}
          className="bc-panel-in pointer-events-auto absolute right-0 bottom-full mb-2 flex w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden bg-[#08241f] text-[#f7f4ec] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]"
        >
          <div className="flex items-center gap-3 border-b border-white/15 px-4 py-3">
            <span aria-hidden="true" className="block h-2 w-2 shrink-0 bg-gold" />
            <div className="min-w-0 flex-1">
              <p className="text-[0.9375rem] font-semibold text-[#f7f4ec]">
                {BRAND.name} assistant
              </p>
              <p className="text-[0.75rem] text-[#f7f4ec]/55">
                Answers from this site&apos;s content
              </p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={toggleOpen}
              className="p-1.5 text-[#f7f4ec]/50 transition-colors hover:bg-white/10 hover:text-[#f7f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7f4ec]"
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

          <div
            ref={listRef}
            className="flex max-h-[min(380px,52vh)] flex-col gap-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[88%] px-3.5 py-2.5 text-[13px] leading-relaxed",
                  message.role === "user"
                    ? "self-end bg-gold text-[#15170f]"
                    : "self-start bg-white/10 text-[#f7f4ec]/90",
                )}
              >
                {message.text}
                {message.link &&
                  (message.link.external ? (
                    <a
                      href={message.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block w-max bg-[#f7f4ec] px-1 py-0.5 text-[12px] font-semibold text-[#15170f] transition-colors hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7f4ec]"
                    >
                      {message.link.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <a
                      href={message.link.href}
                      className="mt-2 block w-max bg-[#f7f4ec] px-1 py-0.5 text-[12px] font-semibold text-[#15170f] transition-colors hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7f4ec]"
                    >
                      {message.link.label}
                    </a>
                  ))}
              </div>
            ))}
            {typing && (
              <div
                aria-label="Assistant is typing"
                className="flex w-max items-center gap-1 self-start bg-white/10 px-3.5 py-3"
              >
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="bc-typing-dot size-1.5 rounded-full bg-[#f7f4ec]/60"
                    style={{ animationDelay: `${dot * 160}ms` }}
                  />
                ))}
              </div>
            )}
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-white/15 px-4 py-3">
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => askChip(chip)}
                  className="border border-white/20 px-2.5 py-1.5 text-[11px] font-medium text-[#f7f4ec]/75 transition-colors hover:border-white/50 hover:text-[#f7f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7f4ec]"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-white/15 px-3 py-3">
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
              className="h-10 min-w-0 flex-1 border border-white/20 bg-white/5 px-3 text-[13px] text-[#f7f4ec] placeholder:text-[#f7f4ec]/55 focus:border-[#f7f4ec]/60 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Send question"
              disabled={!input.trim() || typing}
              onClick={() => respond(input)}
              className="flex h-10 w-10 shrink-0 items-center justify-center bg-gold text-[#15170f] transition-opacity hover:opacity-90 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7f4ec]"
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

          <div className="flex items-center gap-2 border-t border-white/15 px-4 py-2.5">
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Enquiry — BloomCore Technologies")}`}
              className="flex-1 text-center text-[11px] text-[#f7f4ec]/50 transition-colors hover:text-[#f7f4ec]"
            >
              Email us
            </a>
            <span aria-hidden="true" className="text-white/25">
              ·
            </span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-[11px] text-[#f7f4ec]/50 transition-colors hover:text-[#f7f4ec]"
            >
              WhatsApp
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <span aria-hidden="true" className="text-white/25">
              ·
            </span>
            <a
              href={ROUTES.contact}
              onClick={toggleOpen}
              className="flex-1 text-center text-[11px] text-[#f7f4ec]/50 transition-colors hover:text-[#f7f4ec]"
            >
              Contact page
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggleOpen}
        aria-label={open ? "Close help chat" : "Open help chat"}
        aria-expanded={open}
        className="pointer-events-auto inline-flex h-12 items-center gap-2 bg-accent px-4 text-accent-contrast shadow-[0_12px_28px_-14px_rgba(0,0,0,0.6)] transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2 3.5h12v7H8.5L5 13.5v-3H2v-7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[0.9375rem] font-medium">{open ? "Close" : "Ask"}</span>
      </button>
    </div>
  );
}
