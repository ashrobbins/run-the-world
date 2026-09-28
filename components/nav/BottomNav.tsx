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
            className="text-sm font-semibold"
            style={{ color: active ? "var(--color-accent)" : "var(--color-text-secondary)" }}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
