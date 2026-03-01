import type { ZoneDimensions } from "@/lib/nalpLandSketch";

const ZONE_COLORS: Record<string, string> = {
  a: "#6366f1",
  b: "#10b981",
  c: "#f59e0b",
  d: "#8b5cf6",
};

/**
 * تخطيط المنطقة ج: مبنى شرقي 7م فقط، والباقي وسطية 14م ظهر لظهر — المبنى الغربي وسطي يطل جزءه على
 * المواقف وجزءه على ساحة الإيواء. بين المبنى الشرقي وساحة الإيواء = مواقف.
 */
export interface ZoneCLayout {
  eastBuildingWidthM: number; // 7 — مبنى شرقي وحيد يطل شرقاً
  middleBuildingWidthM: number; // 14 — كل المباني الباقية وسطية ظهر لظهر
  parkingWidthM: number;
}

/**
 * تخطيط المنطقة د: ثلاثة أقسام بخطوط منقطة — يمين (1)، يسار علوي (2)، يسار سفلي (3)
 */
export interface ZoneDSections {
  /** عرض القسم الأيمن (شرق) — الباقي يُقسّم عمودياً */
  rightWidthM: number;
  /** عمق القسم العلوي من النصف الأيسر */
  topDepthM: number;
  /** تسميات الاستخدام (اختياري) */
  section1Label?: string;
  section2Label?: string;
  section3Label?: string;
}

interface ZoneSketchProps {
  dims: ZoneDimensions;
  /** عدد المباني المتجاورة (يُقسّم العرض بالتساوي) — للإظهار البسيط */
  buildingCount?: number;
  /** تخطيط المنطقة ج: 7م طرفية، 14م وسطية، 22م مواقف — يحسب العدد تلقائياً */
  zoneCLayout?: ZoneCLayout;
  /** تخطيط المنطقة د: ثلاثة أقسام بخطوط منقطة */
  zoneDSections?: ZoneDSections;
}

/**
 * اسكتش يوضح أبعاد المنطقة وحدودها من الشرق والغرب والشمال والجنوب
 */
const STREET_WIDTH_M = 12.5;
const GATE_ROAD_WIDTH_M = 7;

/** يحسب المباني والمواقف: شرقي 7م، وسطية 14×14، مواقف 25م، والباقي مواقف بين مبنى 6 ومنطقة الإيواء */
function computeZoneCLayout(
  totalM: number,
  config: ZoneCLayout
): {
  buildings: { widthM: number; depthM: number }[];
  parkings: { widthM: number }[];
  /** متر طولي متبقي — مواقف بين مبنى 6 ومنطقة الإيواء */
  eastBoundaryParkingM: number;
} {
  const { eastBuildingWidthM, middleBuildingWidthM, parkingWidthM } = config;
  let used = eastBuildingWidthM;
  let middleCount = 0;
  while (
    used + parkingWidthM + middleBuildingWidthM + parkingWidthM + middleBuildingWidthM <=
    totalM
  ) {
    used += parkingWidthM + middleBuildingWidthM;
    middleCount++;
  }
  // الباقي = مواقف بين مبنى 6 ومنطقة الإيواء (كل المواقف 25م بين المباني)
  const eastBoundaryParkingM = Math.max(
    0,
    totalM - used - parkingWidthM - middleBuildingWidthM
  );
  const buildings: { widthM: number; depthM: number }[] = [
    { widthM: eastBuildingWidthM, depthM: eastBuildingWidthM },
    ...Array.from({ length: middleCount }, () => ({
      widthM: middleBuildingWidthM,
      depthM: middleBuildingWidthM,
    })),
    { widthM: middleBuildingWidthM, depthM: middleBuildingWidthM },
  ];
  const parkings = Array.from({ length: middleCount + 1 }, () => ({
    widthM: parkingWidthM,
  }));
  return { buildings, parkings, eastBoundaryParkingM };
}

