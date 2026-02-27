"use client";

import { ZONE_DIMENSIONS, STREET_WIDTH_M } from "@/lib/nalpLandSketch";

const LAND_LENGTH_M = 520;

const ZONE_COLORS: Record<string, string> = {
  a: "#6366f1",
  b: "#10b981",
  c: "#f59e0b",
  d: "#8b5cf6",
};

const NET_DEPTH_M = 52.5;

/** يحسب المباني والمواقف للمنطقة ج */
function computeZoneCLayout(
  totalM: number,
  config: { eastBuildingWidthM: number; middleBuildingWidthM: number; parkingWidthM: number }
) {
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

/**
 * اسكتش يجمع المناطق الأربع (أ، ب، ج، د) في منظر واحد
 * شرق–غرب: أ (مزاد) | ب (إيواء) | ج (سكن) | د (استثمارية)
 */
export function AllZonesOverviewSketch() {
  const scale = 1.4;
  const streetH = STREET_WIDTH_M * scale;
  const totalW = LAND_LENGTH_M * scale;
  const totalH = NET_DEPTH_M * scale;
  const pad = 40;
  const strokeW = 1.5;

  // مواضع المناطق: غرب (يسار) ← د، ج، ب ← شرق (يمين) أ — المنطقة أ على الشرق (طريق الجبيل)
  const zonesWestToEast = [...ZONE_DIMENSIONS].reverse(); // د، ج، ب، أ
  let xAcc = 0;
  const zoneRects = zonesWestToEast.map((dims) => {
    const w = dims.widthM * scale;
    const rect = { dims, x: xAcc, w };
    xAcc += w;
    return rect;
  });

  const ROAD_BEHIND_M = 4;
  const roadH = ROAD_BEHIND_M * scale;
  const contentH = NET_DEPTH_M * scale - roadH;

  const zoneCLayout = {
    eastBuildingWidthM: 7,
    middleBuildingWidthM: 14,
    parkingWidthM: 25,
  };
  const zoneDSections = {
    rightWidthM: 39,
    topDepthM: 26.25,
  };

  const cDims = ZONE_DIMENSIONS.find((z) => z.id === "c")!;
  const dDims = ZONE_DIMENSIONS.find((z) => z.id === "d")!;
  const cRect = zoneRects.find((r) => r.dims.id === "c")!;
  const dRect = zoneRects.find((r) => r.dims.id === "d")!;

  const { buildings, parkings, eastBoundaryParkingM } = computeZoneCLayout(
    cDims.widthM,
    zoneCLayout
  );

  const svgW = totalW + pad * 2 + 80;
  const svgH = totalH + streetH * 2 + pad * 2 + 60;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full max-h-[420px] object-contain"
      >
        <defs>
          <marker id="overview-arrow" markerWidth="8" markerHeight="8" refX="7" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L7,2.5 z" fill="currentColor" />
          </marker>
          <clipPath id="zone-d-clip">
            <rect x={0} y={0} width={dRect.w} height={totalH} />
          </clipPath>
        </defs>
        <g transform={`translate(${pad}, ${pad})`}>
          {/* المناطق الأربع */}
          {zoneRects.map(({ dims, x, w }) => {
            const hasInternalLayout = dims.id === "c" || dims.id === "d";
            return (
              <g key={dims.id}>
                <rect
                  x={x}
                  y={0}
                  width={w}
                  height={totalH}
                  fill={ZONE_COLORS[dims.id]}
                  fillOpacity={hasInternalLayout ? 0.2 : 0.35}
                  stroke={ZONE_COLORS[dims.id]}
                  strokeWidth={strokeW}
                />
                {!hasInternalLayout && (
                  <>
                    <text
                      x={x + w / 2}
                      y={totalH / 2 - 16}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-800 text-sm font-bold"
                    >
                      {dims.id.toUpperCase()}
                    </text>
                    <text
                      x={x + w / 2}
                      y={totalH / 2 - 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-600 text-xs"
                    >
                      {dims.id === "a" ? "منطقة المزاد" : "منطقة إيواء المركبات"}
                    </text>
                    <text
                      x={x + w / 2}
                      y={totalH - 6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-700 text-[10px] font-bold"
                    >
                      {dims.widthM} م
                    </text>
                  </>
                )}
                {hasInternalLayout && (
                  <text
                    x={x + w / 2}
                    y={totalH - 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-700 text-[10px] font-bold"
                  >
                    {dims.id.toUpperCase()} ({dims.widthM} م)
                  </text>
                )}
              </g>
            );
          })}

          {/* تخطيط المنطقة ج: مباني + مواقف + طريق */}
          <g transform={`translate(${cRect.x}, 0)`}>
            <rect
              x={0}
              y={0}
              width={cRect.w}
              height={roadH}
              fill="#94a3b8"
              fillOpacity={0.5}
              stroke="#64748b"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            {(() => {
              let zx = 0;
              const els: JSX.Element[] = [];
              for (let i = 0; i < buildings.length; i++) {
                const b = buildings[i];
                const bW = b.widthM * scale;
                els.push(
                  <g key={`cb${i}`}>
                    <rect
                      x={zx}
                      y={roadH}
                      width={bW}
                      height={contentH}
                      fill="#f59e0b"
                      fillOpacity={0.6}
                      stroke="#b45309"
                      strokeWidth={1}
                    />
                    {b.depthM === 14 && (
                      <line
                        x1={zx + bW / 2}
                        y1={roadH}
                        x2={zx + bW / 2}
                        y2={totalH}
                        stroke="#92400e"
                        strokeWidth={1}
                        strokeDasharray="2 2"
                      />
                    )}
                    <text
                      x={zx + bW / 2}
                      y={roadH + contentH / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-800 text-xs font-bold"
                    >
                      {i + 1}
                    </text>
                  </g>
                );
                zx += bW;
                if (i < parkings.length) {
                  const pW = parkings[i].widthM * scale;
                  els.push(
                    <rect
                      key={`cp${i}`}
                      x={zx}
                      y={roadH}
                      width={pW}
                      height={contentH}
                      fill="#94a3b8"
                      fillOpacity={0.4}
                      stroke="#64748b"
                      strokeWidth={1}
                      strokeDasharray="2 2"
                    />
                  );
                  zx += pW;
                }
              }
              if (eastBoundaryParkingM > 0) {
                const ebW = eastBoundaryParkingM * scale;
                els.push(
                  <rect
                    key="ceb"
                    x={zx}
                    y={roadH}
                    width={ebW}
                    height={contentH}
                    fill="#94a3b8"
                    fillOpacity={0.5}
                    stroke="#64748b"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                );
              }
              return els;
            })()}
          </g>

          {/* تخطيط المنطقة د: ثلاثة أقسام — clipPath يمنع تداخل النص مع المنطقة ج */}
          <g transform={`translate(${dRect.x}, 0)`} clipPath="url(#zone-d-clip)">
            {(() => {
              const { rightWidthM, topDepthM } = zoneDSections;
              const leftWidthM = dDims.widthM - rightWidthM;
              const bottomDepthM = dDims.depthM - topDepthM;
              const leftW = leftWidthM * scale;
              const rightW = rightWidthM * scale;
              const topH = topDepthM * scale;
              const bottomH = bottomDepthM * scale;
              const section1CenterX = leftW + rightW / 2;
              const section1CenterY = totalH / 2;
              return (
                <>
                  <line
                    x1={leftW}
                    y1={0}
                    x2={leftW}
                    y2={totalH}
                    stroke="#8b5cf6"
                    strokeWidth={1.5}
                    strokeDasharray="3 2"
                  />
                  <line
                    x1={0}
                    y1={topH}
                    x2={leftW}
                    y2={topH}
                    stroke="#8b5cf6"
                    strokeWidth={1.5}
                    strokeDasharray="3 2"
                  />
                  <text x={section1CenterX} y={section1CenterY - 10} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight="bold" fill="#1e293b">1</text>
                  <text x={section1CenterX} y={section1CenterY - 2} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#475569">الورشة</text>
                  <text x={section1CenterX} y={section1CenterY + 10} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#475569">النموذجية</text>
                  <text x={leftW / 2} y={topH / 2 - 6} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight="bold" fill="#1e293b">2</text>
                  <text x={leftW / 2} y={topH / 2 + 6} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#475569">تلميع</text>
                  <text x={leftW / 2} y={topH + bottomH / 2 - 6} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight="bold" fill="#1e293b">3</text>
                  <text x={leftW / 2} y={topH + bottomH / 2 + 6} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#475569">مغسلة</text>
                </>
              );
            })()}
          </g>

          {/* شارعنا 12.5 م — نفس لون شارع الجار */}
          <rect
            x={0}
            y={totalH}
            width={totalW}
            height={streetH}
            fill="#64748b"
            stroke="#475569"
            strokeWidth={1}
          />
          <text
            x={totalW / 2}
            y={totalH + streetH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-xs font-semibold"
          >
            شارعنا 12.5 م
          </text>

          {/* شارع الجار */}
          <rect
            x={0}
            y={totalH + streetH}
            width={totalW}
            height={streetH}
            fill="#64748b"
            stroke="#475569"
            strokeWidth={1}
          />
          <text
            x={totalW / 2}
            y={totalH + streetH + streetH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-xs"
          >
            شارع الجار 12.5 م
          </text>

          {/* تسميات الاتجاهات */}
          <text x={totalW / 2} y={-8} textAnchor="middle" className="fill-slate-700 text-sm font-bold">
            شمال — ٥٢٠ م شرق–غرب
          </text>
          <text x={totalW + 20} y={totalH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-600 text-xs" transform={`rotate(90, ${totalW + 20}, ${totalH / 2})`}>
            شرق — طريق الجبيل
          </text>
          <text x={-20} y={totalH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-600 text-xs" transform={`rotate(-90, -20, ${totalH / 2})`}>
            غرب — شارع داخلي ٣٠ م
          </text>
        </g>
      </svg>
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2">
        <p className="text-center text-sm text-slate-600">
          المنظر العام: غرب ← د (استثمارية) | ج (سكن) | ب (إيواء) | أ (مزاد) ← شرق (طريق الجبيل)
        </p>
      </div>
    </div>
  );
}
