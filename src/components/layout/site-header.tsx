"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserSearch } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Evaluate" },
  { href: "/candidates", label: "History" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-2xl px-4">
      <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/3 px-4 py-2.5 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-glow-amber to-glow-blue">
            <UserSearch className="size-3.5 text-black" strokeWidth={2.5} />
          </span>
          <span className="text-[13px] font-semibold tracking-tight">Zikra AI Recruiter</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