export function ZoneSketch({
  dims,
  buildingCount,
  zoneCLayout,
  zoneDSections,
}: ZoneSketchProps) {
  const scale = 4;
  const w = dims.widthM * scale;
  const h = dims.depthM * scale;
  const useLargeLabels = zoneDSections != null && dims.id === "d";
  const streetH = STREET_WIDTH_M * scale;
  const pad = 70;
  const strokeW = 2;
  const totalH = h + streetH * 2;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <svg
        viewBox={`0 0 ${w + pad * 2} ${totalH + pad * 2}`}
        className="w-full max-h-[380px]"
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
          </marker>
        </defs>
        <g transform={`translate(${pad}, ${pad})`}>
          {/* المستطيل الرئيسي للمنطقة */}
          <rect
            x={0}
            y={0}
            width={w}
            height={h}
            fill={ZONE_COLORS[dims.id]}
            fillOpacity={0.3}
            stroke={ZONE_COLORS[dims.id]}
            strokeWidth={strokeW}
          />
          {/* تخطيط المنطقة ج: طرفية 7م، وسطية 14م ظهر لظهر، مواقف 22م */}
          {zoneCLayout != null &&
            (() => {
              const { buildings, parkings, eastBoundaryParkingM } = computeZoneCLayout(
                dims.widthM,
                zoneCLayout
              );
              const el: JSX.Element[] = [];
              let x = 0;
              for (let i = 0; i < buildings.length; i++) {
                const b = buildings[i];
                const bW = b.widthM * scale;
                const bH = h;
                const bY = 0;
                const isMiddle = b.depthM === 14;
                el.push(
                  <g key={`b${i}`}>
                    <rect
                      x={x}
                      y={bY}
                      width={bW}
                      height={bH}
                      fill="#f59e0b"
                      fillOpacity={0.55}
                      stroke="#b45309"
                      strokeWidth={1.5}
                    />
                    {isMiddle && (
                      <line
                        x1={x + bW / 2}
                        y1={0}
                        x2={x + bW / 2}
                        y2={h}
                        stroke="#92400e"
                        strokeWidth={1}
                        strokeDasharray="3 3"
                      />
                    )}
                    <text
                      x={x + bW / 2}
                      y={bY + bH / 2 - 6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-800 text-sm font-bold"
                    >
                      {i + 1}
                    </text>
                    <text
                      x={x + bW / 2}
                      y={bY + bH / 2 + 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-700 text-xs font-semibold"
                    >
                      {b.depthM} م
                    </text>
                  </g>
                );
                x += bW;
                if (i < parkings.length) {
                  const pW = parkings[i].widthM * scale;
                  el.push(
                    <rect
                      key={`p${i}`}
                      x={x}
                      y={0}
                      width={pW}
                      height={h}
                      fill="#94a3b8"
                      fillOpacity={0.4}
                      stroke="#64748b"
                      strokeWidth={1}
                      strokeDasharray="3 2"
                    />
                  );
                  el.push(
                    <text
                      key={`pt${i}`}
                      x={x + pW / 2}
                      y={h / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-700 text-sm font-semibold"
                    >
                      مواقف {parkings[i].widthM} م
                    </text>
                  );
                  x += pW;
                }
              }
              if (eastBoundaryParkingM > 0) {
                const ebW = eastBoundaryParkingM * scale;
                el.push(
                  <rect
                    key="eastBoundary"
                    x={x}
                    y={0}
                    width={ebW}
                    height={h}
                    fill="#94a3b8"
                    fillOpacity={0.5}
                    stroke="#64748b"
                    strokeWidth={1}
                    strokeDasharray="3 2"
                  />
                );
                el.push(
                  <text
                    key="eastBoundaryLabel"
                    x={x + ebW / 2}
                    y={h / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-700 text-sm font-semibold"
                  >
                    مواقف {eastBoundaryParkingM} م
                  </text>
                );
              }
              return el;
            })()}
          {/* تخطيط المنطقة د: ثلاثة أقسام بخطوط منقطة */}
          {zoneDSections != null &&
            dims.id === "d" &&
            (() => {
              const { rightWidthM, topDepthM, section1Label, section2Label, section3Label } =
                zoneDSections;
              const leftWidthM = dims.widthM - rightWidthM;
              const bottomDepthM = dims.depthM - topDepthM;
              const leftW = leftWidthM * scale;
              const rightW = rightWidthM * scale;
              const topH = topDepthM * scale;
              const bottomH = bottomDepthM * scale;
              const divX = leftW;
              return (
                <>
                  <line
                    x1={divX}
                    y1={0}
                    x2={divX}
                    y2={h}
                    stroke="#6366f1"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                  />
                  <line
                    x1={0}
                    y1={topH}
                    x2={divX}
                    y2={topH}
                    stroke="#6366f1"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                  />
                  <text
                    x={divX + rightW / 2}
                    y={h / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-800 text-xl font-bold"
                  >
                    1
                  </text>
                  <text
                    x={divX + rightW / 2}
                    y={h / 2 + 18}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-700 text-sm font-semibold"
                  >
                    {rightWidthM}×{dims.depthM} م
                  </text>
                  {section1Label && (
                    <text
                      x={divX + rightW / 2}
                      y={h / 2 + 36}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-600 text-xs max-w-[95%]"
                    >
                      {section1Label}
                    </text>
                  )}
                  <text
                    x={leftW / 2}
                    y={topH / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-800 text-xl font-bold"
                  >
                    2
                  </text>
                  <text
                    x={leftW / 2}
                    y={topH / 2 + 18}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-700 text-sm font-semibold"
                  >
                    {leftWidthM}×{topDepthM} م
                  </text>
                  {section2Label && (
                    <text
                      x={leftW / 2}
                      y={topH / 2 + 36}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-600 text-xs max-w-[95%]"
                    >
                      {section2Label}
                    </text>
                  )}
                  <text
                    x={leftW / 2}
                    y={topH + bottomH / 2 - 28}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-800 text-xl font-bold"
                  >
                    3
                  </text>
                  <text
                    x={leftW / 2}
                    y={topH + bottomH / 2 - 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-700 text-sm font-semibold"
                  >
                    {leftWidthM}×{bottomDepthM} م
                  </text>
                  {section3Label && (
                    <text
                      x={leftW / 2}
                      y={topH + bottomH / 2 + 18}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-800 text-sm font-semibold"
                    >
                      {section3Label}
                    </text>
                  )}
                  <text
                    x={w / 2}
                    y={28}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-900 text-2xl font-bold uppercase tracking-wide"
                  >
                    المنطقة D
                  </text>
                </>
              );
            })()}
          {/* مباني متجاورة بسيطة (بدون تخطيط مواقف) */}
          {zoneCLayout == null &&
            zoneDSections == null &&
            buildingCount != null &&
            Array.from({ length: buildingCount }).map((_, i) => {
              const bw = w / buildingCount;
              const bx = i * bw;
              return (
                <g key={i}>
                  <rect
                    x={bx + 2}
                    y={2}
                    width={bw - 4}
                    height={h - 4}
                    fill="none"
                    stroke="#475569"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                  />
                  <text
                    x={bx + bw / 2}
                    y={h / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-600 text-sm font-bold"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          {/* بوابات المدخل والمخرج — المنطقة أ، عرض الطريق 7م */}
          {dims.id === "a" && (
            <g className="zone-a-gates">
              {(() => {
                const gw = GATE_ROAD_WIDTH_M * scale;
                const roadLen = 16;
                return (
                  <>
                    {/* مدخل — ملاصق للحد الشمالي لمنطقة أ */}
                    <rect x={w / 2 - gw / 2} y={0} width={gw} height={roadLen} fill="#dcfce7" fillOpacity={0.7} stroke="#22c55e" strokeWidth={2} />
                    <text x={w / 2} y={10} textAnchor="middle" className="fill-green-800 text-xs font-bold">مدخل 7م</text>
                    {/* مخرج — ملاصق لشارعنا 12.5 م ومحاذي لمنطقة ب (جنوب غرب) */}
                    <rect x={roadLen} y={h - roadLen} width={gw} height={roadLen} fill="#fef3c7" fillOpacity={0.7} stroke="#f59e0b" strokeWidth={2} />
                    <text x={roadLen + gw / 2} y={h - 8} textAnchor="middle" className="fill-amber-800 text-xs font-bold">مخرج 7م</text>
                  </>
                );
              })()}
            </g>
          )}
          {/* الشمال — طول الأرض 104 م ثم شمال */}
          <line x1={0} y1={0} x2={w} y2={0} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />
          <text
            x={w / 2}
            y={-4}
            textAnchor="middle"
            className={useLargeLabels ? "fill-slate-900 text-xl font-bold" : "fill-slate-800 text-base font-bold"}
          >
            شمال — {dims.widthM} م
          </text>
          <text
            x={w / 2}
            y={-24}
            textAnchor="middle"
            className={useLargeLabels ? "fill-slate-700 text-base font-semibold" : "fill-slate-500 text-sm"}
          >
            {dims.northBoundary}
          </text>
          {/* شريط شارعنا 12.5 م — ملاصق للمنطقة */}
          <rect
            x={0}
            y={h}
            width={w}
            height={streetH}
            fill="#475569"
            stroke="#334155"
            strokeWidth={1}
          />
          <text
            x={w / 2}
            y={h + streetH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-sm font-semibold"
          >
            شارعنا 12.5 م
          </text>
          {/* شريط شارع الجار 12.5 م — ملاصق لشارعنا */}
          <rect
            x={0}
            y={h + streetH}
            width={w}
            height={streetH}
            fill="#64748b"
            stroke="#475569"
            strokeWidth={1}
          />
          <text
            x={w / 2}
            y={h + streetH + streetH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-sm font-medium"
          >
            شارع الجار 12.5 م
          </text>
          {/* جنوب — فوق الحد الجنوبي بتباعد واضح عن الشوارع */}
          <line x1={0} y1={h} x2={w} y2={h} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />
          <text
            x={w / 2}
            y={h - 20}
            textAnchor="middle"
            className="fill-slate-600 text-xs font-medium"
          >
            جنوب — {dims.widthM} م
          </text>
          {/* الشرق — البعد والعنوان */}
          <line x1={w} y1={0} x2={w} y2={h} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />
          <text
            x={w + 16}
            y={h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className={
              useLargeLabels ? "fill-slate-900 text-xl font-bold" : "fill-slate-800 text-base font-bold"
            }
            transform={`rotate(90, ${w + 16}, ${h / 2})`}
          >
            {dims.depthM} م
          </text>
          <text
            x={w + (useLargeLabels ? 42 : 36)}
            y={h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className={
              useLargeLabels ? "fill-slate-700 text-base font-semibold" : "fill-slate-600 text-sm font-medium"
            }
            transform={`rotate(90, ${w + (useLargeLabels ? 42 : 36)}, ${h / 2})`}
          >
            شرق
          </text>
          <text
            x={w + (useLargeLabels ? 58 : 48)}
            y={h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className={
              useLargeLabels
                ? "fill-slate-700 text-base font-semibold max-w-[100px]"
                : "fill-slate-500 text-sm max-w-[80px]"
            }
            transform={`rotate(90, ${w + (useLargeLabels ? 58 : 48)}, ${h / 2})`}
          >
            {dims.eastBoundary}
          </text>
          {/* الغرب */}
          <line x1={0} y1={0} x2={0} y2={h} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />
          <text
            x={-16}
            y={h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className={
              useLargeLabels ? "fill-slate-700 text-base font-semibold" : "fill-slate-600 text-sm font-medium"
            }
            transform={`rotate(-90, -16, ${h / 2})`}
          >
            غرب
          </text>
          <text
            x={useLargeLabels ? -42 : -36}
            y={h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className={
              useLargeLabels ? "fill-slate-700 text-base font-semibold" : "fill-slate-500 text-sm"
            }
            transform={`rotate(-90, ${useLargeLabels ? -42 : -36}, ${h / 2})`}
          >
            {dims.westBoundary}
          </text>
          {/* ملصق المنطقة والمساحة — يختفي عند عرض المباني أو أقسام المنطقة د */}
          {zoneCLayout == null &&
            buildingCount == null &&
            zoneDSections == null && (
            <>
              <text
                x={w / 2}
                y={h / 2 - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-800 text-2xl font-bold"
              >
                المنطقة {dims.id.toUpperCase()}
              </text>
              <text
                x={w / 2}
                y={h / 2 + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-600 text-xl font-semibold"
              >
                ≈{dims.areaM2.toLocaleString("ar-SA")} م²
              </text>
            </>
          )}
        </g>
      </svg>
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2">
        <p className="text-center text-sm text-slate-600">
          العرض (شرق–غرب): {dims.widthM} م | العمق (شمال–جنوب): {dims.depthM} م
          {zoneCLayout != null &&
            (() => {
              const { buildings, parkings } = computeZoneCLayout(dims.widthM, zoneCLayout);
              return (
                <>
                  {" "}
                  | {buildings.length} مباني، {parkings.length} مواقف
                </>
              );
            })()}
        </p>
      </div>
    </div>
  );
}
