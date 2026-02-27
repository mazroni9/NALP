/**
 * حسابات مساحات المنطقة ج: المباني، المواقف، الطريق ٤م
 * للاستخدام في تقدير التكاليف
 */

const ZONE_C_CONFIG = {
  widthM: 208,
  depthM: 52.5,
  roadBehindM: 4,
  eastBuildingWidthM: 7,
  middleBuildingWidthM: 14,
  parkingWidthM: 25,
} as const;

const contentDepthM = ZONE_C_CONFIG.depthM - ZONE_C_CONFIG.roadBehindM; // 48.5

export interface BuildingArea {
  id: number;
  widthM: number;
  depthM: number;
  areaM2: number;
}

export interface ZoneCAreas {
  buildings: BuildingArea[];
  buildingsTotalM2: number;
  parkingsTotalM2: number;
  roadM2: number;
  zoneTotalM2: number;
}

/**
 * يحسب مساحات المنطقة ج مطابقاً للتخطيط الفعلي:
 * 6 مباني (7م + 5×14م)، 5 مواقف (4×25م + 6م حد شرقي)، طريق 4م
 */
export function computeZoneCAreas(): ZoneCAreas {
  const { widthM, eastBuildingWidthM, middleBuildingWidthM, parkingWidthM } =
    ZONE_C_CONFIG;

  const buildings: BuildingArea[] = [];
  buildings.push({
    id: 1,
    widthM: eastBuildingWidthM,
    depthM: contentDepthM,
    areaM2: Math.round(eastBuildingWidthM * contentDepthM * 10) / 10,
  });
  for (let i = 2; i <= 6; i++) {
    buildings.push({
      id: i,
      widthM: middleBuildingWidthM,
      depthM: contentDepthM,
      areaM2: Math.round(middleBuildingWidthM * contentDepthM * 10) / 10,
    });
  }

  const buildingsTotalM2 = buildings.reduce((s, b) => s + b.areaM2, 0);

  // المواقف: 5 ساحات بين المباني (5×25م) + حد شرقي 6م = 131م عرضاً
  const eastBoundaryParkingM = widthM - (7 + 5 * 25 + 5 * 14); // 208 - 202 = 6
  const parkingTotalWidthM = 5 * parkingWidthM + eastBoundaryParkingM; // 125 + 6 = 131
  const parkingsTotalM2 =
    Math.round(parkingTotalWidthM * contentDepthM * 10) / 10;

  const roadM2 = ZONE_C_CONFIG.roadBehindM * widthM;

  const zoneTotalM2 = widthM * ZONE_C_CONFIG.depthM;

  return {
    buildings,
    buildingsTotalM2: Math.round(buildingsTotalM2 * 10) / 10,
    parkingsTotalM2,
    roadM2,
    zoneTotalM2,
  };
}
