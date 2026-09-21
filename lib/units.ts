export type UnitPreference = "km" | "mi";

const KM_TO_MI = 0.621371;

/** All distances are stored in km. This only affects display. */
export function formatDistance(km: number, unit: UnitPreference): string {
  const value = unit === "mi" ? km * KM_TO_MI : km;
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded.toLocaleString()} ${unit}`;
}

export function convertKmTo(km: number, unit: UnitPreference): number {
  return unit === "mi" ? km * KM_TO_MI : km;
}

/** Inverse of convertKmTo — converts a value in the given unit back to km for storage. */
export function convertToKm(value: number, unit: UnitPreference): number {
  return unit === "mi" ? value / KM_TO_MI : value;
}
