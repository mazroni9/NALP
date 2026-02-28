export const LAND = {
  totalArea: 33800,
  streetDeduction: 6500,
  netDevelopableArea: 27300,
  streetWidth: 12.5,
  landLength: 520,
  landWidth: 65,
  note: "المساحة الصافية محسوبة بعد احتساب استقطاع شارع مستقبلي بعرض 12.5 م في امتداد 520 م — لم يُعتمد رسمياً بعد",
};

export const ZONE_A = {
  name: "Zone-A — المزاد",
  revenue8Years: 33397500,
  opexPercent: 30,
  netRevenue8Years: 23378250,
  ownerIncome8Years: 11689125,
  risk: "متوسط",
};

export const ZONE_B = {
  name: "Zone-B — المواقف",
  annualRevenue: 2299500,
  opexFixed: 100000,
  ownerIncome8Years: 8798000,
  risk: "منخفض",
};

export const ZONE_C = {
  name: "Zone-C — السكن",
  totalRooms: 198,
  occupancyDefault: 80,
  avgRoomPrice: 1325,
  opexPercent: 10,
  annualRevenue: 2518560,
  capex: 5171600,
  ownerIncome8Years: 6800000,
  risk: "منخفض–متوسط",
};

export const ZONE_D = {
  name: "Zone-D — مركز الخدمات المتكاملة (شراكة استثمارية)",
  model: "شراكة استثمارية",
  constructionCost: 2500000,
  monthlyRevenue: 675000,
  annualRevenue: 8100000,
  opexPercent: 15,
  adminCostCap: 10,
  netAnnualRevenue: 6885000,
  preBreakevenSharePercent: 10,
  postBreakevenSharePercent: 50,
  partnershipYears: 10,
  breakevenMonths: 3.6,
  ownerIncomePreBreakeven: 206550,
  ownerIncomePostBreakeven8Years: 26508750,
  ownerIncome8Years: 26715300,
  risk: "متوسط — شراكة استثمارية",
};

export const PROJECT_TOTALS = {
  ownerTotalIncome8Years:
    ZONE_A.ownerIncome8Years +
    ZONE_B.ownerIncome8Years +
    ZONE_C.ownerIncome8Years +
    ZONE_D.ownerIncome8Years,
  avgAnnualIncome: Math.round(54002425 / 8),
  capRate: 9,
  valuationAtExit: Math.round(6750303 / 0.09),
  zonesCount: 4,
  partnershipYears: 10,
};
