"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/", label: "Evaluate" },
  { href: "/candidates", label: "History" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3 transition-transform hover:scale-105">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-1 text-primary-foreground shadow-md ring-1 ring-primary/20">
            <UserSearch className="size-4 transition-transform group-hover:scale-110" strokeWidth={2.5} />
          </span>
          <span className="text-base font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Zikra AI Recruiter
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                  active
                    ? "bg-foreground text-background shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="ml-2 pl-4 border-l border-border/70 flex items-center">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
