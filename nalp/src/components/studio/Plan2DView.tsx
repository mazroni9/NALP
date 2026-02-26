"use client";

/** ألوان المناطق الأربع */
const ZONE_COLORS = {
  a: "#6366f1",
  b: "#10b981",
  c: "#f59e0b",
  d: "#dc2626",
};
const STREET_COLOR = "#1e293b";
const WEST_STREET_COLOR = "#475569";

const ZONE_LABELS = { a: "أ", b: "ب", c: "ج", d: "د" };

interface Plan2DViewProps {
  lengthX: number;
  depthY: number;
  streetEnabled: boolean;
  zonePercents: { a: number; b: number; c: number; d: number };
}

interface ZoneInfo {
  id: "a" | "b" | "c" | "d";
  x: number;
  y: number;
  w: number;
  h: number;
  widthM: number;
  depthM: number;
}

/**
 * عرض ثنائي الأبعاد للمخطط — تخطيط شرق–غرب: أ|ب|ج|د
 * عمق جميع المناطق 52.5 م (شمال–جنوب)، الشارع 12.5 م في الجنوب
 */
export function Plan2DView({
  lengthX,
  depthY,
  streetEnabled,
  zonePercents,
}: Plan2DViewProps) {
  const streetWidth = 12.5;
  const westStreetWidth = 30;
  const scale = 6;
  const w = lengthX * scale;
  const h = depthY * scale;
  const streetH = streetEnabled ? streetWidth * scale : 0;
  const netH = h - streetH; // 52.5m in pixels
  const totalP =
    zonePercents.a + zonePercents.b + zonePercents.c + zonePercents.d || 1;
  const netDepthM = depthY - streetWidth; // 52.5

  const aW = (w * (zonePercents.a / totalP)) || 0;
  const bW = (w * (zonePercents.b / totalP)) || 0;
  const cW = (w * (zonePercents.c / totalP)) || 0;
  const dW = (w * (zonePercents.d / totalP)) || 0;
  const aWidthM = lengthX * (zonePercents.a / totalP);
  const bWidthM = lengthX * (zonePercents.b / totalP);
  const cWidthM = lengthX * (zonePercents.c / totalP);
  const dWidthM = lengthX * (zonePercents.d / totalP);

  const westStreetW = westStreetWidth * scale;
  const zoneStartX = westStreetW;

  const zones: ZoneInfo[] = [
    { id: "d", x: zoneStartX, y: 0, w: dW, h: netH, widthM: dWidthM, depthM: netDepthM },
    { id: "c", x: zoneStartX + dW, y: 0, w: cW, h: netH, widthM: cWidthM, depthM: netDepthM },
    { id: "b", x: zoneStartX + dW + cW, y: 0, w: bW, h: netH, widthM: bWidthM, depthM: netDepthM },
    { id: "a", x: zoneStartX + dW + cW + bW, y: 0, w: aW, h: netH, widthM: aWidthM, depthM: netDepthM },
  ];

  const fmt = (n: number) => Math.round(n * 10) / 10;

  const totalW = w + westStreetW;
  const pad = 50;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 p-4">
      <div className="relative overflow-auto rounded-lg border-2 border-slate-300 bg-white shadow">
        <svg
          viewBox={`0 0 ${totalW + pad * 2} ${h + streetH + 100}`}
          className="max-h-full max-w-full"
          style={{ minWidth: 420, minHeight: 220 }}
        >
          <g transform={`translate(${pad}, 40)`}>
            {/* أرض المناطق + شارع غربي 30 م */}
            <rect
              x={zoneStartX}
              y={0}
              width={w}
              height={netH}
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth={1}
            />
            {/* شارع غربي 30 م */}
            <rect
              x={0}
              y={0}
              width={westStreetW}
              height={netH}
              fill={WEST_STREET_COLOR}
              stroke="#334155"
              strokeWidth={1}
            />
            <text
              x={westStreetW / 2}
              y={netH / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              className="text-xs font-medium"
              transform={`rotate(-90, ${westStreetW / 2}, ${netH / 2})`}
            >
              شارع داخلي 30 م (غرب)
            </text>
            {/* المناطق: شرقاً أ (طريق الجبيل) | ب | ج | د | غرباً شارع 30م */}
            {zones.map((z) => (
              <g key={z.id}>
                <rect
                  x={z.x}
                  y={z.y}
                  width={z.w}
                  height={z.h}
                  fill={ZONE_COLORS[z.id]}
                  fillOpacity={0.7}
                  stroke="#334155"
                  strokeWidth={1}
                />
                {/* تسمية المنطقة + الأبعاد بال أمتار */}
                <text
                  x={z.x + z.w / 2}
                  y={z.y + z.h / 2 - 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-900 text-sm font-bold"
                >
                  المنطقة {ZONE_LABELS[z.id]}
                </text>
                <text
                  x={z.x + z.w / 2}
                  y={z.y + z.h / 2 + 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-700 text-xs font-medium"
                >
                  {fmt(z.widthM)} × {fmt(z.depthM)} م
                </text>
              </g>
            ))}
            {/* الشارع 12.5م جنوب المناطق — ملاصق لشارع الجار 12.5م = 25م */}
            {streetEnabled && (
              <g>
                <rect
                  x={zoneStartX}
                  y={netH}
                  width={w}
                  height={streetH}
                  fill={STREET_COLOR}
                  stroke={STREET_COLOR}
                  strokeWidth={0}
                />
                <text
                  x={zoneStartX + w / 2}
                  y={netH + streetH / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  className="text-sm font-semibold"
                >
                  شارع 12.5 م (حصة المشروع) — ملاصق لشارع الجار 12.5 م = 25 م (جنوب)
                </text>
              </g>
            )}
            {/* اتجاهات وأبعاد */}
            <text x={totalW / 2} y={-8} textAnchor="middle" className="fill-slate-500 text-xs">
              شمال
            </text>
            <text
              x={zoneStartX + w / 2}
              y={h + streetH + 32}
              textAnchor="middle"
              className="fill-slate-500 text-xs"
            >
              جنوب
            </text>
            <text
              x={zoneStartX + w / 2}
              y={h + streetH + 16}
              textAnchor="middle"
              className="fill-slate-700 text-sm font-bold"
            >
              {lengthX} م
            </text>
            <text
              x={totalW + 16}
              y={(h + streetH) / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-700 text-sm font-bold"
              transform={`rotate(90, ${totalW + 16}, ${(h + streetH) / 2})`}
            >
              {depthY} م
            </text>
          </g>
        </svg>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        عرض ثنائي الأبعاد — شمال أعلى، الشارع ثابت في الجنوب. الأبعاد بالأمتار معروضة داخل كل منطقة.
      </p>
    </div>
  );
}
