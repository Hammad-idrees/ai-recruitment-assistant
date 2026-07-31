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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-[6px] bg-foreground text-background">
            <UserSearch className="size-3.5" strokeWidth={2.25} />
          </span>
          <span className="text-[13px] font-medium tracking-tight">
            Recruiting Assistant
          </span>
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
                  "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="ml-1 pl-2 border-l border-border/70">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
