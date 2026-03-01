/**
 * financialCanon.ts — المصدر الوحيد للحقيقة المالية (Single Source of Truth)
 * تستورد منه صفحات financials / investors / scenarios
 */

export const CAP_RATE = 0.09; // 9%

// ─── LAND ─────────────────────────────────────────────────────────────────
export const LAND = {
  totalArea: 33_800,
  streetDeduction: 6_500,
  netDevelopableArea: 27_300,
  streetWidth: 12.5,
  landLength: 520,
  landWidth: 65,
  note:
    "المساحة الصافية محسوبة بعد احتساب استقطاع شارع مستقبلي بعرض 12.5 م في امتداد 520 م — لم يُعتمد رسمياً بعد",
};

// ─── ZONE A YEARLY MODEL (Waterfall: OPEX cap 25%, landowner 50% post-breakeven) ─
export const ZONE_A_YEARLY_MODEL = {
  carsPerDay: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50] as const,
  avgCommissionPerCar: [500, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200] as const,
  landOwnerCutPerCarYear1: 100,
  opexCapPercent: 25,
  daysPerYear: 365,
  landOwnerPostBreakevenSharePercent: 50,
};

// ─── ZONE RAW DATA (كما في projectData) ────────────────────────────────────
export const ZONE_A_RAW = {
  name: "Zone-A — المزاد",
  revenue8Years: 33_397_500,
  opexPercent: 30,
  netRevenue8Years: 23_378_250,
  ownerIncome8Years: 11_689_125,
  risk: "متوسط",
};

export const ZONE_B_RAW = {
  name: "Zone-B — المواقف",
  annualRevenue: 2_299_500,
  opexFixed: 100_000,
  ownerIncome8Years: 8_798_000,
  risk: "منخفض",
};

export const ZONE_C_RAW = {
  name: "Zone-C — السكن",
  totalRooms: 198,
  occupancyDefault: 80,
  avgRoomPrice: 1325,
  opexPercent: 10,
  annualRevenue: 2_518_560,
  capex: 5_171_600,
  ownerIncome8Years: 6_800_000,
  risk: "منخفض–متوسط",
};

export const ZONE_D_RAW = {
  name: "Zone-D — مركز الخدمات المتكاملة (شراكة استثمارية)",
  model: "شراكة استثمارية",
  constructionCost: 2_500_000,
  monthlyRevenue: 675_000,
  annualRevenue: 8_100_000,
  opexPercent: 15,
  adminCostCap: 10,
  netAnnualRevenue: 6_885_000,
  preBreakevenSharePercent: 10,
  postBreakevenSharePercent: 50,
  partnershipYears: 10,
  breakevenMonths: 3.6,
  ownerIncomePreBreakeven: 206_550,
  ownerIncomePostBreakeven8Years: 26_508_750,
  ownerIncome8Years: 26_715_300,
  risk: "متوسط — شراكة استثمارية",
};

// ─── DERIVED ZONE OPERATIONAL DATA ─────────────────────────────────────────
export interface ZoneOperational {
  id: "A" | "B" | "C" | "D";
  name: string;
  annualRevenue: number;
  opexPercent: number;
  opexFixed: number;
  netAnnual: number;
  zoneValuation: number;
  risk: string;
}

const zoneA: ZoneOperational = {
  id: "A",
  name: ZONE_A_RAW.name,
  annualRevenue: ZONE_A_RAW.revenue8Years / 8,
  opexPercent: ZONE_A_RAW.opexPercent,
  opexFixed: 0,
  netAnnual:
    (ZONE_A_RAW.revenue8Years / 8) *
    (1 - ZONE_A_RAW.opexPercent / 100),
  zoneValuation: Math.round(
    (ZONE_A_RAW.revenue8Years / 8) *
      (1 - ZONE_A_RAW.opexPercent / 100) /
      CAP_RATE
  ),
  risk: ZONE_A_RAW.risk,
};

const zoneB: ZoneOperational = {
  id: "B",
  name: ZONE_B_RAW.name,
  annualRevenue: ZONE_B_RAW.annualRevenue,
  opexPercent: 0,
  opexFixed: ZONE_B_RAW.opexFixed,
  netAnnual: ZONE_B_RAW.annualRevenue - ZONE_B_RAW.opexFixed,
  zoneValuation: Math.round(
    (ZONE_B_RAW.annualRevenue - ZONE_B_RAW.opexFixed) / CAP_RATE
  ),
  risk: ZONE_B_RAW.risk,
};

