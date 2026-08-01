"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, UserSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const isEvaluate = pathname.startsWith("/evaluate");

  return (
    <header className="sticky top-6 z-50 mx-auto w-full max-w-3xl px-6">
      <div className="relative flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0d0d0d]/90 py-4 pr-4 pl-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_25px_70px_-20px_rgba(0,0,0,0.6)]">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-glow-amber/5 via-transparent to-glow-blue/5 opacity-0 transition-opacity duration-300 hover:opacity-100" />
        
        <Link href="/" className="relative flex items-center gap-3 transition-transform duration-300 hover:scale-105">
          <span className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-glow-amber to-glow-blue shadow-lg shadow-glow-amber/20 transition-all duration-300 hover:shadow-[0_0_30px_-8px_rgba(251,191,36,0.4)] hover:scale-110">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
            <UserSearch className="relative size-5 text-black" strokeWidth={2.5} />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white">Zikra AI Recruiter</span>
            <span className="text-[10px] font-medium text-white/50">Powered by Deep Agents</span>
          </div>
        </Link>

        <div className="relative flex items-center gap-2">
          <Link
            href="/candidates"
            className={cn(
              "relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300",
              pathname.startsWith("/candidates")
                ? "bg-gradient-to-r from-glow-amber/20 to-glow-blue/20 text-white border border-glow-amber/30 shadow-[0_0_20px_-8px_rgba(251,191,36,0.2)]"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            History
          </Link>
          <Button
            render={<Link href="/evaluate" />}
            nativeButton={false}
            size="default"
            variant={isEvaluate ? "secondary" : "default"}
            className="relative gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-8px_rgba(251,191,36,0.3)]"
          >
            Evaluate
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
