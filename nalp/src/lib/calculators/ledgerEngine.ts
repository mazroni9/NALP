/**
 * ledgerEngine.ts — Operating Ledger Engine for Zone A
 * Monthly batches → rollups → break-even
 */

import { REQUIRED_CAPITAL } from "@/lib/financialCanon";

export type ZoneId = "A" | "B" | "C" | "D";
export const LEDGER_SCHEMA_VERSION = 1;
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
  const { investmentAmount, requiredCapital } = state;
  const months = Array.isArray(state.months) ? state.months : [];
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
    const batches = Array.isArray(m.batches) ? m.batches : [];
    const totalCars = batches.reduce((s, b) => s + (b?.count ?? 0), 0);
    const gross = batches.reduce((s, b) => s + (b?.count ?? 0) * (b?.commission ?? 0), 0);

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
  return defaultLedgerState(investmentAmount, requiredCapital);
}

export function defaultLedgerState(
  investmentAmount: number = REQUIRED_CAPITAL.A,
  requiredCapital: number = REQUIRED_CAPITAL.A
): LedgerState {
  const y = new Date().getFullYear();
  const months: MonthlyLedger[] = [];
  for (let m = 1; m <= 12; m++) {
    const mm = m < 10 ? `0${m}` : String(m);
    months.push({ month: `${y}-${mm}`, batches: [] });
  }
  return {
    zoneId: "A",
    schemaVersion: LEDGER_SCHEMA_VERSION,
    investmentAmount,
    requiredCapital,
    months,
  };
}

/** Pure parse + migrate. Call with raw from safeReadStorage. JSON.parse in try/catch. */
export function parseLedgerFromRaw(
  raw: string | null,
  fallbackInvestment: number = REQUIRED_CAPITAL.A
): LedgerState {
  if (!raw) return defaultLedgerState(fallbackInvestment, REQUIRED_CAPITAL.A);
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return defaultLedgerState(fallbackInvestment, REQUIRED_CAPITAL.A);
    }

    const p = parsed as Record<string, unknown>;
    const months = p.months;
    const investmentAmount =
      typeof p.investmentAmount === "number"
        ? p.investmentAmount
        : fallbackInvestment;
    const requiredCapital =
      typeof p.requiredCapital === "number"
        ? p.requiredCapital
        : REQUIRED_CAPITAL.A;

    if (!Array.isArray(months) || months.length === 0) {
      return defaultLedgerState(investmentAmount, requiredCapital);
    }

    const hasValidMonthKeys = months.every(
      (m: unknown) =>
        m && typeof m === "object" && typeof (m as { month?: unknown }).month === "string"
    );
    if (!hasValidMonthKeys) {
      return defaultLedgerState(investmentAmount, requiredCapital);
    }

    const schemaVersion =
      typeof p.schemaVersion === "number" ? p.schemaVersion : 0;
    const migratedMonths = months.map(
      (m: { month?: string; batches?: unknown[] }, idx: number) => {
        const rawBatches = Array.isArray(m.batches) ? m.batches : [];
        const batches = rawBatches.map((b) => {
          const obj = b && typeof b === "object" ? (b as Record<string, unknown>) : {};
          return {
            id: typeof obj.id === "string" ? obj.id : generateBatchId(),
            count: typeof obj.count === "number" ? obj.count : 0,
            commission: typeof obj.commission === "number" ? obj.commission : 0,
            note: typeof obj.note === "string" ? obj.note : undefined,
          };
        });
        return {
          month: String(m.month ?? `${new Date().getFullYear()}-${String(idx + 1).padStart(2, "0")}`),
          batches,
        };
      }
    );

    return {
      zoneId: "A",
      schemaVersion: schemaVersion > 0 ? schemaVersion : LEDGER_SCHEMA_VERSION,
      investmentAmount,
      requiredCapital,
      months: migratedMonths,
    };
  } catch {
    return defaultLedgerState(fallbackInvestment, REQUIRED_CAPITAL.A);
  }
}

/**
 * Load ledger from storage. getItem must be called only from useEffect/handlers (e.g. safeReadStorage).
 */
export function loadLedgerFromStorage(
  fallbackInvestment: number = REQUIRED_CAPITAL.A,
  getItem: (key: string) => string | null
): LedgerState {
  const raw = getItem(LEDGER_STORAGE_KEY);
  return parseLedgerFromRaw(raw, fallbackInvestment);
}

export function generateBatchId(): string {
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
