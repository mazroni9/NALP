import { describe, it, expect } from "vitest";
import { computeWaterfall3Layer } from "./waterfall";

const split = { land: 0.4, investor: 0.4, operator: 0.2 };
const preferredRate = 0.1;

describe("computeWaterfall3Layer", () => {
  it("profitAfterOpex = 0: all incomes zero", () => {
    const r = computeWaterfall3Layer({
      profitAfterOpex: 0,
      investmentAmount: 1_000_000,
      preferredReturnRateDecimal: preferredRate,
      residualSplit: split,
    });
    expect(r.landOwnerIncome).toBe(0);
    expect(r.investorIncome).toBe(0);
    expect(r.operatorIncome).toBe(0);
    expect(r.steps.every((s) => s.amount === 0)).toBe(true);
  });

  it("profitAfterOpex less than capital: only return of capital, no preferred or residual", () => {
    const investment = 1_000_000;
    const profit = 300_000;
    const r = computeWaterfall3Layer({
      profitAfterOpex: profit,
      investmentAmount: investment,
      preferredReturnRateDecimal: preferredRate,
      residualSplit: split,
    });
    expect(r.investorIncome).toBe(profit);
    expect(r.landOwnerIncome).toBe(0);
    expect(r.operatorIncome).toBe(0);
    const capStep = r.steps.find((s) => s.name === "Return of Capital");
    expect(capStep?.amount).toBe(profit);
  });

  it("profitAfterOpex covers capital + preferred + residual: full waterfall", () => {
    const investment = 1_000_000;
    const profit = 1_500_000; // 1M cap + 100k pref + 400k residual
    const r = computeWaterfall3Layer({
      profitAfterOpex: profit,
      investmentAmount: investment,
      preferredReturnRateDecimal: preferredRate,
      residualSplit: split,
    });
    const capStep = r.steps.find((s) => s.name === "Return of Capital");
    const prefStep = r.steps.find((s) => s.name === "Preferred Return");
    expect(capStep?.amount).toBe(1_000_000);
    expect(prefStep?.amount).toBe(100_000); // 10% of 1M
    const residual = profit - 1_000_000 - 100_000; // 400_000
    expect(r.landOwnerIncome).toBe(residual * 0.4);
    expect(r.operatorIncome).toBe(residual * 0.2);
    expect(r.investorIncome).toBe(1_000_000 + 100_000 + residual * 0.4);
    expect(r.landOwnerIncome + r.investorIncome + r.operatorIncome).toBe(profit);
  });
});
