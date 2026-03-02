/**
 * ledgerEngine.ts — Operating Ledger Engine for Zone A
 * نسخة تدقيق: 2026-03
 * Monthly batches → rollups → break-even
 */

import { REQUIRED_CAPITAL } from "./financialCanon";

export type MonthKey = string;

export interface Batch {
  id: string;
  count: number;
  commission: number;
  note?: string;
}

export interface MonthlyLedger {
  month: MonthKey;
  batches: Batch[];
}

export interface LedgerState {
  zoneId: "A";
  schemaVersion: number;
  investmentAmount: number;
  requiredCapital: number;
  months: MonthlyLedger[];
}

export interface MonthSummary {
  month: MonthKey;
  totalCars: number;
  gross: number;
  landCut100: number;
  opex: number;
  profitAfterOpex: number;
  landOwnerShare50: number;
  operatorProfit: number;
  investorProfit: number;
  operatorNetAfterInvestor: number;
  cumulativeInvestorProfit: number;
  isPostBreakeven: boolean;
}

export interface LedgerSummary {
  perMonth: MonthSummary[];
  quarterly: Record<"Q1" | "Q2" | "Q3" | "Q4", { totalCars: number; gross: number; opex: number; profitAfterOpex: number; landOwnerShare50: number; operatorProfit: number; investorProfit: number }>;
  yearly: { totalCars: number; gross: number; opex: number; profitAfterOpex: number; landOwnerShare50: number; operatorProfit: number; investorProfit: number };
  breakEvenMonth: MonthKey | null;
}

const OPEX_CAP = 0.25;
const LAND_CUT_PER_CAR = 100;
const LAND_OWNER_POST_SHARE = 0.5;

export function computeZoneALedgerSummary(state: LedgerState): LedgerSummary {
  const { investmentAmount, requiredCapital } = state;
  const months = Array.isArray(state.months) ? state.months : [];
  const fundingRatio = requiredCapital > 0 ? Math.min(investmentAmount / requiredCapital, 1) : 0;
  const investorShareOfOperator = 0.5 * fundingRatio;

  const sorted = [...months].sort((a, b) => a.month.localeCompare(b.month));
  let cumulativeInvestorProfit = 0;
  let breakEvenMonth: MonthKey | null = null;
  const perMonth: MonthSummary[] = [];

  const createQ = () => ({ totalCars: 0, gross: 0, opex: 0, profitAfterOpex: 0, landOwnerShare50: 0, operatorProfit: 0, investorProfit: 0 });
  const q1 = createQ(), q2 = createQ(), q3 = createQ(), q4 = createQ(), yearly = createQ();

  for (const m of sorted) {
    const batches = Array.isArray(m.batches) ? m.batches : [];
    const totalCars = batches.reduce((s, b) => s + (b?.count ?? 0), 0);
    const gross = batches.reduce((s, b) => s + (b?.count ?? 0) * (b?.commission ?? 0), 0);

    const isPreBreakeven = cumulativeInvestorProfit < investmentAmount;
    const landCut100 = isPreBreakeven ? LAND_CUT_PER_CAR * totalCars : 0;
    const operatingIncome = gross - landCut100;
    const opex = operatingIncome * OPEX_CAP;
    const profitAfterOpex = operatingIncome - opex;

    const isPostBreakevenNow = cumulativeInvestorProfit >= investmentAmount;
    const landOwnerShare50 = isPostBreakevenNow ? profitAfterOpex * LAND_OWNER_POST_SHARE : 0;
    const operatorProfit = profitAfterOpex - landOwnerShare50;
    const investorProfit = operatorProfit * investorShareOfOperator;
    const operatorNetAfterInvestor = operatorProfit - investorProfit;

    cumulativeInvestorProfit += investorProfit;
    if (breakEvenMonth === null && cumulativeInvestorProfit >= investmentAmount) {
      breakEvenMonth = m.month;
    }
    const isPostBreakeven = breakEvenMonth !== null && m.month > breakEvenMonth;

    perMonth.push({
      month: m.month,
      totalCars,
      gross,
      landCut100,
      opex,
      profitAfterOpex,
      landOwnerShare50,
      operatorProfit,
      investorProfit,
      operatorNetAfterInvestor,
      cumulativeInvestorProfit,
      isPostBreakeven,
    });

    const addTo = (q: typeof q1) => {
      q.totalCars += totalCars;
      q.gross += gross;
      q.opex += opex;
      q.profitAfterOpex += profitAfterOpex;
      q.landOwnerShare50 += landOwnerShare50;
      q.operatorProfit += operatorProfit;
      q.investorProfit += investorProfit;
    };
    addTo(yearly);
    const [, mm] = m.month.split("-");
    const monthNum = parseInt(mm, 10);
    if (monthNum <= 3) addTo(q1);
    else if (monthNum <= 6) addTo(q2);
    else if (monthNum <= 9) addTo(q3);
    else addTo(q4);
  }

  return {
    perMonth,
    quarterly: { Q1: q1, Q2: q2, Q3: q3, Q4: q4 },
    yearly,
    breakEvenMonth,
  };
}
