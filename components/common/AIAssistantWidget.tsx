"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useUser } from "@/hooks/useUser";
import axios from "axios";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AIAssistantWidget() {
  const { data: user } = useUser();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: uid(),
      role: "assistant",
      content: "Hi! I’m your AI assistant. Tell me what you need, and I’ll help.",
    },
  ]);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => !isSending && draft.trim().length > 0, [draft, isSending]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // Keep latest message visible.
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [open, messages.length]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = panelRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    if (isSending) return;
    setDraft("");
    const userMsg: Message = { id: uid(), role: "user", content: text };
    const pendingId = uid();
    const pendingMsg: Message = { id: pendingId, role: "assistant", content: "Thinking…" };

    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setIsSending(true);

    try {
      const res = await api.post<{ text: string }>("/ai/chat", {
        message: text,
        userId: user?.id ?? "anonymous",
      });
      const reply = res.data?.text?.trim() || "Sorry — I didn’t get a response.";
      setMessages((prev) =>
        prev.map((m) => (m.id === pendingId ? { ...m, content: reply } : m))
      );
    } catch (err) {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
            err.message ||
            "Failed to contact assistant. Please try again."
          : err instanceof Error
            ? err.message
            : "Failed to contact assistant. Please try again.";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { ...m, content: `Sorry — something went wrong.\n${message}` }
            : m
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed z-50 end-4 bottom-24 md:bottom-6">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="AI assistant"
          className={cn(
            "mb-3 w-[min(92vw,24rem)] overflow-hidden rounded-2xl border bg-background shadow-xl",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">AI Assistant</div>
                <div className="truncate text-xs text-muted-foreground">
                  Ask anything about the app or content
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div ref={listRef} className="max-h-[50vh] space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-2 border-t p-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Type a message…"
              className="min-h-[42px] max-h-28 flex-1 resize-none rounded-xl border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              type="button"
              className="h-[42px] rounded-xl"
              onClick={send}
              disabled={!canSend}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Button
        type="button"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg shadow-primary/20"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
      >
        <Bot className="h-5 w-5" />
      </Button>
    </div>
  );
}

