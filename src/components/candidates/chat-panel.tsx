"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function ChatPanel({ evaluationId }: { evaluationId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/chat?evaluationId=${evaluationId}`)
      .then((res) => res.json())
      .then((data: ChatMessage[]) => {
        if (!cancelled) setMessages(data);
      })
      .catch(() => toast.error("Failed to load chat history."))
      .finally(() => !cancelled && setIsLoadingHistory(false));
    return () => {
      cancelled = true;
    };
  }, [evaluationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const message = input.trim();
    if (!message || isSending) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evaluationId, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send message.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((prev) => prev.slice(0, -1));
      setInput(message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-1 py-2">
        {isLoadingHistory ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Loading conversation
          </div>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Ask a follow-up about this candidate&apos;s fit, gaps, or how to run the interview.
          </p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {isSending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3.5 py-2.5 text-sm text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Thinking
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-border pt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this candidate..."
          disabled={isSending || isLoadingHistory}
        />
        <Button type="submit" size="icon" disabled={!input.trim() || isSending}>
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
