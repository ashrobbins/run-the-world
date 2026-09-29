import { LogoGlyph } from "@/components/Logo";

export function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      style={{ background: "linear-gradient(160deg, #7C6CF0 0%, #5A48D8 100%)" }}
    >
      <div className="splash-pulse">
        <LogoGlyph size={104} />
      </div>
      <div className="flex items-center gap-2">
        <span className="typing-dot w-2.5 h-2.5 rounded-full bg-white" />
        <span className="typing-dot w-2.5 h-2.5 rounded-full bg-white" />
        <span className="typing-dot w-2.5 h-2.5 rounded-full bg-white" />
      </div>
    </div>
  );
}
