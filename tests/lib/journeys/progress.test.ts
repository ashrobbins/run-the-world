import { describe, expect, it } from "vitest";
import { classifyCheckpoints, findNewlyCrossedCheckpoint } from "@/lib/journeys/progress";

const checkpoints = [
  { id: "a", name: "Winchester", distance_from_start: 0 },
  { id: "b", name: "Calais", distance_from_start: 184 },
  { id: "c", name: "Reims", distance_from_start: 309 },
  { id: "d", name: "Paris", distance_from_start: 523 },
  { id: "e", name: "Vienna", distance_from_start: 1562 },
];

describe("classifyCheckpoints", () => {
  it("marks checkpoints before current distance as reached, the first beyond as next, rest locked", () => {
    const result = classifyCheckpoints(checkpoints, 300);
    expect(result.map((c) => [c.name, c.state])).toEqual([
      ["Winchester", "reached"],
      ["Calais", "reached"],
      ["Reims", "next"],
      ["Paris", "locked"],
      ["Vienna", "locked"],
    ]);
  });

  it("marks every checkpoint reached once distance covers the whole journey", () => {
    const result = classifyCheckpoints(checkpoints, 2000);
    expect(result.every((c) => c.state === "reached")).toBe(true);
  });

  it("marks the very first checkpoint as next when no distance has been completed", () => {
    const result = classifyCheckpoints(checkpoints, -1);
    expect(result[0].state).toBe("next");
  });
});

describe("findNewlyCrossedCheckpoint", () => {
  it("returns the checkpoint crossed within the given distance range", () => {
    const crossed = findNewlyCrossedCheckpoint(checkpoints, 8.2, 300);
    expect(crossed?.name).toBe("Calais");
  });

  it("returns the furthest checkpoint when a sync crosses more than one", () => {
    const crossed = findNewlyCrossedCheckpoint(checkpoints, 0, 600);
    expect(crossed?.name).toBe("Paris");
  });

  it("returns null when no checkpoint was crossed", () => {
    const crossed = findNewlyCrossedCheckpoint(checkpoints, 10, 20);
    expect(crossed).toBeNull();
  });
});
