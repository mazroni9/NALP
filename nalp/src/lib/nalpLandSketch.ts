/**
 * استكتش الأرض المرجعي لـ NALP
 * مصدر: صورة الخريطة + ملف PROMPT — Auto-Design Architectural Masterplan
 * الموقع: محور الظهران–الجبيل (طريق 613)
 *
 * الأبعاد من المستند (مطابقة للمخطط المرجعي):
 * - الطول: 520 م (شرق–غرب)
 * - العمق: 65 م (شمال–جنوب تقريبًا)
 * - إجمالي المساحة: ≈ 33,800 م²
 *
 * المناطق الأربع:
 * - أ: منطقة المزاد
 * - ب: منطقة إيواء المركبات
 * - ج: منطقة سكن الموظفين والمرافق
 * - د: منطقة استثمارية على الشارع الداخلي
 *
 * شارع مستقبلي داخلي:
 * - يمتد شرق–غرب بطول 520 م، عرض 12.5 م
 * - مساحة الشارع: 6,500 م² (تُخصم من المساحة الصافية عند التفعيل)
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
  /** نسب المناطق المقترحة (أ، ب، ج، د) — المجموع = 100% */
  zoneAPercent: number;
  zoneBPercent: number;
  zoneCPercent: number;
  zoneDPercent: number;
  zoneAAreaM2: number;
  zoneBAreaM2: number;
  zoneCAreaM2: number;
  zoneDAreaM2: number;
}

/** تعريف المناطق للنصوص في الاستوديو */
export interface ZoneConfig {
  id: "a" | "b" | "c" | "d";
  title: string;
  shortDesc: string;
  description: string;
}

/**
 * مضلع مستطيل مطابق للأبعاد الواردة في المستند:
 * 520 م × 65 م ≈ 33,800 م²
 */
