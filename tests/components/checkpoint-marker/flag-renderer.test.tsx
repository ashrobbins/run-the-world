import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { renderFlagFill } from "@/components/checkpoint-marker/flag-renderer";
import { FLAGS } from "@/components/checkpoint-marker/flags";

function renderDef(def: (typeof FLAGS)[string]) {
  return render(<svg>{renderFlagFill(def)}</svg>).container.querySelector("svg")!;
}

describe("renderFlagFill", () => {
  it("renders horizontal bands as one rect per color", () => {
    const svg = renderDef(FLAGS.austria); // 3 equal horizontal bands
    expect(svg.querySelectorAll("rect")).toHaveLength(3);
  });

  it("renders vertical bands as one rect per color", () => {
    const svg = renderDef(FLAGS.france); // 3 equal vertical bands
    expect(svg.querySelectorAll("rect")).toHaveLength(3);
  });

  it("adds a circle emblem for flags with a dot", () => {
    const svg = renderDef(FLAGS.japan);
    expect(svg.querySelector("circle")).not.toBeNull();
  });

  it("omits the emblem circle for flags without a dot", () => {
    const svg = renderDef(FLAGS.austria);
    expect(svg.querySelector("circle")).toBeNull();
  });

  it("renders cross flags with a background rect and two cross bars", () => {
    const svg = renderDef(FLAGS.denmark);
    // 1 background + 2 cross bars (no inner cross for Denmark)
    expect(svg.querySelectorAll("rect")).toHaveLength(3);
  });

  it("renders nested cross flags (e.g. Norway) with an extra inner pair of bars", () => {
    const svg = renderDef(FLAGS.norway);
    // 1 background + 2 outer bars + 2 inner bars
    expect(svg.querySelectorAll("rect")).toHaveLength(5);
  });

  it("every bespoke flag renders without throwing", () => {
    for (const code of ["uk", "usa", "turkey", "australia", "singapore"] as const) {
      expect(() => renderDef(FLAGS[code])).not.toThrow();
    }
  });

  it("every entry in the flag table has valid 6-digit hex colors", () => {
    const hex = /^#[0-9A-Fa-f]{6}$/;
    for (const [code, def] of Object.entries(FLAGS)) {
      if (def.kind === "bands-horizontal" || def.kind === "bands-vertical") {
        for (const color of def.colors) {
          expect(color, `${code}: ${color}`).toMatch(hex);
        }
        if (def.dot) expect(def.dot.color, `${code} dot`).toMatch(hex);
      }
      if (def.kind === "cross") {
        expect(def.background, `${code} background`).toMatch(hex);
        expect(def.cross, `${code} cross`).toMatch(hex);
        if (def.inner) expect(def.inner, `${code} inner`).toMatch(hex);
      }
    }
  });

  it("every stops array matches colors.length + 1", () => {
    for (const [code, def] of Object.entries(FLAGS)) {
      if (
        (def.kind === "bands-horizontal" || def.kind === "bands-vertical") &&
        def.stops
      ) {
        expect(def.stops.length, code).toBe(def.colors.length + 1);
      }
    }
  });
});
