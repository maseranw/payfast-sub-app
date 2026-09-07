import { describe, expect, it } from "vitest";
import {
  canCancel,
  canPause,
  canResume,
  getStatusBadgeConfig,
} from "./subscription-status";

describe("getStatusBadgeConfig", () => {
  it("returns a green badge for active", () => {
    expect(getStatusBadgeConfig("active")).toEqual({
      label: "Active",
      colorClassName: "text-green-600 dark:text-green-400",
    });
  });

  it("returns a red badge for paused", () => {
    expect(getStatusBadgeConfig("paused")).toEqual({
      label: "Paused",
      colorClassName: "text-red-600 dark:text-red-400",
    });
  });

  it("returns a red badge for pending", () => {
    expect(getStatusBadgeConfig("pending")).toEqual({
      label: "Pending",
      colorClassName: "text-red-600 dark:text-red-400",
    });
  });

  it("returns a red badge for cancelled", () => {
    expect(getStatusBadgeConfig("cancelled")).toEqual({
      label: "Cancelled",
      colorClassName: "text-red-600 dark:text-red-400",
    });
  });
});

describe("canPause", () => {
  it("is true only for active", () => {
    expect(canPause("active")).toBe(true);
    expect(canPause("paused")).toBe(false);
    expect(canPause("pending")).toBe(false);
    expect(canPause("cancelled")).toBe(false);
  });
});

describe("canResume", () => {
  it("is true only for paused", () => {
    expect(canResume("paused")).toBe(true);
    expect(canResume("active")).toBe(false);
    expect(canResume("pending")).toBe(false);
    expect(canResume("cancelled")).toBe(false);
  });
});

describe("canCancel", () => {
  it("is true for active and paused", () => {
    expect(canCancel("active")).toBe(true);
    expect(canCancel("paused")).toBe(true);
  });

  it("is false for pending and cancelled", () => {
    expect(canCancel("pending")).toBe(false);
    expect(canCancel("cancelled")).toBe(false);
  });
});
