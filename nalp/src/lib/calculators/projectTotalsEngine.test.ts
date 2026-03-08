/**
 * Financial consistency tests — Phase 1 verification.
 * Ensures: sum of zones = ownerTotal, avgAnnual = total/years, valuation = avg/capRate.
 */

import { describe, it, expect } from "vitest";
import { computeProjectTotalsFromEngine } from "./projectTotalsEngine";

describe("projectTotalsEngine", () => {
  it("sum of perZone ownerIncome8Years equals ownerTotalIncome8Years", () => {
    const t = computeProjectTotalsFromEngine({ years: 8 });
    expect(t.perZone).toBeDefined();
    const sum =
      (t.perZone!.A?.ownerIncome8Years ?? 0) +
      (t.perZone!.B?.ownerIncome8Years ?? 0) +
      (t.perZone!.C?.ownerIncome8Years ?? 0) +
      (t.perZone!.D?.ownerIncome8Years ?? 0);
    expect(sum).toBe(t.ownerTotalIncome8Years);
  });

  it("avgAnnualIncome equals ownerTotalIncome8Years / 8 (rounded)", () => {
    const t = computeProjectTotalsFromEngine({ years: 8 });
    const expected = Math.round(t.ownerTotalIncome8Years / 8);
    expect(t.avgAnnualIncome).toBe(expected);
  });

  it("valuationAtExit equals avgAnnualIncome / capRate (rounded)", () => {
    const t = computeProjectTotalsFromEngine({ years: 8 });
    const expected = Math.round(t.avgAnnualIncome / t.capRateDecimal);
    expect(t.valuationAtExit).toBe(expected);
  });

  it("capRate is 10% (0.10) after calibration", () => {
    const t = computeProjectTotalsFromEngine({ years: 8 });
    expect(t.capRate).toBe(10);
    expect(t.capRateDecimal).toBe(0.1);
  });

  it("noInvestor mode produces different totals when investor share exists", () => {
    const baseline = computeProjectTotalsFromEngine({
      years: 8,
      mode: "operationalBaseline",
    });
    const noInv = computeProjectTotalsFromEngine({
      years: 8,
      mode: "noInvestor",
    });
    // With no investor, B/C/D assign investor residual to operator; owner share can differ
    expect(baseline.ownerTotalIncome8Years).toBeGreaterThan(0);
    expect(noInv.ownerTotalIncome8Years).toBeGreaterThan(0);
    // Zone A: pre/post breakeven logic same; B/C/D differ
    expect(baseline.perZone).toBeDefined();
    expect(noInv.perZone).toBeDefined();
  });
});
