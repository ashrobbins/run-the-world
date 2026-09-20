import type { LatLng } from "@/lib/geo";

/**
 * Google Polyline Algorithm encoder (the format Mapbox's Static Images API `path`
 * overlay expects). Precision 5, matching the standard/Mapbox default.
 * https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
export function encodePolyline(points: LatLng[]): string {
  let output = "";
  let prevLat = 0;
  let prevLng = 0;

  for (const { lat, lng } of points) {
    const latE5 = Math.round(lat * 1e5);
    const lngE5 = Math.round(lng * 1e5);
    output += encodeSignedNumber(latE5 - prevLat);
    output += encodeSignedNumber(lngE5 - prevLng);
    prevLat = latE5;
    prevLng = lngE5;
  }

  return output;
}

function encodeSignedNumber(num: number): string {
  let sgnNum = num << 1;
  if (num < 0) sgnNum = ~sgnNum;
  return encodeNumber(sgnNum);
}

function encodeNumber(num: number): string {
  let output = "";
  while (num >= 0x20) {
    output += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
    num >>= 5;
  }
  output += String.fromCharCode(num + 63);
  return output;
}
