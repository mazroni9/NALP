/**
 * Financial test suite — Phase 2.
 * Verifies: sum of zones = total, annual = total/years, valuation consistency,
 * no impossible negative outputs, scenario ordering (downside ≤ base ≤ upside).
 */

import { describe, it, expect } from "vitest";
import { computeProjectTotalsFromEngine } from "@/lib/calculators/projectTotalsEngine";
import { getDefaultAssumptionsBundle } from "./assumptions";
import { computeProjectMetrics, getScenarioAssumptions } from "./index";

const YEARS = 8;

describe("financial consistency", () => {
  it("sum of perZone ownerIncome8Years equals ownerTotalIncome8Years", () => {
    const t = computeProjectTotalsFromEngine({ years: YEARS });
    expect(t.perZone).toBeDefined();
    const sum =
      (t.perZone!.A?.ownerIncome8Years ?? 0) +
      (t.perZone!.B?.ownerIncome8Years ?? 0) +
      (t.perZone!.C?.ownerIncome8Years ?? 0) +
      (t.perZone!.D?.ownerIncome8Years ?? 0);
    expect(sum).toBe(t.ownerTotalIncome8Years);
  });

  it("avgAnnualIncome equals ownerTotalIncome8Years / years (rounded)", () => {
    const t = computeProjectTotalsFromEngine({ years: YEARS });
    const expected = Math.round(t.ownerTotalIncome8Years / YEARS);
    expect(t.avgAnnualIncome).toBe(expected);
  });

  it("valuation is internally consistent: valuationAtExit = avgAnnualIncome / capRate (rounded)", () => {
    const t = computeProjectTotalsFromEngine({ years: YEARS });
    const expected = Math.round(t.avgAnnualIncome / t.capRateDecimal);
    expect(t.valuationAtExit).toBe(expected);
  });

  it("no impossible negative outputs (default run)", () => {
    const t = computeProjectTotalsFromEngine({ years: YEARS });
    expect(t.ownerTotalIncome8Years).toBeGreaterThanOrEqual(0);
    expect(t.avgAnnualIncome).toBeGreaterThanOrEqual(0);
    expect(t.valuationAtExit).toBeGreaterThanOrEqual(0);
    expect(t.perZone).toBeDefined();
    for (const z of ["A", "B", "C", "D"] as const) {
      const zone = t.perZone![z];
      expect(zone.ownerIncome8Years).toBeGreaterThanOrEqual(0);
      expect(zone.avgAnnual).toBeGreaterThanOrEqual(0);
    }
  });

  it("engine with assumptions bundle produces same structure and no negatives", () => {
    const bundle = getDefaultAssumptionsBundle();
    const t = computeProjectTotalsFromEngine({
      years: YEARS,
      assumptions: bundle,
    });
    expect(t.ownerTotalIncome8Years).toBeGreaterThanOrEqual(0);
    expect(t.avgAnnualIncome).toBeGreaterThanOrEqual(0);
    expect(t.valuationAtExit).toBeGreaterThanOrEqual(0);
    const sum =
      (t.perZone!.A?.ownerIncome8Years ?? 0) +
      (t.perZone!.B?.ownerIncome8Years ?? 0) +
      (t.perZone!.C?.ownerIncome8Years ?? 0) +
      (t.perZone!.D?.ownerIncome8Years ?? 0);
    expect(sum).toBe(t.ownerTotalIncome8Years);
  });
});

describe("scenario ordering", () => {
  it("downside total ≤ base total ≤ upside total (ownerTotalIncome8Years)", () => {
    const down = computeProjectMetrics("downside", YEARS);
    const base = computeProjectMetrics("base", YEARS);
    const up = computeProjectMetrics("upside", YEARS);
    expect(down.ownerTotalIncome8Years).toBeLessThanOrEqual(base.ownerTotalIncome8Years);
    expect(base.ownerTotalIncome8Years).toBeLessThanOrEqual(up.ownerTotalIncome8Years);
  });

  it("downside valuation ≤ base valuation ≤ upside valuation (valuationAtExit)", () => {
    const down = computeProjectMetrics("downside", YEARS);
    const base = computeProjectMetrics("base", YEARS);
    const up = computeProjectMetrics("upside", YEARS);
    expect(down.valuationAtExit).toBeLessThanOrEqual(base.valuationAtExit);
    expect(base.valuationAtExit).toBeLessThanOrEqual(up.valuationAtExit);
  });

  it("scenario assumptions are distinct (base = calibrated, downside/upside differ)", () => {
    const base = getScenarioAssumptions("base");
    const down = getScenarioAssumptions("downside");
    const up = getScenarioAssumptions("upside");
    expect(base.project.capRate).toBe(0.10);
    expect(down.project.capRate).toBeGreaterThanOrEqual(0.10);
    expect(up.project.capRate).toBeLessThanOrEqual(0.10);
    expect(down.zoneB.annualRevenue).toBeLessThanOrEqual(base.zoneB.annualRevenue);
    expect(up.zoneB.annualRevenue).toBeGreaterThanOrEqual(base.zoneB.annualRevenue);
  });

  it("base scenario is not skewed toward upside (investor-defensible)", () => {
    const down = computeProjectMetrics("downside", YEARS);
    const base = computeProjectMetrics("base", YEARS);
    const up = computeProjectMetrics("upside", YEARS);
    const gapToDown = base.ownerTotalIncome8Years - down.ownerTotalIncome8Years;
    const gapToUp = up.ownerTotalIncome8Years - base.ownerTotalIncome8Years;
    expect(gapToDown).toBeGreaterThanOrEqual(gapToUp * 0.3);
  });
});
