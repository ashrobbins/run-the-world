"use client";

import { useEffect, useRef, useState } from "react";

interface Suggestion {
  id: string;
  placeName: string;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function PlaceAutocompleteInput({
  name,
  placeholder,
  className,
  style,
}: {
  name: string;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Set right after picking a suggestion, so the resulting value change doesn't
  // immediately re-search and reopen the dropdown on the text we just filled in.
  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    if (!MAPBOX_TOKEN || value.trim().length < 3) {
      debounceRef.current = setTimeout(() => setSuggestions([]), 0);
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }

    debounceRef.current = setTimeout(async () => {
      const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json`);
      url.searchParams.set("access_token", MAPBOX_TOKEN);
      url.searchParams.set("autocomplete", "true");
      url.searchParams.set("limit", "5");
      url.searchParams.set("types", "place,locality,region,country");
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const results: Suggestion[] = (data.features ?? []).map((f: { id: string; place_name: string }) => ({
          id: f.id,
          placeName: f.place_name,
        }));
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        // Silently ignore — the field still works as plain free text on submit.
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  return (
    <div className="relative">
      <input
        name={name}
        required
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={className}
        style={style}
      />
      {open && (
        <div
          className="absolute left-0 right-0 mt-1 rounded-xl border shadow-lg overflow-hidden z-10"
          style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}
        >
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                skipNextSearchRef.current = true;
                setValue(s.placeName);
                setSuggestions([]);
                setOpen(false);
              }}
              className="block w-full text-left px-3.5 py-2.5 text-sm"
              style={{ color: "var(--color-text-primary)" }}
            >
              {s.placeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
