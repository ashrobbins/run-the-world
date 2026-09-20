import Link from "next/link";
import { submitCustomJourneyForm } from "@/lib/journeys/actions";

export default async function CustomJourneyFormPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="px-6 pt-5 pb-6">
      <div className="flex items-center justify-between mb-4">
        <Link href="/journey/new" aria-label="Back">
          <BackIcon />
        </Link>
        <h1 className="text-base font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
          Plan your route
        </h1>
        <span className="w-5" />
      </div>

      {error && (
        <div
          className="text-xs rounded-lg px-3 py-2.5 mb-4"
          style={{ background: "var(--color-danger-bg)", color: "var(--color-danger)" }}
        >
          {error}
        </div>
      )}

      <form action={submitCustomJourneyForm} className="flex flex-col gap-4">
        <div className="rounded-2xl border" style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <div className="p-3.5">
            <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              From
            </label>
            <input
              name="from"
              required
              placeholder="e.g. Wimborne, UK"
              className="block w-full mt-1 text-base font-semibold bg-transparent outline-none"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
            />
          </div>
          <div className="h-px" style={{ background: "var(--color-border)" }} />
          <div className="p-3.5">
            <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              To
            </label>
            <input
              name="to"
              required
              placeholder="e.g. Fremantle, Australia"
              className="block w-full mt-1 text-base font-semibold bg-transparent outline-none"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl py-3.5 text-sm font-bold text-white"
          style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
        >
          Find routes
        </button>
      </form>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
