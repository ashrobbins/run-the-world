import { describe, expect, it } from "vitest";
import { haversineDistanceKm, crossTrackDistanceKm, alongTrackFraction } from "@/lib/geo";

const LONDON = { lat: 51.5074, lng: -0.1278 };
const PARIS = { lat: 48.8566, lng: 2.3522 };
const NEW_YORK = { lat: 40.7128, lng: -74.006 };

describe("haversineDistanceKm", () => {
  it("matches the well-known London-Paris distance within a few km", () => {
    expect(haversineDistanceKm(LONDON, PARIS)).toBeGreaterThan(340);
    expect(haversineDistanceKm(LONDON, PARIS)).toBeLessThan(350);
  });

  it("is zero for a point and itself", () => {
    expect(haversineDistanceKm(LONDON, LONDON)).toBeCloseTo(0, 5);
  });

  it("is symmetric", () => {
    expect(haversineDistanceKm(LONDON, PARIS)).toBeCloseTo(haversineDistanceKm(PARIS, LONDON), 5);
  });
});

describe("crossTrackDistanceKm", () => {
  it("is ~0 for the midpoint of the path itself", () => {
    const midpoint = { lat: (LONDON.lat + PARIS.lat) / 2, lng: (LONDON.lng + PARIS.lng) / 2 };
    expect(crossTrackDistanceKm(midpoint, LONDON, PARIS)).toBeLessThan(5);
  });

  it("is large for a point far off the path", () => {
    expect(crossTrackDistanceKm(NEW_YORK, LONDON, PARIS)).toBeGreaterThan(500);
  });
});

describe("alongTrackFraction", () => {
  it("is ~0 at the start and ~1 at the end", () => {
    expect(alongTrackFraction(LONDON, LONDON, PARIS)).toBeCloseTo(0, 1);
    expect(alongTrackFraction(PARIS, LONDON, PARIS)).toBeCloseTo(1, 1);
  });

  it("is ~0.5 at the midpoint", () => {
    const midpoint = { lat: (LONDON.lat + PARIS.lat) / 2, lng: (LONDON.lng + PARIS.lng) / 2 };
    expect(alongTrackFraction(midpoint, LONDON, PARIS)).toBeGreaterThan(0.4);
    expect(alongTrackFraction(midpoint, LONDON, PARIS)).toBeLessThan(0.6);
  });
});