const zoneC: ZoneOperational = {
  id: "C",
  name: ZONE_C_RAW.name,
  annualRevenue: ZONE_C_RAW.annualRevenue,
  opexPercent: ZONE_C_RAW.opexPercent,
  opexFixed: 0,
  netAnnual:
    ZONE_C_RAW.annualRevenue * (1 - ZONE_C_RAW.opexPercent / 100),
  zoneValuation: Math.round(
    (ZONE_C_RAW.annualRevenue * (1 - ZONE_C_RAW.opexPercent / 100)) /
      CAP_RATE
  ),
  risk: ZONE_C_RAW.risk,
};

const zoneD: ZoneOperational = {
  id: "D",
  name: ZONE_D_RAW.name,
  annualRevenue: ZONE_D_RAW.annualRevenue,
  opexPercent: ZONE_D_RAW.opexPercent,
  opexFixed: 0,
  netAnnual: ZONE_D_RAW.netAnnualRevenue,
  zoneValuation: Math.round(ZONE_D_RAW.netAnnualRevenue / CAP_RATE),
  risk: ZONE_D_RAW.risk,
};

// ─── REQUIRED CAPITAL (مبالغ ثابتة إدارياً، غير مستمدة من capex/zoneValuation) ─
export type ZoneId = "A" | "B" | "C" | "D";
export const REQUIRED_CAPITAL: Record<ZoneId, number> = {
  A: 1_500_000,
  B: 500_000,
  C: 5_500_000,
  D: 2_500_000,
};

// Zone-D خاص: نسب توزيع قبل/بعد التعادل
export const ZONE_D_INVESTOR_SHARES = {
  investorSharePre: 1 - ZONE_D_RAW.preBreakevenSharePercent / 100,
  investorSharePost: ZONE_D_RAW.postBreakevenSharePercent / 100,
  breakevenMonths: ZONE_D_RAW.breakevenMonths,
};

export const ZONE_OPERATIONAL: Record<"A" | "B" | "C" | "D", ZoneOperational> =
  {
    A: zoneA,
    B: zoneB,
    C: zoneC,
    D: zoneD,
  };

// ─── ZONE OBJECTS (للتوافق مع imports الحالية) ────────────────────────────
export const ZONE_A = {
  ...ZONE_A_RAW,
  annualRevenue: zoneA.annualRevenue,
  netAnnual: zoneA.netAnnual,
  zoneValuation: zoneA.zoneValuation,
};

export const ZONE_B = {
  ...ZONE_B_RAW,
  opexPercent: 0,
  netAnnual: zoneB.netAnnual,
  zoneValuation: zoneB.zoneValuation,
};

export const ZONE_C = {
  ...ZONE_C_RAW,
  opexFixed: 0,
  netAnnual: zoneC.netAnnual,
  zoneValuation: zoneC.zoneValuation,
};

export const ZONE_D = {
  ...ZONE_D_RAW,
  opexFixed: 0,
  netAnnual: zoneD.netAnnual,
  zoneValuation: zoneD.zoneValuation,
  investorSharePre: ZONE_D_INVESTOR_SHARES.investorSharePre,
  investorSharePost: ZONE_D_INVESTOR_SHARES.investorSharePost,
};

// ─── PROJECT_TOTALS (ديناميكي بالكامل، بدون hard-coded) ───────────────────
const ownerTotalIncome8Years =
  ZONE_A_RAW.ownerIncome8Years +
  ZONE_B_RAW.ownerIncome8Years +
  ZONE_C_RAW.ownerIncome8Years +
  ZONE_D_RAW.ownerIncome8Years;

export const PROJECT_TOTALS = {
  ownerTotalIncome8Years,
  avgAnnualIncome: Math.round(ownerTotalIncome8Years / 8),
  capRate: 9,
  capRateDecimal: CAP_RATE,
  valuationAtExit: Math.round(
    Math.round(ownerTotalIncome8Years / 8) / CAP_RATE
  ),
  zonesCount: 4,
  partnershipYears: 10,
};
