import { describe, expect, it } from "vitest";
import { encodePolyline } from "@/lib/polyline";

describe("encodePolyline", () => {
  it("matches Google's documented example encoding", () => {
    // https://developers.google.com/maps/documentation/utilities/polylinealgorithm
    const points = [
      { lat: 38.5, lng: -120.2 },
      { lat: 40.7, lng: -120.95 },
      { lat: 43.252, lng: -126.453 },
    ];
    expect(encodePolyline(points)).toBe("_p~iF~ps|U_ulLnnqC_mqNvxq`@");
  });

  it("returns an empty string for no points", () => {
    expect(encodePolyline([])).toBe("");
  });

  it("encodes a single point without a preceding delta", () => {
    const encoded = encodePolyline([{ lat: 0, lng: 0 }]);
    expect(encoded.length).toBeGreaterThan(0);
  });
});
