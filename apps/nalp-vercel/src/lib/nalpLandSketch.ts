/**
 * استكتش الأرض المرجعي لـ NALP
 * مصدر: صورة الخريطة + ملف PROMPT — Auto-Design Architectural Masterplan
 * الموقع: محور الظهران–الجبيل (طريق 613)
 *
 * الأبعاد من المستند:
 * - إجمالي المساحة: ~33,000 م²
 * - الطول: 520 م تقريباً | العرض: 66 م تقريباً
 * - المنطقة أ (إسكان): ~17,000 م²
 * - المنطقة ب (خدمات): ~16,000 م²
 */

export interface LandSketch {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  sourceFile: string;
  mapImageUrl?: string;
  totalAreaM2: number;
  /** إحداثيات GPS للرؤوس (اختياري) */
  gpsCoordinates?: [number, number][];
  /** نقاط المضلع بإحداثيات محلية (متر) - للاستوديو */
  polygonPointsMeters: [number, number][];
  /** نسب المناطق المقترحة */
  zoneAPercent: number;
  zoneBPercent: number;
  zoneAAreaM2: number;
  zoneBAreaM2: number;
}

/**
 * مضلع مستطيل تقريبي مطابق للأبعاد الواردة في المستند:
 * 500 م × 66 م ≈ 33,000 م²
 */
const RECTANGLE_POINTS: [number, number][] = [
  [0, 0],
  [500, 0],
  [500, 66],
  [0, 66],
];

/**
 * إحداثيات GPS من صورة الخريطة (قريبة من الركن الشمالي الشرقي والجنوبي):
 * - 26.47152502102996, 50.01574460417032
 * - 26.470735890924737, 50.0146398693323
 */
const GPS_COORDS: [number, number][] = [
  [26.47152502102996, 50.01574460417032],
  [26.470735890924737, 50.0146398693323],
];

/**
 * مضلع غير منتظم تقريبي (يُستنتج من شكل القطعة على الخريطة)
 * نقاط مترية تقارب الشكل الأفقي على محور الطريق
 */
const IRREGULAR_POINTS: [number, number][] = [
  [0, 0],
  [180, 0],
  [400, 15],
  [500, 50],
  [500, 66],
  [350, 66],
  [150, 55],
  [0, 30],
];

function polygonArea(points: [number, number][]): number {
  if (points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    sum += points[i][0] * points[j][1] - points[j][0] * points[i][1];
  }
  return Math.abs(sum) / 2;
}

const rectArea = polygonArea(RECTANGLE_POINTS);
const irregularArea = polygonArea(IRREGULAR_POINTS);

export const nalpLandSketch: LandSketch = {
  id: "nalp-ref-1",
  name: "قطعة NALP المرجعية — محور الظهران الجبيل",
  nameEn: "NALP Reference Parcel — Dhahran Jubail Corridor",
  description:
    "قطعة أرض على طريق الظهران الجبيل الفرعي/الغربي. إجمالي ~33,000 م²، تقسيم المنطقة أ (إسكان) ~17,000 م² والمنطقة ب (خدمات سيارات) ~16,000 م².",
  sourceFile: "/PROMPT — Auto-Design Architectural Masterplan-برومبت معماري تخطيطي احترافي.docx",
  /** صورة الخريطة المصدر */
  mapImageUrl: "/nalp-land-sketch-map.png",
  totalAreaM2: Math.round(rectArea),
  gpsCoordinates: GPS_COORDS,
  polygonPointsMeters: RECTANGLE_POINTS,
  zoneAPercent: 52,
  zoneBPercent: 48,
  zoneAAreaM2: 17000,
  zoneBAreaM2: 16000,
};

/**
 * استكتش بالمضلع غير المنتظم (تقريبي)
 */
export const nalpLandSketchIrregular: LandSketch = {
  ...nalpLandSketch,
  id: "nalp-ref-irregular",
  name: "قطعة NALP (شكل غير منتظم تقريبي)",
  nameEn: "NALP Parcel (Approximate Irregular Shape)",
  polygonPointsMeters: IRREGULAR_POINTS,
  totalAreaM2: Math.round(irregularArea),
  zoneAAreaM2: Math.round(irregularArea * 0.52),
  zoneBAreaM2: Math.round(irregularArea * 0.48),
};

/** صيغة النقاط للاستوديو (x,y; x,y; ...) */
export function getPointsStringForStudio(sketch: LandSketch): string {
  return sketch.polygonPointsMeters
    .map(([x, y]) => `${x},${y}`)
    .join("; ");
}
