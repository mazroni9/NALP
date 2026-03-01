/**
 * ledgerEngine.ts — Operating Ledger Engine for Zone A
 * Monthly batches → rollups → break-even
 */

export type ZoneId = "A" | "B" | "C" | "D";
export type MonthKey = string; // "YYYY-MM"

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
  quarterly: {
    Q1: { totalCars: number; gross: number; opex: number; profitAfterOpex: number; landOwnerShare50: number; operatorProfit: number; investorProfit: number };
    Q2: { totalCars: number; gross: number; opex: number; profitAfterOpex: number; landOwnerShare50: number; operatorProfit: number; investorProfit: number };
    Q3: { totalCars: number; gross: number; opex: number; profitAfterOpex: number; landOwnerShare50: number; operatorProfit: number; investorProfit: number };
    Q4: { totalCars: number; gross: number; opex: number; profitAfterOpex: number; landOwnerShare50: number; operatorProfit: number; investorProfit: number };
  };
  yearly: {
    totalCars: number;
    gross: number;
    opex: number;
    profitAfterOpex: number;
    landOwnerShare50: number;
    operatorProfit: number;
    investorProfit: number;
  };
  breakEvenMonth: MonthKey | null;
}

const OPEX_CAP = 0.25;
const LAND_CUT_PER_CAR = 100;
const LAND_OWNER_POST_SHARE = 0.5;

function createEmptyQuarter() {
  return {
    totalCars: 0,
    gross: 0,
    opex: 0,
    profitAfterOpex: 0,
    landOwnerShare50: 0,
    operatorProfit: 0,
    investorProfit: 0,
  };
}

export function computeZoneALedgerSummary(state: LedgerState): LedgerSummary {
  const { investmentAmount, requiredCapital, months } = state;
  const fundingRatio =
    requiredCapital > 0 ? Math.min(investmentAmount / requiredCapital, 1) : 0;
  const investorShareOfOperator = 0.5 * fundingRatio;

  const sorted = [...months].sort((a, b) => a.month.localeCompare(b.month));
  let cumulativeInvestorProfit = 0;
  let breakEvenMonth: MonthKey | null = null;
  const perMonth: MonthSummary[] = [];

  const q1: ReturnType<typeof createEmptyQuarter> = createEmptyQuarter();
  const q2 = createEmptyQuarter();
  const q3 = createEmptyQuarter();
  const q4 = createEmptyQuarter();
  const yearly = createEmptyQuarter();

  for (const m of sorted) {
    const totalCars = m.batches.reduce((s, b) => s + b.count, 0);
    const gross = m.batches.reduce((s, b) => s + b.count * b.commission, 0);

    const isPreBreakeven = cumulativeInvestorProfit < investmentAmount;
    const landCut100 = isPreBreakeven ? LAND_CUT_PER_CAR * totalCars : 0;
    const operatingIncome = gross - landCut100;
    const opex = operatingIncome * OPEX_CAP;
    const profitAfterOpex = operatingIncome - opex;

    const isPostBreakevenNow = cumulativeInvestorProfit >= investmentAmount;
    const landOwnerShare50 = isPostBreakevenNow
      ? profitAfterOpex * LAND_OWNER_POST_SHARE
      : 0;
    const operatorProfit = profitAfterOpex - landOwnerShare50;
    const investorProfit = operatorProfit * investorShareOfOperator;
    const operatorNetAfterInvestor = operatorProfit - investorProfit;

    cumulativeInvestorProfit += investorProfit;
    if (breakEvenMonth === null && cumulativeInvestorProfit >= investmentAmount) {
      breakEvenMonth = m.month;
    }
    const isPostBreakeven = breakEvenMonth !== null && m.month > breakEvenMonth;

    const summary: MonthSummary = {
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
    };
    perMonth.push(summary);

    const [, mm] = m.month.split("-");
    const monthNum = parseInt(mm, 10);
    const addToQ = (q: typeof q1) => {
      q.totalCars += totalCars;
      q.gross += gross;
      q.opex += opex;
      q.profitAfterOpex += profitAfterOpex;
      q.landOwnerShare50 += landOwnerShare50;
      q.operatorProfit += operatorProfit;
      q.investorProfit += investorProfit;
    };
    addToQ(yearly);
    if (monthNum <= 3) addToQ(q1);
    else if (monthNum <= 6) addToQ(q2);
    else if (monthNum <= 9) addToQ(q3);
    else addToQ(q4);
  }

  return {
    perMonth,
    quarterly: { Q1: q1, Q2: q2, Q3: q3, Q4: q4 },
    yearly,
    breakEvenMonth,
  };
}

export const LEDGER_STORAGE_KEY = "NALP_ZONE_A_LEDGER_V1";

export function getDefaultLedgerState(
  investmentAmount: number,
  requiredCapital: number
): LedgerState {
  const y = new Date().getFullYear();
  const months: MonthlyLedger[] = [];
  for (let m = 1; m <= 12; m++) {
    const mm = m < 10 ? `0${m}` : String(m);
    months.push({ month: `${y}-${mm}`, batches: [] });
  }
  return {
    zoneId: "A",
    investmentAmount,
    requiredCapital,
    months,
  };
}

export function generateBatchId(): string {
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
