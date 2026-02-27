import React from "react";
import type { ZoneDimensions } from "@/lib/nalpLandSketch";

const STREET_WIDTH_M = 12.5;

const LAYOUT = {
  safetyBeltNorthM: 1.5,
  turningLaneWidthM: 6,
  aisleWidthM: 6,
  row1DepthM: 6,
  bayRowDepthM: 5.5,
  spotsPerBaySide: 41,
  towTruckSpotWidthM: 3,
  towTruckSpotDepthM: 5.5,
  pocketRow2SpotsRemoved: 6,
};

interface ZoneBStorageSketchProps {
  dims: ZoneDimensions;
}

export function ZoneBStorageSketch({ dims }: ZoneBStorageSketchProps) {
  const scale = 5;
  const w = dims.widthM * scale;
  const h = dims.depthM * scale;
  const streetH = STREET_WIDTH_M * scale;
  const pad = 90;
  const strokeW = 1.5;

  const turnW = LAYOUT.turningLaneWidthM * scale;
  const coreW = w - turnW * 2;
  const coreX = turnW;

  const entryW = turnW;
  const entryH = turnW;
  const entryX = w - turnW;
  const entryY = h - entryH;
  const exitX = 0;
  const exitY = h - entryH;

  const row1WidthM = dims.widthM - 2 * LAYOUT.turningLaneWidthM;
  const towTruckSpotsPerRow = Math.floor(row1WidthM / LAYOUT.towTruckSpotWidthM);
  const towTruckTotalSpots = towTruckSpotsPerRow;

  const bayDepthM = LAYOUT.bayRowDepthM * 2;
  const remainingAfterFixed = dims.depthM - LAYOUT.safetyBeltNorthM - LAYOUT.row1DepthM;
  let baysCount = 1;
  let northSingleRowDepthM = Math.round((remainingAfterFixed - bayDepthM - 2 * LAYOUT.aisleWidthM) * 10) / 10;
  for (let n = 2; n <= 15; n++) {
    const needMiddle = n * bayDepthM + (n + 1) * LAYOUT.aisleWidthM;
    const lastRowM = remainingAfterFixed - needMiddle;
    if (lastRowM >= 4.5 && lastRowM <= 6.5) {
      baysCount = n;
      northSingleRowDepthM = Math.round(lastRowM * 10) / 10;
    } else if (lastRowM < 4.5) {
      break;
    }
  }

  const parkingTotalM =
    LAYOUT.safetyBeltNorthM +
    northSingleRowDepthM +
    LAYOUT.row1DepthM +
    LAYOUT.aisleWidthM * (baysCount + 1) +
    baysCount * bayDepthM;
  const fitScale = h / (parkingTotalM * scale);

  const sbH = LAYOUT.safetyBeltNorthM * scale * fitScale;
  const coreY = sbH;
  const row1H = LAYOUT.row1DepthM * scale * fitScale;
  const northSingleRowH = northSingleRowDepthM * scale * fitScale;
  const aisleH = LAYOUT.aisleWidthM * scale * fitScale;
  const bayH = bayDepthM * scale * fitScale;
  const halfBayH = bayH / 2;

  const totalH = h + streetH * 2;

  const spotsPerBay = LAYOUT.spotsPerBaySide;
  const spotWidthPx = coreW / spotsPerBay;

  const row2PocketSpots = LAYOUT.pocketRow2SpotsRemoved;
  const row2PocketWidthPx = row2PocketSpots * spotWidthPx;
  const row2Y = coreY + northSingleRowH + aisleH + bayH + aisleH;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <svg
        viewBox={`0 0 ${w + pad * 2} ${totalH + pad * 2}`}
        className="w-full max-h-[620px] min-h-[400px]"
      >
        <defs>
          <marker
            id="arrow-b"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L0,8 L8,4 z" fill="#10b981" />
          </marker>
          <marker id="arrow-yellow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
          </marker>
        </defs>
        <g transform={`translate(${pad}, ${pad})`}>
          <rect x={0} y={0} width={w} height={h} fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={strokeW} />
          <rect x={0} y={0} width={w} height={sbH} fill="#0d9488" fillOpacity={0.4} stroke="#0f766e" strokeWidth={1} />
          <text x={w / 2} y={sbH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-800 text-sm font-normal">
            حزام أمان شمالي (1.5 م)
          </text>
          <rect x={0} y={sbH} width={turnW} height={h - sbH} fill="#14b8a6" fillOpacity={0.35} stroke="#0d9488" strokeWidth={1} strokeDasharray="4 2" />
          <text x={turnW / 2} y={sbH + (h - sbH) / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-xs font-medium" transform={`rotate(-90, ${turnW / 2}, ${sbH + (h - sbH) / 2})`}>
            ممر دوران غربي 6 م (شمال)
          </text>
          <rect x={w - turnW} y={sbH} width={turnW} height={h - sbH} fill="#14b8a6" fillOpacity={0.35} stroke="#0d9488" strokeWidth={1} strokeDasharray="4 2" />
          <text x={w - turnW / 2} y={sbH + (h - sbH) / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-xs font-medium" transform={`rotate(90, ${w - turnW / 2}, ${sbH + (h - sbH) / 2})`}>
            ممر دوران شرقي 6 م (جنوب)
          </text>
          {(() => {
            // منطق البناء: البداية من الجنوب (الدخول/الخروج) → صف 1 (سحب) ثم الصف الأخير محاذي للحد الشمالي ثم ملء المساحة الوسطى
            const sections: JSX.Element[] = [];

            let y = coreY;

            sections.push(
              <g key="row1">
                <rect x={coreX} y={h - row1H} width={coreW} height={row1H} fill="#10b981" fillOpacity={0.25} stroke="#059669" strokeWidth={1} />
                {Array.from({ length: towTruckSpotsPerRow - 1 }).map((_, k) => (
                  <line key={k} x1={coreX + (k + 1) * (coreW / towTruckSpotsPerRow)} y1={h - row1H} x2={coreX + (k + 1) * (coreW / towTruckSpotsPerRow)} y2={h} stroke="#047857" strokeWidth={1} strokeDasharray="3 3" />
                ))}
                <text x={coreX + coreW / 4} y={h - row1H / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-xs font-medium">الصف 1 — مواقف سيارات السحب ({towTruckTotalSpots} موقف)</text>
                <text x={coreX + coreW * 3 / 4} y={h - row1H / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[10px]">{LAYOUT.row1DepthM}×{row1WidthM} م</text>
              </g>
            );

            sections.push(
              <g key="north-last-row">
                <rect x={coreX} y={y} width={coreW} height={northSingleRowH} fill="#10b981" fillOpacity={0.25} stroke="#059669" strokeWidth={1} />
                {Array.from({ length: spotsPerBay - 1 }).map((_, k) => (
                  <line key={k} x1={coreX + (k + 1) * spotWidthPx} y1={y} x2={coreX + (k + 1) * spotWidthPx} y2={y + northSingleRowH} stroke="#047857" strokeWidth={1} strokeDasharray="3 3" />
                ))}
                <text x={coreX + coreW / 4} y={y + northSingleRowH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-xs font-medium">الصف الأخير — {spotsPerBay} موقف</text>
                <text x={coreX + coreW * 3 / 4} y={y + northSingleRowH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[10px]">{northSingleRowDepthM}×{row1WidthM} م</text>
              </g>
            );
            y += northSingleRowH;

            sections.push(
              <g key="aisle-top">
                <rect x={coreX} y={y} width={coreW} height={aisleH} fill="#e2e8f0" fillOpacity={0.6} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 2" />
                <text x={coreX + coreW / 2} y={y + aisleH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[10px]">ممر {baysCount + 1}: 6 م</text>
              </g>
            );
            y += aisleH;

            for (let bayIdx = baysCount - 1; bayIdx >= 0; bayIdx--) {
              const bayNum = bayIdx + 2;
              const isRow2WithPocket = bayIdx === 0;
              sections.push(
                <g key={`bay-${bayIdx}`}>
                  <rect x={coreX} y={y} width={coreW} height={bayH} fill="#10b981" fillOpacity={0.25} stroke="#059669" strokeWidth={1} />
                  <line x1={coreX} y1={y + halfBayH} x2={coreX + coreW} y2={y + halfBayH} stroke="#059669" strokeWidth={1} strokeDasharray="4 2" />
                  {Array.from({ length: spotsPerBay - 1 }).map((_, k) => (
                    <line key={k} x1={coreX + (k + 1) * spotWidthPx} y1={y} x2={coreX + (k + 1) * spotWidthPx} y2={y + bayH} stroke="#047857" strokeWidth={1} strokeDasharray="3 3" />
                  ))}
                  <text x={coreX + coreW / 4} y={y + halfBayH - 10} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-xs font-medium">الصف {bayNum}: {isRow2WithPocket ? spotsPerBay * 2 - row2PocketSpots : spotsPerBay * 2} موقف</text>
                  <text x={coreX + coreW * 3 / 4} y={y + halfBayH + 10} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[10px]">{LAYOUT.bayRowDepthM * 2}×{row1WidthM} م</text>
                </g>
              );
              y += bayH;

              sections.push(
                <g key={`aisle-${bayIdx}`}>
                  <rect x={coreX} y={y} width={coreW} height={aisleH} fill="#e2e8f0" fillOpacity={0.6} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 2" />
                  <text x={coreX + coreW / 2} y={y + aisleH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[10px]">ممر {bayIdx + 1}: 6 م</text>
                </g>
              );
              y += aisleH;
            }

            return sections;
          })()}
          {/* جيب تنزيل — الصف 2، 6 مواقف × 5.5م */}
          <g className="row2-unload-pocket">
            <rect x={coreX + coreW - row2PocketWidthPx} y={row2Y + halfBayH} width={row2PocketWidthPx} height={halfBayH} fill="#ffffff" stroke="#475569" strokeWidth={2} />
            <text x={coreX + coreW - row2PocketWidthPx / 2} y={row2Y + halfBayH + halfBayH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-800 text-sm font-medium">جيب تنزيل</text>
          </g>
          <rect x={entryX} y={entryY} width={entryW} height={entryH} fill="#059669" fillOpacity={0.6} stroke="#047857" strokeWidth={1.5} />
          <text x={entryX + entryW / 2} y={entryY + entryH / 2 - 6} textAnchor="middle" dominantBaseline="middle" className="fill-white text-sm font-bold">دخول</text>
          <path d={`M ${entryX + entryW / 2} ${entryY + entryH - 4} L ${entryX + entryW / 2} ${entryY + entryH / 2}`} stroke="#fff" strokeWidth={1.5} markerEnd="url(#arrow-b)" />
          <rect x={exitX} y={exitY} width={entryW} height={entryH} fill="#047857" fillOpacity={0.6} stroke="#065f46" strokeWidth={1.5} />
          <text x={exitX + entryW / 2} y={exitY + entryH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-white text-sm font-bold">خروج</text>
          <path d={`M ${exitX + entryW - 4} ${exitY + entryH / 2} L ${exitX + 4} ${exitY + entryH / 2}`} stroke="#fff" strokeWidth={1.5} markerEnd="url(#arrow-b)" />
          <rect x={0} y={h} width={w} height={streetH} fill="#475569" stroke="#334155" strokeWidth={1} />
          <text x={w / 2} y={h + streetH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-white text-xs font-semibold">شارعنا 12.5 م</text>
          <rect x={0} y={h + streetH} width={w} height={streetH} fill="#64748b" stroke="#475569" strokeWidth={1} />
          <text x={w / 2} y={h + streetH + streetH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-white text-xs font-medium">شارع الجار 12.5 م</text>
          <line x1={0} y1={0} x2={w} y2={0} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />
          <text x={w / 2} y={-22} textAnchor="middle" className="fill-slate-800 text-base font-bold">الحد الشمالي للقطعة — منطقة ب</text>
          <text x={w / 2} y={-40} textAnchor="middle" className="fill-slate-500 text-sm">شمال — {dims.widthM} م</text>
          <line x1={0} y1={h} x2={w} y2={h} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />
          <line x1={w} y1={0} x2={w} y2={h} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />
          <text x={w + 18} y={h / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-800 text-base font-normal" transform={`rotate(90, ${w + 18}, ${h / 2})`}>{dims.depthM} م شرق</text>
          <text x={w + 36} y={h / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-600 text-sm font-normal" transform={`rotate(90, ${w + 36}, ${h / 2})`}>{dims.eastBoundary}</text>
          <line x1={0} y1={0} x2={0} y2={h} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />
          <text x={-18} y={h / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-600 text-sm" transform={`rotate(-90, -18, ${h / 2})`}>غرب {dims.westBoundary}</text>
        </g>
      </svg>
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2">
        <p className="text-center text-sm text-slate-600">
          العرض (شرق–غرب): {dims.widthM} م | العمق (شمال–جنوب): {dims.depthM} م | السعة: {LAYOUT.spotsPerBaySide + baysCount * LAYOUT.spotsPerBaySide * 2 + towTruckTotalSpots - LAYOUT.pocketRow2SpotsRemoved} سيارة
        </p>
      </div>
    </div>
  );
}
