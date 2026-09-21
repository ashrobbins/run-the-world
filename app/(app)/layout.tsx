import { BottomNav } from "@/components/nav/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col max-w-md mx-auto" style={{ background: "var(--color-bg)" }}>
      <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
      <BottomNav />
    </div>
  );
}
