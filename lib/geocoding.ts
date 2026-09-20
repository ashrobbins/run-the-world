import "server-only";
import { ISO_TO_FLAG_CODE } from "@/lib/journeys/iso-country-map";

export interface GeocodedPlace {
  name: string;
  lat: number;
  lng: number;
  countryCode: string;
}

/** Forward-geocodes free-text place name (e.g. "Wimborne, UK") via Mapbox. */
export async function geocodePlace(query: string): Promise<GeocodedPlace | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) throw new Error("NEXT_PUBLIC_MAPBOX_TOKEN is not set.");

  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "1");
  url.searchParams.set("types", "place,locality,region,country");

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Mapbox geocoding request failed: ${response.status}`);
  }

  const data = await response.json();
  const feature = data.features?.[0];
  if (!feature) return null;

  const [lng, lat] = feature.center as [number, number];
  const countryContext = (feature.context as Array<{ id: string; short_code?: string }> | undefined)?.find(
    (c) => c.id.startsWith("country"),
  );
  const isoCode = countryContext?.short_code?.toLowerCase();
  const countryCode = (isoCode && ISO_TO_FLAG_CODE[isoCode]) || "uk";

  const shortName = feature.text as string;
  const displayCode = isoCode ? (isoCode === "gb" ? "UK" : isoCode.toUpperCase()) : undefined;
  const name = displayCode ? `${shortName}, ${displayCode}` : shortName;

  return { name, lat, lng, countryCode };
}
