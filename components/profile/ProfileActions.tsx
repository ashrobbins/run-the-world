"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UnitPreference } from "@/lib/units";

export function DisconnectStravaButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDisconnect() {
    if (!confirm("Disconnect Strava? Your journeys and stamps stay — only the connection is removed.")) return;
    setBusy(true);
    await fetch("/api/strava/disconnect", { method: "POST" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDisconnect}
      disabled={busy}
      className="text-xs font-bold px-2.5 py-1.5 rounded-full disabled:opacity-60"
      style={{ color: "#C24A16", background: "#FCE4D8" }}
    >
      {busy ? "…" : "Disconnect"}
    </button>
  );
}

export function SyncNowInline() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleSync() {
    setBusy(true);
    await fetch("/api/sync", { method: "POST" });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      onClick={handleSync}
      disabled={busy}
      className="text-xs font-bold disabled:opacity-60"
      style={{ color: "var(--color-accent)" }}
    >
      {busy ? "Syncing…" : "Sync now"}
    </button>
  );
}

export function UnitToggle({ unit }: { unit: UnitPreference }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    setBusy(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ unit_preference: unit === "km" ? "mi" : "km" })
        .eq("id", user.id);
    }
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={busy}
      className="text-sm font-semibold disabled:opacity-60"
      style={{ color: "var(--color-text-primary)" }}
    >
      Units &middot; {unit}
    </button>
  );
}

export function DeleteAccountButton() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    setBusy(true);
    const response = await fetch("/api/account/delete", { method: "POST" });
    if (response.ok) {
      router.push("/login");
    } else {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-left"
        style={{ color: "#C24A16" }}
      >
        Delete my account &amp; data
      </button>
    );
  }

  return (
    <div className="rounded-2xl border p-4 mt-2" style={{ borderColor: "#FCE4D8", background: "#FFF6F2" }}>
      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
        This permanently deletes your journeys, stamps, and Strava connection. Type DELETE to confirm.
      </p>
      <input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="DELETE"
        className="w-full mt-2 rounded-lg border px-3 py-2 text-sm"
        style={{ borderColor: "var(--color-border)" }}
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setOpen(false)}
          className="flex-1 rounded-lg py-2 text-sm font-semibold"
          style={{ background: "var(--color-card)", color: "var(--color-text-secondary)" }}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={confirmText !== "DELETE" || busy}
          className="flex-1 rounded-lg py-2 text-sm font-bold text-white disabled:opacity-50"
          style={{ background: "#C24A16" }}
        >
          {busy ? "Deleting…" : "Delete everything"}
        </button>
      </div>
    </div>
  );
}
