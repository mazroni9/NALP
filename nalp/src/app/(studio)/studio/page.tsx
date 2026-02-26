"use client";

import { Button } from "@/components/ui/Button";
import {
  nalpLandSketch,
  STREET_WIDTH_M,
  ZONE_CONFIGS,
} from "@/lib/nalpLandSketch";
import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CompassOverlay } from "@/components/studio/CompassOverlay";

const TARGET_AREA = 33800;

function polygonArea(points: [number, number][]): number {
  if (!points || points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    sum += points[i][0] * points[j][1] - points[j][0] * points[i][1];
  }
  return Math.abs(sum) / 2;
}

function polygonPerimeter(points: [number, number][]): number {
  if (!points || points.length < 2) return 0;
  let p = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    p += Math.hypot(points[j][0] - points[i][0], points[j][1] - points[i][1]);
  }
  return p;
}

const CanvasViewer = dynamic(
  () => import("@/components/studio/CanvasViewer").then((m) => m.CanvasViewer),
  { ssr: false }
);
const Plan2DView = dynamic(
  () => import("@/components/studio/Plan2DView").then((m) => m.Plan2DView),
  { ssr: false }
);

export default function StudioPage() {
  const [landType, setLandType] = useState<"rectangle" | "polygon">("rectangle");
  const [referenceSketchActive, setReferenceSketchActive] = useState(true);
  const [length, setLength] = useState(520);
  const [width, setWidth] = useState(65);
  const [pointsStr, setPointsStr] = useState("0,0; 520,0; 520,65; 0,65");
  const [zoneAPercent, setZoneAPercent] = useState(20);
  const [zoneBPercent, setZoneBPercent] = useState(25);
  const [zoneCPercent, setZoneCPercent] = useState(40);
  const [zoneDPercent, setZoneDPercent] = useState(15);
  const [streetEnabled, setStreetEnabled] = useState(false);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");

  const parsePoints = (): [number, number][] => {
    try {
      const nums = pointsStr
        .split(/[;,\s]+/)
        .filter(Boolean)
        .map(Number);
      const out: [number, number][] = [];
      for (let i = 0; i + 1 < nums.length; i += 2)
        out.push([nums[i], nums[i + 1]]);
      return out;
    } catch {
      return [];
    }
  };

  const points =
    landType === "polygon" ? parsePoints() : null;
  const area =
    landType === "rectangle"
      ? length * width
      : points && points.length >= 3
        ? polygonArea(points)
        : 0;
  const streetLength =
    landType === "rectangle"
      ? length
      : points && points.length >= 1
        ? Math.max(...(points?.map((p) => p[0]) ?? [0])) -
          Math.min(...(points?.map((p) => p[0]) ?? [0]))
        : 0;
  const streetArea = streetEnabled ? streetLength * STREET_WIDTH_M : 0;
  const netArea = Math.max(0, area - streetArea);
  const perimeter =
    landType === "rectangle"
      ? 2 * (length + width)
      : points && points.length >= 2
        ? polygonPerimeter(points)
        : 0;

  const totalZonePercent = zoneAPercent + zoneBPercent + zoneCPercent + zoneDPercent;
  const normA = totalZonePercent > 0 ? (zoneAPercent / totalZonePercent) * 100 : 25;
  const normB = totalZonePercent > 0 ? (zoneBPercent / totalZonePercent) * 100 : 25;
  const normC = totalZonePercent > 0 ? (zoneCPercent / totalZonePercent) * 100 : 25;
  const normD = totalZonePercent > 0 ? (zoneDPercent / totalZonePercent) * 100 : 25;
  const areaForZones = streetEnabled ? netArea : area;
  const zoneAArea = areaForZones * (normA / 100);
  const zoneBArea = areaForZones * (normB / 100);
  const zoneCArea = areaForZones * (normC / 100);
  const zoneDArea = areaForZones * (normD / 100);
  const sumValid = Math.abs(totalZonePercent - 100) < 0.01;

  const sumOther = (exclude: "a" | "b" | "c" | "d") => {
    let s = 0;
    if (exclude !== "a") s += zoneAPercent;
    if (exclude !== "b") s += zoneBPercent;
    if (exclude !== "c") s += zoneCPercent;
    if (exclude !== "d") s += zoneDPercent;
    return s || 1;
  };
  const setZoneA = (v: number) => {
    const val = Math.max(0, Math.min(100, v));
    const rem = 100 - val;
    const s = sumOther("a");
    setZoneAPercent(val);
    setZoneBPercent(Math.round((rem * zoneBPercent) / s));
    setZoneCPercent(Math.round((rem * zoneCPercent) / s));
    setZoneDPercent(Math.round((rem * zoneDPercent) / s));
  };
  const setZoneB = (v: number) => {
    const val = Math.max(0, Math.min(100, v));
    const rem = 100 - val;
    const s = sumOther("b");
    setZoneBPercent(val);
    setZoneAPercent(Math.round((rem * zoneAPercent) / s));
    setZoneCPercent(Math.round((rem * zoneCPercent) / s));
    setZoneDPercent(Math.round((rem * zoneDPercent) / s));
  };
  const setZoneC = (v: number) => {
    const val = Math.max(0, Math.min(100, v));
    const rem = 100 - val;
    const s = sumOther("c");
    setZoneCPercent(val);
    setZoneAPercent(Math.round((rem * zoneAPercent) / s));
    setZoneBPercent(Math.round((rem * zoneBPercent) / s));
    setZoneDPercent(Math.round((rem * zoneDPercent) / s));
  };
  const setZoneD = (v: number) => {
    const val = Math.max(0, Math.min(100, v));
    const rem = 100 - val;
    const s = sumOther("d");
    setZoneDPercent(val);
    setZoneAPercent(Math.round((rem * zoneAPercent) / s));
    setZoneBPercent(Math.round((rem * zoneBPercent) / s));
    setZoneCPercent(Math.round((rem * zoneCPercent) / s));
  };
  const areaDiff = Math.abs(area - TARGET_AREA);
  const areaWarning = areaDiff > 5000;

  const loadReferenceSketch = () => {
    setLandType("rectangle");
    setLength(520);
    setWidth(65);
    setPointsStr("0,0; 520,0; 520,65; 0,65");
    setReferenceSketchActive(true);
    setZoneAPercent(nalpLandSketch.zoneAPercent);
    setZoneBPercent(nalpLandSketch.zoneBPercent);
    setZoneCPercent(nalpLandSketch.zoneCPercent);
    setZoneDPercent(nalpLandSketch.zoneDPercent);
  };
  const exitReferenceSketch = () => {
    setReferenceSketchActive(false);
  };
  return (
    <div className="flex gap-6 p-6 pt-6">
      <aside className="w-80 shrink-0 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">استكتش مرجعي</h2>
          <p className="mt-1 text-xs text-slate-600">
            قطعة NALP من الخريطة والملف المرفق
          </p>
          <Button
            onClick={loadReferenceSketch}
            variant="outline"
            size="sm"
            className="mt-2 w-full"
          >
            تحميل الاستكتش المرجعي
          </Button>
          <Link
            href={nalpLandSketch.sourceFile}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-center text-xs text-indigo-600 hover:underline"
          >
            الملف المرجعي (PROMPT)
          </Link>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">بيانات الأرض</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm">النوع</label>
              <select
                value={landType}
                onChange={(e) => {
                  const v = e.target.value as "rectangle" | "polygon";
                  setLandType(v);
                  if (v === "polygon") setReferenceSketchActive(false);
                }}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
              >
                <option value="rectangle">مستطيل</option>
                <option value="polygon">مضلع</option>
              </select>
            </div>
            {landType === "rectangle" && (
              <>
                <div>
                  <label className="block text-sm">الطول (م)</label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => !referenceSketchActive && setLength(Number(e.target.value))}
                    readOnly={referenceSketchActive}
                    disabled={referenceSketchActive}
                    className={`mt-1 w-full rounded border border-slate-300 px-2 py-2 ${referenceSketchActive ? "cursor-not-allowed bg-slate-100" : ""}`}
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm">العرض (م)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => !referenceSketchActive && setWidth(Number(e.target.value))}
                    readOnly={referenceSketchActive}
                    disabled={referenceSketchActive}
                    className={`mt-1 w-full rounded border border-slate-300 px-2 py-2 ${referenceSketchActive ? "cursor-not-allowed bg-slate-100" : ""}`}
                    min={1}
                  />
                </div>
                {referenceSketchActive && (
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-600">
                      الأبعاد ثابتة حسب المخطط المرجعي: 520 م (شرق–غرب) × 65 م (شمال–جنوب).
                    </p>
                    <button
                      type="button"
                      onClick={exitReferenceSketch}
                      className="shrink-0 text-xs text-indigo-600 hover:underline"
                    >
                      إلغاء المرجع
                    </button>
                  </div>
                )}
              </>
            )}
            {landType === "polygon" && (
              <div>
                <label className="block text-sm">
                  النقاط (أزواج x,y مفصولة بفاصلة منقوطة)
                </label>
                <textarea
                  value={pointsStr}
                  onChange={(e) => setPointsStr(e.target.value)}
                  rows={3}
                  placeholder="0,0; 520,0; 520,65; 0,65"
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-2 font-mono text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">
                  الصيغة: x1,y1; x2,y2; x3,y3; ... (3 نقاط كحد أدنى)
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-600">
                المساحة الإجمالية للأرض: {area.toLocaleString("ar-SA")} م²
              </p>
              {streetEnabled && (
                <>
                  <p className="text-sm text-slate-600">
                    مساحة الشارع الداخلي: {Math.round(streetArea).toLocaleString("ar-SA")} م²
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    المساحة الصافية بعد خصم الشارع: {Math.round(netArea).toLocaleString("ar-SA")} م²
                  </p>
                </>
              )}
              <p className="text-sm text-slate-600">
                المحيط: {perimeter.toLocaleString("ar-SA")} م
              </p>
              <p className="mt-1 text-xs text-slate-500">
                المساحة المرجعية للأرض حوالي 33,800 م² (520 م شرق–غرب × 65 م شمال–جنوب).
              </p>
              {referenceSketchActive && (
                <p className="mt-2 text-xs text-slate-600">
                  طريق الجبيل–الدمام من الشرق، شارع داخلي مستقبلي بعرض 12.5 م من جهة المشروع + 12.5 م من جهة الجار من الجنوب، وشارع خلفي بعرض 30 م من الغرب.
                </p>
              )}
              {area > 0 && areaWarning && (
                <p className="mt-1 text-sm font-medium text-amber-600">
                  ⚠ بعيد عن المساحة المرجعية ≈33,800 م²
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">تقسيم المناطق (أربع مناطق)</h2>
          {!sumValid && (
            <p className="mt-1 text-sm font-medium text-amber-600">
              ⚠ مجموع النسب يجب أن يساوي 100% (حاليًا: {Math.round(totalZonePercent)}%)
            </p>
          )}
          <div className="mt-4 space-y-4">
            {[
              { key: "a" as const, pct: zoneAPercent, norm: normA, area: zoneAArea, set: setZoneA },
              { key: "b" as const, pct: zoneBPercent, norm: normB, area: zoneBArea, set: setZoneB },
              { key: "c" as const, pct: zoneCPercent, norm: normC, area: zoneCArea, set: setZoneC },
              { key: "d" as const, pct: zoneDPercent, norm: normD, area: zoneDArea, set: setZoneD },
            ].map(({ key, pct, norm, area, set }) => {
              const cfg = ZONE_CONFIGS.find((z) => z.id === key)!;
              const zoneLabel = { a: "أ", b: "ب", c: "ج", d: "د" }[key];
              return (
                <div key={key}>
                  <label className="block text-sm font-medium">{cfg.title} (المنطقة {zoneLabel})</label>
                  <p className="text-xs text-slate-500">{cfg.shortDesc}</p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={pct}
                    onChange={(e) => set(Number(e.target.value))}
                    className="mt-1 w-full"
                  />
                  <span className="block text-sm">
                    {Math.round(norm)}% — مساحة المنطقة {zoneLabel}: {area.toLocaleString("ar-SA")} م²
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-2 text-xs">
            <p className="font-medium">ملخص المساحات (م²)</p>
            <table className="mt-1 w-full text-right">
              <tbody>
                {[
                  { label: "أ", area: zoneAArea },
                  { label: "ب", area: zoneBArea },
                  { label: "ج", area: zoneCArea },
                  { label: "د", area: zoneDArea },
                ].map(({ label, area }) => (
                  <tr key={label}>
                    <td>المنطقة {label}</td>
                    <td>{area.toLocaleString("ar-SA")}</td>
                  </tr>
                ))}
                <tr className="border-t border-slate-300 font-medium">
                  <td>المجموع</td>
                  <td>{(zoneAArea + zoneBArea + zoneCArea + zoneDArea).toLocaleString("ar-SA")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">شارع داخلي مستقبلي</h2>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <input
                id="streetEnabled"
                type="checkbox"
                checked={streetEnabled}
                onChange={(e) => setStreetEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              <label htmlFor="streetEnabled" className="text-sm">
                إضافة شارع داخلي مستقبلي (12.5 م × 520 م) – تُخصم مساحته من المساحة الصافية للأرض.
              </label>
            </div>
            <p className="text-xs text-slate-500">
              الشارع يمتد شرق–غرب على طول الأرض، عرض 12.5 م، ملاصق للحافة الجنوبية.
            </p>
          </div>
        </section>
      </aside>

      <main className="relative min-h-[600px] flex-1 rounded-xl border border-slate-200 bg-white">
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode("2d")}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              viewMode === "2d" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            عرض ثنائي الأبعاد
          </button>
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              viewMode === "3d" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            عرض ثلاثي الأبعاد
          </button>
        </div>
        <div className="relative h-[600px] w-full">
          {viewMode === "2d" ? (
            <Plan2DView
              lengthX={landType === "rectangle" ? length : streetLength || 520}
              depthY={landType === "rectangle" ? width : (points && points.length >= 1 ? Math.max(...(points?.map((p) => p[1]) ?? [0])) - Math.min(...(points?.map((p) => p[1]) ?? [0])) : 65)}
              streetEnabled={streetEnabled}
              zonePercents={{ a: normA, b: normB, c: normC, d: normD }}
            />
          ) : (
            <Suspense fallback={<div className="flex h-full items-center justify-center">جاري تحميل العرض الثلاثي الأبعاد...</div>}>
              <CanvasViewer
                glbUrl={null}
                streetEnabled={streetEnabled}
                useReferenceSketch={referenceSketchActive}
                landBounds={
                  landType === "rectangle"
                    ? { lengthX: length, depthY: width }
                    : points && points.length >= 1
                      ? {
                          lengthX: streetLength || 520,
                          depthY:
                            Math.max(...(points?.map((p) => p[1]) ?? [0])) -
                            Math.min(...(points?.map((p) => p[1]) ?? [0])),
                        }
                      : { lengthX: 520, depthY: 65 }
                }
                zonePercents={{
                  a: normA,
                  b: normB,
                  c: normC,
                  d: normD,
                }}
              />
            </Suspense>
          )}
          {viewMode === "3d" && <CompassOverlay />}
        </div>
      </main>
    </div>
  );
}
