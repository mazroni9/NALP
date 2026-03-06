import { computeProjectTotalsFromEngine } from "@/lib/calculators/projectTotalsEngine";
import { computeDistributionTimeline } from "@/lib/distributionTimeline";

export const ADMIN_PIN = "NALP-ADMIN-2026";

export const LAND_VALUATION = {
  salableArea: 25_350,
  pricePerMeter: 750,
  grossValue: 19_012_500,
  agentFeePercent: 2,
  netValueToOwners: 18_632_250,
  remainingAreaAfterProject: 22_646,
  pricePerMeterNow: 750,
  pricePerMeterYear1: 1_200,
  pricePerMeterYear4: 1_800,
  pricePerMeterYear8: 2_500,
};

const _engineTotals = computeProjectTotalsFromEngine({ years: 8 });
const _distribution = computeDistributionTimeline({ years: 8 });
const _TOTAL_DISTRIBUTABLE_8Y = _distribution.distributableByYear.reduce(
  (sum, v) => sum + v,
  0
);
const _AVG_DISTRIBUTABLE_ANNUAL = Math.round(
  _TOTAL_DISTRIBUTABLE_8Y / (_distribution.distributableByYear.length || 1)
);

export const COMPANY = {
  name: "شركة النابية للسيارات والخدمات اللوجستية المساهمة المقفلة",
  shortName: "NALP",
  totalIncome8Years: _engineTotals.ownerTotalIncome8Years,
  avgAnnualIncome: _engineTotals.avgAnnualIncome,
  valuationAtExit: _engineTotals.valuationAtExit,
  projectYears: 8,
  capRate: _engineTotals.capRate,
  totalShares: 10_000,
};

