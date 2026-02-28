export const FINANCIAL_CONSTANTS = {
  totalEightYearIncome: 34.6,
  averageAnnualIncome: 4.0,
  valuationMin: 43,
  valuationMax: 48,
  zoneCount: 4,
  agreementYears: 8,
} as const;

export const ZONE_REVENUE = [
  {
    id: "zone-a",
    name: "Zone-A",
    annualRevenue: 1.13,
    netOperating: 0.9,
    landlordEightYear: 9.0,
    riskType: "Low" as const,
  },
  {
    id: "zone-b",
    name: "Zone-B",
    annualRevenue: 1.1,
    netOperating: 0.88,
    landlordEightYear: 8.8,
    riskType: "Low" as const,
  },
  {
    id: "zone-c",
    name: "Zone-C",
    annualRevenue: 1.06,
    netOperating: 0.85,
    landlordEightYear: 8.5,
    riskType: "Moderate" as const,
  },
  {
    id: "zone-d",
    name: "Zone-D",
    annualRevenue: 1.04,
    netOperating: 0.83,
    landlordEightYear: 8.3,
    riskType: "Moderate" as const,
  },
];

export const PROJECTION_DATA = [
  { year: 1, income: 3.6 },
  { year: 2, income: 3.9 },
  { year: 3, income: 4.2 },
  { year: 4, income: 4.3 },
  { year: 5, income: 4.4 },
  { year: 6, income: 4.4 },
  { year: 7, income: 4.5 },
  { year: 8, income: 4.4 },
];

export const RISK_TABLE = [
  { zone: "Zone-A", type: "خدمات سيارات", risk: "Low", stability: "عالي" },
  { zone: "Zone-B", type: "تخزين", risk: "Low", stability: "عالي" },
  { zone: "Zone-C", type: "مختلط", risk: "Moderate", stability: "متوسط" },
  { zone: "Zone-D", type: "لوجستي", risk: "Moderate", stability: "متوسط" },
];
