"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/home", label: "Home" },
  { href: "/passport", label: "Passport" },
  { href: "/profile", label: "Profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row justify-around items-center py-3 px-6 border-t"
      style={{ borderColor: "var(--color-border)" }}>
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center gap-1 text-xs font-semibold"
            style={{ color: active ? "var(--color-accent)" : "var(--color-text-secondary)" }}
          >
            {tab.label}
            {active && (
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