const RECTANGLE_POINTS: [number, number][] = [
  [0, 0],
  [520, 0],
  [520, 65],
  [0, 65],
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
 * نقاط مترية تقارب الشكل الأفقي على محور الطريق (520 م × 65 م)
 */
const IRREGULAR_POINTS: [number, number][] = [
  [0, 0],
  [180, 0],
  [400, 15],
  [520, 50],
  [520, 65],
  [350, 65],
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

/** المساحة الصافية للمناطق بعد خصم الشارع الجنوبي (520 × 52.5) */
const NET_ZONE_AREA = 520 * 52.5; // 27,300

export const nalpLandSketch: LandSketch = {
  id: "nalp-ref-1",
  name: "قطعة NALP المرجعية — محور الظهران الجبيل",
  nameEn: "NALP Reference Parcel — Dhahran Jubail Corridor",
  description:
    "قطعة أرض على طريق الظهران الجبيل. إجمالي ≈ 33,800 م² (520 م شرق–غرب × 65 م). أربع مناطق بعمق 52.5 م (بعد خصم شارع 12.5 م جنوباً)، توزيع شرق–غرب: أ (المزاد)، ب (إيواء المركبات)، ج (سكن الموظفين والمرافق)، د (استثمارية على الشارع الداخلي 30 م).",
  sourceFile: "/PROMPT — Auto-Design Architectural Masterplan-برومبت معماري تخطيطي احترافي.docx",
  /** صورة الخريطة المصدر */
  mapImageUrl: "/nalp-land-sketch-map.png",
  totalAreaM2: Math.round(rectArea),
  gpsCoordinates: GPS_COORDS,
  polygonPointsMeters: RECTANGLE_POINTS,
  zoneAPercent: 20,
  zoneBPercent: 25,
  zoneCPercent: 40,
  zoneDPercent: 15,
  zoneAAreaM2: Math.round(NET_ZONE_AREA * 0.2),
  zoneBAreaM2: Math.round(NET_ZONE_AREA * 0.25),
  zoneCAreaM2: Math.round(NET_ZONE_AREA * 0.4),
  zoneDAreaM2: Math.round(NET_ZONE_AREA * 0.15),
};

/** شارع جنوبي: طول 520م شرق–غرب، عرض 12.5م (حصة المشروع) — ملاصق لشارع الجار 12.5م = 25م إجمالاً */
export const STREET_LENGTH_M = 520;
export const STREET_WIDTH_M = 12.5;
export const STREET_AREA_M2 = STREET_LENGTH_M * STREET_WIDTH_M; // 6500
/** شارع غربي داخلي بعرض 30م */
export const WEST_STREET_WIDTH_M = 30;

/** أبعاد المناطق — تخطيط شرق–غرب: أ|ب|ج|د، عمق جميع المناطق 52.5م (65 − 12.5) */
const LAND_LENGTH_M = 520;
const LAND_DEPTH_M = 65;
const NET_DEPTH_M = LAND_DEPTH_M - STREET_WIDTH_M; // 52.5

const totalP = 100;
const aWidth = LAND_LENGTH_M * (20 / totalP); // 104
const bWidth = LAND_LENGTH_M * (25 / totalP); // 130
const cWidth = LAND_LENGTH_M * (40 / totalP); // 208
const dWidth = LAND_LENGTH_M * (15 / totalP); // 78

const netZoneArea = LAND_LENGTH_M * NET_DEPTH_M; // 27,300

export interface ZoneDimensions {
  id: "a" | "b" | "c" | "d";
  /** العرض (شرق–غرب) بالمتر */
  widthM: number;
  /** العمق (شمال–جنوب) بالمتر */
  depthM: number;
  /** المساحة م² */
  areaM2: number;
  /** الحد الشمالي */
  northBoundary: string;
  /** الحد الجنوبي */
  southBoundary: string;
  /** الحد الشرقي */
  eastBoundary: string;
  /** الحد الغربي */
  westBoundary: string;
}

export const ZONE_DIMENSIONS: ZoneDimensions[] = [
  {
    id: "a",
    widthM: Math.round(aWidth * 10) / 10,
    depthM: NET_DEPTH_M,
    areaM2: Math.round(netZoneArea * 0.2),
    northBoundary: "الحلفاء للسيراميك (جار شمالي)",
    southBoundary: "شارع 12.5 م (حصة المشروع) — ملاصق لشارع الجار 12.5 م = 25 م إجمالاً",
    eastBoundary: "طريق الجبيل",
    westBoundary: "المنطقة ب (إيواء المركبات)",
  },
  {
    id: "b",
    widthM: Math.round(bWidth * 10) / 10,
    depthM: NET_DEPTH_M,
    areaM2: Math.round(netZoneArea * 0.25),
    northBoundary: "الحد الشمالي للقطعة",
    southBoundary: "شارع 12.5 م — ملاصق لشارع الجار 12.5 م = 25 م إجمالاً",
    eastBoundary: "المنطقة أ (المزاد)",
    westBoundary: "المنطقة ج (سكن الموظفين)",
  },
  {
    id: "c",
    widthM: Math.round(cWidth * 10) / 10,
    depthM: NET_DEPTH_M,
    areaM2: Math.round(netZoneArea * 0.4),
    northBoundary: "الحد الشمالي للقطعة",
    southBoundary: "شارع 12.5 م — ملاصق لشارع الجار 12.5 م = 25 م إجمالاً",
    eastBoundary: "المنطقة ب (إيواء المركبات)",
    westBoundary: "المنطقة د (استثمارية)",
  },
  {
    id: "d",
    widthM: Math.round(dWidth * 10) / 10,
    depthM: NET_DEPTH_M,
    areaM2: Math.round(netZoneArea * 0.15),
    northBoundary: "الحد الشمالي للقطعة",
    southBoundary: "شارع 12.5 م — ملاصق لشارع الجار 12.5 م = 25 م إجمالاً",
    eastBoundary: "المنطقة ج (سكن الموظفين)",
    westBoundary: "شارع داخلي بعرض 30 م",
  },
];

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
  zoneAAreaM2: Math.round(irregularArea * 0.2),
  zoneBAreaM2: Math.round(irregularArea * 0.25),
  zoneCAreaM2: Math.round(irregularArea * 0.4),
  zoneDAreaM2: Math.round(irregularArea * 0.15),
};

/** نصوص المناطق للاستوديو */
export const ZONE_CONFIGS: ZoneConfig[] = [
  {
    id: "a",
    title: "منطقة المزاد",
    shortDesc: "واجهة المشروع النشطة على طريق الجبيل–الدمام، منصة المزاد ومنطقة العرض.",
    description:
      "منطقة المزاد تشكّل واجهة المشروع النشطة على طريق الجبيل–الدمام، وفيها منصة المزاد، منطقة العرض المباشر، ومسارات حركة الجمهور والمزايدين. تصميمها يركّز على وضوح المشهد، إبراز العلامة التجارية، وسهولة دخول السيارات المعروضة وخروجها.",
  },
  {
    id: "b",
    title: "منطقة إيواء المركبات",
    shortDesc: "تخزين السيارات قبل وبعد المزاد، مواقف وممرات شاحنات السحب.",
    description:
      "منطقة إيواء المركبات مخصّصة لتخزين السيارات قبل وبعد المزاد، مع تنظيم دقيق للمواقف ومسارات حركة شاحنات السحب. يتم توزيع المواقف في صفوف طولية بممرات مناسبة للمناورة، مع إمكانية تقسيم الساحة إلى بلوكات بحسب نوع السيارات أو حالة المركبات.",
  },
  {
    id: "c",
    title: "منطقة سكن الموظفين والمرافق",
    shortDesc: "الجزء الهادئ من الأرض، بيئة معيشية مريحة، مباني سكنية ومرافق مركزية.",
    description:
      "منطقة سكن الموظفين والمرافق تقع في الجزء الهادئ من الأرض، وتوفر بيئة معيشية مريحة للعاملين. تضم مباني سكنية حديثة بطابقين تحقق حوالي 198 غرفة بنمط استوديو، إضافة إلى مبنى خدمات مركزية يضم مقهى/مطعم صغير، ميني ماركت، ومغسلة، مع ساحات خضراء طولية وممرات مشاة.",
  },
  {
    id: "d",
    title: "منطقة استثمارية على الشارع الداخلي",
    shortDesc: "تطل على الشارع الداخلي المستقبلي، معارض فرعية وورش ومكاتب وتوسعات.",
    description:
      "المنطقة الاستثمارية تطل مباشرة على الشارع الداخلي المستقبلي، ومهيأة لاستيعاب أنشطة تجارية وتشغيلية مساندة مثل معارض فرعية، ورش متخصصة، مكاتب تشغيل، أو توسعات مستقبلية لساحة المزاد أو السكن. صُممت لتستفيد من واجهة الشارع وتعوّض جزءاً من المساحة المخصّصة للممر الداخلي.",
  },
];

/** صيغة النقاط للاستوديو (x,y; x,y; ...) */
export function getPointsStringForStudio(sketch: LandSketch): string {
  return sketch.polygonPointsMeters
    .map(([x, y]) => `${x},${y}`)
    .join("; ");
}
