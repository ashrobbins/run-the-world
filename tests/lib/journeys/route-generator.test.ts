import { describe, expect, it } from "vitest";
import { generateRouteOptions, targetCheckpointCount, type RoutePoint } from "@/lib/journeys/route-generator";

const LONDON: RoutePoint = { name: "London", countryCode: "uk", lat: 51.5074, lng: -0.1278 };
const PARIS: RoutePoint = { name: "Paris", countryCode: "france", lat: 48.8566, lng: 2.3522 };
// Deliberately far from any waypoint coverage and from each other, to exercise the
// no-coverage fallback (open ocean, south of the equator between continents).
const OCEAN_A: RoutePoint = { name: "Ocean A", countryCode: "uk", lat: -40, lng: -140 };
const OCEAN_B: RoutePoint = { name: "Ocean B", countryCode: "uk", lat: -45, lng: -160 };

describe("targetCheckpointCount", () => {
  it("scales sub-linearly with distance", () => {
    const shortTrip = targetCheckpointCount(460); // roughly London -> Paris scale
    const longTrip = targetCheckpointCount(12436); // roughly the seeded Winchester -> Sydney distance
    expect(shortTrip).toBeGreaterThanOrEqual(4);
    expect(shortTrip).toBeLessThanOrEqual(8);
    expect(longTrip).toBeGreaterThanOrEqual(18);
    expect(longTrip).toBeLessThanOrEqual(25);
    expect(longTrip).toBeGreaterThan(shortTrip);
  });

  it("never drops below the minimum or exceeds the cap", () => {
    expect(targetCheckpointCount(1)).toBeGreaterThanOrEqual(3);
    expect(targetCheckpointCount(1_000_000)).toBeLessThanOrEqual(40);
  });
});

describe("generateRouteOptions", () => {
  it("always starts and ends with the given points", () => {
    const options = generateRouteOptions(LONDON, PARIS);
    for (const option of options) {
      expect(option.waypoints[0]).toEqual(LONDON);
      expect(option.waypoints[option.waypoints.length - 1]).toEqual(PARIS);
    }
  });

  it("produces at least one option with real waypoint coverage nearby", () => {
    const options = generateRouteOptions(LONDON, PARIS);
    expect(options.length).toBeGreaterThanOrEqual(1);
    expect(options[0].totalDistanceKm).toBeGreaterThan(0);
  });

  it("falls back to a single direct route when no waypoints are nearby", () => {
    const options = generateRouteOptions(OCEAN_A, OCEAN_B);
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("The Direct Route");
    expect(options[0].waypoints).toEqual([OCEAN_A, OCEAN_B]);
  });

  it("assigns the Shortest badge to the option with the least total distance", () => {
    const options = generateRouteOptions(LONDON, PARIS);
    const withBadge = options.find((o) => o.badge === "Shortest");
    if (options.length > 1) {
      expect(withBadge).toBeDefined();
      const shortestActual = Math.min(...options.map((o) => o.totalDistanceKm));
      expect(withBadge!.totalDistanceKm).toBe(shortestActual);
    }
  });

  it("never assigns the same badge twice", () => {
    const options = generateRouteOptions(LONDON, PARIS);
    const badges = options.map((o) => o.badge).filter(Boolean);
    expect(new Set(badges).size).toBe(badges.length);
  });
});