// أسماء حقيقية، 50/25/25%، 10,000 سهم، 41 شريك
const partnersRaw = [
  // ===== أبناء أحمد عتيق — 50% — 5,000 سهم =====
  { name: "ريحانة سعيد الزهراني", group: "أبناء أحمد عتيق", shares: 654, pct: 6.54 },
  { name: "محمد أحمد", group: "أبناء أحمد عتيق", shares: 435, pct: 4.35 },
  { name: "خضر أحمد", group: "أبناء أحمد عتيق", shares: 435, pct: 4.35 },
  { name: "يوسف أحمد", group: "أبناء أحمد عتيق", shares: 435, pct: 4.35 },
  { name: "عبدالله أحمد", group: "أبناء أحمد عتيق", shares: 435, pct: 4.35 },
  { name: "عبدالرحمن أحمد", group: "أبناء أحمد عتيق", shares: 435, pct: 4.35 },
  { name: "فارس أحمد", group: "أبناء أحمد عتيق", shares: 435, pct: 4.35 },
  { name: "سعدية أحمد", group: "أبناء أحمد عتيق", shares: 217, pct: 2.17 },
  { name: "نجمة أحمد", group: "أبناء أحمد عتيق", shares: 217, pct: 2.17 },
  { name: "مريم أحمد", group: "أبناء أحمد عتيق", shares: 217, pct: 2.17 },
  { name: "نورة أحمد", group: "أبناء أحمد عتيق", shares: 217, pct: 2.17 },
  { name: "خديجة أحمد", group: "أبناء أحمد عتيق", shares: 217, pct: 2.17 },
  { name: "مياء أحمد", group: "أبناء أحمد عتيق", shares: 217, pct: 2.17 },
  { name: "مها أحمد", group: "أبناء أحمد عتيق", shares: 217, pct: 2.17 },
  { name: "عهود أحمد", group: "أبناء أحمد عتيق", shares: 217, pct: 2.17 },
  // ===== أبناء عطية — 25% — 2,500 سهم =====
  { name: "عبدالرحمن عطية", group: "أبناء عطية", shares: 333, pct: 3.33 },
  { name: "محمد عطية", group: "أبناء عطية", shares: 333, pct: 3.33 },
  { name: "عبدالعزيز عطية", group: "أبناء عطية", shares: 333, pct: 3.33 },
  { name: "علي عطية", group: "أبناء عطية", shares: 334, pct: 3.34 },
  { name: "بدرية عطية", group: "أبناء عطية", shares: 167, pct: 1.67 },
  { name: "عزة عطية", group: "أبناء عطية", shares: 167, pct: 1.67 },
  { name: "خديجة عطية", group: "أبناء عطية", shares: 167, pct: 1.67 },
  { name: "جوهرة عطية", group: "أبناء عطية", shares: 167, pct: 1.67 },
  { name: "فوزية عطية", group: "أبناء عطية", shares: 167, pct: 1.67 },
  { name: "منى عطية", group: "أبناء عطية", shares: 167, pct: 1.67 },
  { name: "خلود عطية", group: "أبناء عطية", shares: 165, pct: 1.65 },
  // ===== أبناء عبدالرحمن — 25% — 2,500 سهم =====
  { name: "زهرة علي الزهراني", group: "أبناء عبدالرحمن", shares: 400, pct: 4.0 },
  { name: "علي عبدالرحمن", group: "أبناء عبدالرحمن", shares: 200, pct: 2.0 },
  { name: "عبدالله عبدالرحمن", group: "أبناء عبدالرحمن", shares: 200, pct: 2.0 },
  { name: "محمد عبدالرحمن", group: "أبناء عبدالرحمن", shares: 200, pct: 2.0 },
  { name: "عبدالمحسن عبدالرحمن", group: "أبناء عبدالرحمن", shares: 200, pct: 2.0 },
  { name: "أحمد عبدالرحمن", group: "أبناء عبدالرحمن", shares: 200, pct: 2.0 },
  { name: "عبداللاله عبدالرحمن", group: "أبناء عبدالرحمن", shares: 200, pct: 2.0 },
  { name: "فيصل عبدالرحمن", group: "أبناء عبدالرحمن", shares: 200, pct: 2.0 },
  { name: "رقية عبدالرحمن", group: "أبناء عبدالرحمن", shares: 100, pct: 1.0 },
  { name: "صباح عبدالرحمن", group: "أبناء عبدالرحمن", shares: 100, pct: 1.0 },
  { name: "نوف عبدالرحمن", group: "أبناء عبدالرحمن", shares: 100, pct: 1.0 },
  { name: "وفا عبدالرحمن", group: "أبناء عبدالرحمن", shares: 100, pct: 1.0 },
  { name: "مريم عبدالرحمن", group: "أبناء عبدالرحمن", shares: 100, pct: 1.0 },
  { name: "أسيا عبدالرحمن", group: "أبناء عبدالرحمن", shares: 100, pct: 1.0 },
  { name: "سارة عبدالرحمن", group: "أبناء عبدالرحمن", shares: 100, pct: 1.0 },
];

export const PARTNERS = partnersRaw.map((p, i) => ({
  ...p,
  id: `P${String(i + 1).padStart(2, "0")}`,
  pin: `P${String(i + 1).padStart(2, "0")}`,
  sharePercent: p.pct,
}));

export function calcPartnerData(p: (typeof PARTNERS)[0]) {
  const f = p.sharePercent / 100;
  const landArea = Math.round(22_646 * f);
  const income8Y = Math.round(_TOTAL_DISTRIBUTABLE_8Y * f);
  return {
    landValueNow: Math.round(landArea * 750),
    landAreaSqm: landArea,
    landValueCurrentPrice: Math.round(landArea * 750),
    landValueYear1: Math.round(landArea * 1_200),
    landValueYear4: Math.round(landArea * 1_800),
    landValueYear8: Math.round(landArea * 2_500),
    annualIncome: Math.round(_AVG_DISTRIBUTABLE_ANNUAL * f),
    totalIncome8Y: income8Y,
    totalWealthYear8: income8Y + Math.round(landArea * 2_500),
    saleValueNow: Math.round(18_632_250 * f * 0.65),
    shares: Math.round(10_000 * f),
    pricePerMeterNow: 750,
    pricePerMeterYear1: 1_200,
    pricePerMeterYear4: 1_800,
    pricePerMeterYear8: 2_500,
    landNote:
      "مساحة الأرض المتبقية محسوبة من إجمالي 22,646 م² بعد استقطاع الشارع المستقبلي وحصة المشروع",
  };
}
