/**
 * Central investment assumptions register — single source for all financial inputs.
 * Used by the engine and scenario layer (downside / base / upside).
 */

export type ConfidenceLevel = "low" | "medium" | "high";
export type SourceType = "measured" | "estimated" | "market-based" | "placeholder";

export interface Assumption<T = number | number[] | string> {
  key: string;
  value: T;
  unit: string;
  description: string;
  confidenceLevel: ConfidenceLevel;
  sourceType: SourceType;
}

// ─── Project-level assumptions ─────────────────────────────────────────────

export const PROJECT_ASSUMPTIONS: Assumption[] = [
  {
    key: "capRate",
    value: 0.10,
    unit: "decimal",
    description: "نسبة الرسملة المستخدمة لتقدير قيمة الخروج (exit valuation) — معايرة: 10% لـ base واقعي",
    confidenceLevel: "medium",
    sourceType: "market-based",
  },
  {
    key: "partnershipYears",
    value: 10,
    unit: "years",
    description: "سنوات الشراكة المرجعية للعرض والتقارير",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "projectionYearsDefault",
    value: 8,
    unit: "years",
    description: "عدد سنوات الإسقاط الافتراضي لحساب دخل الملاك",
    confidenceLevel: "high",
    sourceType: "estimated",
  },
  {
    key: "requiredCapitalA",
    value: 1_500_000,
    unit: "SAR",
    description: "رأس المال المطلوب لمنطقة أ (المزاد)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "requiredCapitalB",
    value: 500_000,
    unit: "SAR",
    description: "رأس المال المطلوب لمنطقة ب (المواقف)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "requiredCapitalC",
    value: 5_500_000,
    unit: "SAR",
    description: "رأس المال المطلوب لمنطقة ج (السكن)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "requiredCapitalD",
    value: 2_500_000,
    unit: "SAR",
    description: "رأس المال المطلوب لمنطقة د (مركز الخدمات)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "waterfallPreferredReturnRateDecimal",
    value: 0.1,
    unit: "decimal",
    description: "نسبة العائد المفضل للمستثمر (10%) في الشلال للمناطق ب/ج/د",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "waterfallResidualLand",
    value: 0.4,
    unit: "share",
    description: "حصة مالك الأرض من الربح المتبقي بعد استرداد رأس المال والعائد المفضل",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "waterfallResidualInvestor",
    value: 0.4,
    unit: "share",
    description: "حصة المستثمر من الربح المتبقي",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "waterfallResidualOperator",
    value: 0.2,
    unit: "share",
    description: "حصة المشغل من الربح المتبقي",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
];

// ─── Zone A assumptions ─────────────────────────────────────────────────────

export const ZONE_A_ASSUMPTIONS: Assumption[] = [
  {
    key: "carsPerDay",
    value: [4, 7, 12, 18, 24, 30, 36, 42, 48, 50],
    unit: "cars/day",
    description: "عدد السيارات المعروضة في المزاد يومياً لكل سنة (رامب-أب محافظ: سنوات 1–2 أدنى)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "avgCommissionPerCar",
    value: [450, 550, 750, 950, 1150, 1350, 1550, 1750, 1950, 2150],
    unit: "SAR",
    description: "متوسط العمولة المحصلة لكل سيارة مباعة لكل سنة (بداية محافظة ثم رامب)",
    confidenceLevel: "medium",
    sourceType: "market-based",
  },
  {
    key: "landOwnerCutPerCarPreBreakeven",
    value: 100,
    unit: "SAR",
    description: "حصة مالك الأرض لكل سيارة قبل التعادل (ما قبل استرداد رأس المال)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "opexCapPercent",
    value: 25,
    unit: "%",
    description: "الحد الأقصى لنسبة OPEX من إيراد التشغيل في منطقة أ",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "daysPerYear",
    value: 340,
    unit: "days",
    description: "أيام تشغيل المزاد سنوياً (محافظ: احتساب صيانة/مواسم)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "landOwnerPostBreakevenSharePercent",
    value: 50,
    unit: "%",
    description: "حصة مالك الأرض من الربح بعد التعادل (باقي 50% للمشغل/المستثمر)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
];

// ─── Zone B assumptions ─────────────────────────────────────────────────────

export const ZONE_B_ASSUMPTIONS: Assumption[] = [
  {
    key: "annualRevenue",
    value: 2_100_000,
    unit: "SAR/year",
    description: "الإيراد السنوي المتوقع لمنطقة المواقف (base محافظ: إشغال/سعر واقعيان)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "opexFixed",
    value: 100_000,
    unit: "SAR/year",
    description: "مصاريف تشغيل ثابتة سنوياً لمنطقة المواقف",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
];

// ─── Zone C assumptions ─────────────────────────────────────────────────────

export const ZONE_C_ASSUMPTIONS: Assumption[] = [
  {
    key: "totalRooms",
    value: 198,
    unit: "rooms",
    description: "إجمالي عدد الغرف السكنية",
    confidenceLevel: "high",
    sourceType: "measured",
  },
  {
    key: "occupancyDefault",
    value: 72,
    unit: "%",
    description: "نسبة الإشغال الافتراضية (base محافظ: دون افتراض ملء كامل من السنة الأولى)",
    confidenceLevel: "medium",
    sourceType: "market-based",
  },
  {
    key: "avgRoomPrice",
    value: 1325,
    unit: "SAR/month",
    description: "متوسط سعر إيجار الغرفة شهرياً",
    confidenceLevel: "medium",
    sourceType: "market-based",
  },
  {
    key: "opexPercent",
    value: 12,
    unit: "%",
    description: "نسبة المصاريف التشغيلية من الإيراد (معايرة: واقعي لسكن موظفين)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "capex",
    value: 5_171_600,
    unit: "SAR",
    description: "تقدير CAPEX — placeholder حتى دراسات مقاولات؛ لا يُعرض كرقم نهائي",
    confidenceLevel: "low",
    sourceType: "placeholder",
  },
];

// ─── Zone D assumptions ─────────────────────────────────────────────────────

export const ZONE_D_ASSUMPTIONS: Assumption[] = [
  {
    key: "constructionCost",
    value: 2_500_000,
    unit: "SAR",
    description: "تكلفة الإنشاء على المستثمر (مركز الخدمات)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "monthlyRevenue",
    value: 560_000,
    unit: "SAR/month",
    description: "الإيراد الشهري المتوقع لمركز الخدمات (base محافظ: مرحلة تشغيل/تأخير محتمل)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "annualRevenue",
    value: 6_720_000,
    unit: "SAR/year",
    description: "الإيراد السنوي (12 × monthlyRevenue)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "opexPercent",
    value: 15,
    unit: "%",
    description: "نسبة المصاريف التشغيلية من الإيراد",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "adminCostCap",
    value: 10,
    unit: "%",
    description: "الحد الأقصى لمصاريف الإدارة كنسبة من الإيراد",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "preBreakevenSharePercent",
    value: 10,
    unit: "%",
    description: "حصة مالك الأرض قبل التعادل (90% للمستثمر)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "postBreakevenSharePercent",
    value: 50,
    unit: "%",
    description: "حصة مالك الأرض بعد التعادل",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "partnershipYears",
    value: 10,
    unit: "years",
    description: "سنوات شراكة منطقة د",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
  {
    key: "breakevenMonths",
    value: 5.5,
    unit: "months",
    description: "تقدير أشهر التعادل (مرتبط بالإيراد والتكلفة — عرض تقديري، يحتاج تحقق سوقي)",
    confidenceLevel: "medium",
    sourceType: "estimated",
  },
];

/** Assumption keys that materially affect returns — show alert in UI when displaying Zone C. */
export const SENSITIVE_ASSUMPTION_KEYS_ZONE_C: string[] = [
  "occupancyDefault",
  "avgRoomPrice",
  "capex",
];

/** Assumption keys that materially affect returns — show alert in UI when displaying Zone D. */
export const SENSITIVE_ASSUMPTION_KEYS_ZONE_D: string[] = [
  "monthlyRevenue",
  "constructionCost",
  "opexPercent",
  "breakevenMonths",
];

export function getSensitiveAssumptionsForZone(
  zoneId: "C" | "D"
): Assumption[] {
  const list = zoneId === "C" ? ZONE_C_ASSUMPTIONS : ZONE_D_ASSUMPTIONS;
  const keys = zoneId === "C" ? SENSITIVE_ASSUMPTION_KEYS_ZONE_C : SENSITIVE_ASSUMPTION_KEYS_ZONE_D;
  return list.filter((a) => keys.includes(a.key));
}

// ─── Bundle type for engine consumption ─────────────────────────────────────

export interface AssumptionsBundle {
  project: {
    capRate: number;
    partnershipYears: number;
    projectionYearsDefault: number;
    requiredCapital: { A: number; B: number; C: number; D: number };
    waterfall: {
      preferredReturnRateDecimal: number;
      residualSplit: { land: number; investor: number; operator: number };
    };
  };
  zoneA: {
    carsPerDay: readonly number[];
    avgCommissionPerCar: readonly number[];
    landOwnerCutPerCarPreBreakeven: number;
    opexCapPercent: number;
    daysPerYear: number;
    landOwnerPostBreakevenSharePercent: number;
  };
  zoneB: { annualRevenue: number; opexFixed: number };
  zoneC: {
    totalRooms: number;
    occupancyDefault: number;
    avgRoomPrice: number;
    opexPercent: number;
    capex: number;
  };
  zoneD: {
    constructionCost: number;
    monthlyRevenue: number;
    annualRevenue: number;
    opexPercent: number;
    preBreakevenSharePercent: number;
    postBreakevenSharePercent: number;
    partnershipYears: number;
    breakevenMonths: number;
  };
}

function getProjectFromAssumptions(): AssumptionsBundle["project"] {
  const capRate = PROJECT_ASSUMPTIONS.find((a) => a.key === "capRate")!.value as number;
  const partnershipYears = PROJECT_ASSUMPTIONS.find((a) => a.key === "partnershipYears")!.value as number;
  const projectionYearsDefault = PROJECT_ASSUMPTIONS.find((a) => a.key === "projectionYearsDefault")!.value as number;
  return {
    capRate,
    partnershipYears,
    projectionYearsDefault,
    requiredCapital: {
      A: PROJECT_ASSUMPTIONS.find((a) => a.key === "requiredCapitalA")!.value as number,
      B: PROJECT_ASSUMPTIONS.find((a) => a.key === "requiredCapitalB")!.value as number,
      C: PROJECT_ASSUMPTIONS.find((a) => a.key === "requiredCapitalC")!.value as number,
      D: PROJECT_ASSUMPTIONS.find((a) => a.key === "requiredCapitalD")!.value as number,
    },
    waterfall: {
      preferredReturnRateDecimal: PROJECT_ASSUMPTIONS.find((a) => a.key === "waterfallPreferredReturnRateDecimal")!.value as number,
      residualSplit: {
        land: PROJECT_ASSUMPTIONS.find((a) => a.key === "waterfallResidualLand")!.value as number,
        investor: PROJECT_ASSUMPTIONS.find((a) => a.key === "waterfallResidualInvestor")!.value as number,
        operator: PROJECT_ASSUMPTIONS.find((a) => a.key === "waterfallResidualOperator")!.value as number,
      },
    },
  };
}

function getZoneAFromAssumptions(): AssumptionsBundle["zoneA"] {
  return {
    carsPerDay: ZONE_A_ASSUMPTIONS.find((a) => a.key === "carsPerDay")!.value as readonly number[],
    avgCommissionPerCar: ZONE_A_ASSUMPTIONS.find((a) => a.key === "avgCommissionPerCar")!.value as readonly number[],
    landOwnerCutPerCarPreBreakeven: ZONE_A_ASSUMPTIONS.find((a) => a.key === "landOwnerCutPerCarPreBreakeven")!.value as number,
    opexCapPercent: ZONE_A_ASSUMPTIONS.find((a) => a.key === "opexCapPercent")!.value as number,
    daysPerYear: ZONE_A_ASSUMPTIONS.find((a) => a.key === "daysPerYear")!.value as number,
    landOwnerPostBreakevenSharePercent: ZONE_A_ASSUMPTIONS.find((a) => a.key === "landOwnerPostBreakevenSharePercent")!.value as number,
  };
}

function getZoneBFromAssumptions(): AssumptionsBundle["zoneB"] {
  return {
    annualRevenue: ZONE_B_ASSUMPTIONS.find((a) => a.key === "annualRevenue")!.value as number,
    opexFixed: ZONE_B_ASSUMPTIONS.find((a) => a.key === "opexFixed")!.value as number,
  };
}

function getZoneCFromAssumptions(): AssumptionsBundle["zoneC"] {
  return {
    totalRooms: ZONE_C_ASSUMPTIONS.find((a) => a.key === "totalRooms")!.value as number,
    occupancyDefault: ZONE_C_ASSUMPTIONS.find((a) => a.key === "occupancyDefault")!.value as number,
    avgRoomPrice: ZONE_C_ASSUMPTIONS.find((a) => a.key === "avgRoomPrice")!.value as number,
    opexPercent: ZONE_C_ASSUMPTIONS.find((a) => a.key === "opexPercent")!.value as number,
    capex: ZONE_C_ASSUMPTIONS.find((a) => a.key === "capex")!.value as number,
  };
}

function getZoneDFromAssumptions(): AssumptionsBundle["zoneD"] {
  return {
    constructionCost: ZONE_D_ASSUMPTIONS.find((a) => a.key === "constructionCost")!.value as number,
    monthlyRevenue: ZONE_D_ASSUMPTIONS.find((a) => a.key === "monthlyRevenue")!.value as number,
    annualRevenue: ZONE_D_ASSUMPTIONS.find((a) => a.key === "annualRevenue")!.value as number,
    opexPercent: ZONE_D_ASSUMPTIONS.find((a) => a.key === "opexPercent")!.value as number,
    preBreakevenSharePercent: ZONE_D_ASSUMPTIONS.find((a) => a.key === "preBreakevenSharePercent")!.value as number,
    postBreakevenSharePercent: ZONE_D_ASSUMPTIONS.find((a) => a.key === "postBreakevenSharePercent")!.value as number,
    partnershipYears: ZONE_D_ASSUMPTIONS.find((a) => a.key === "partnershipYears")!.value as number,
    breakevenMonths: ZONE_D_ASSUMPTIONS.find((a) => a.key === "breakevenMonths")!.value as number,
  };
}

/**
 * Returns the default (base case) assumptions bundle for the engine.
 * Single source for all numeric inputs; used by getScenarioAssumptions("base") and by financialCanon wiring.
 */
export function getDefaultAssumptionsBundle(): AssumptionsBundle {
  return {
    project: getProjectFromAssumptions(),
    zoneA: getZoneAFromAssumptions(),
    zoneB: getZoneBFromAssumptions(),
    zoneC: getZoneCFromAssumptions(),
    zoneD: getZoneDFromAssumptions(),
  };
}
