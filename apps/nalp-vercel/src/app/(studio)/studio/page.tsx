"use client";

import { Button } from "@/components/ui/Button";
import { apiPost, apiGet } from "@/lib/apiClient";
import {
  nalpLandSketch,
  getPointsStringForStudio,
} from "@/lib/nalpLandSketch";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const TARGET_AREA = 33000;

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

interface StudioRun {
  id: string;
  status: string;
  input?: { land?: unknown; zone_a_percent?: number; zone_b_percent?: number };
  files?: { type: string; url: string }[];
}

export default function StudioPage() {
  const [landType, setLandType] = useState<"rectangle" | "polygon">("rectangle");
  const [length, setLength] = useState(200);
  const [width, setWidth] = useState(165);
  const [pointsStr, setPointsStr] = useState("0,0; 200,0; 200,165; 0,165");
  const [zoneAPercent, setZoneAPercent] = useState(50);
  const [zoneBPercent, setZoneBPercent] = useState(50);
  const [runs, setRuns] = useState<StudioRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<StudioRun | null>(null);
  const [generating, setGenerating] = useState(false);

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
  const perimeter =
    landType === "rectangle"
      ? 2 * (length + width)
      : points && points.length >= 2
        ? polygonPerimeter(points)
        : 0;

  const zoneAArea = area * (zoneAPercent / 100);
  const zoneBArea = area * (zoneBPercent / 100);
  const areaDiff = Math.abs(area - TARGET_AREA);
  const areaWarning = areaDiff > 5000;

  const canGenerate =
    landType === "rectangle" || (points && points.length >= 3);

  const fetchRuns = async () => {
    try {
      const data = await apiGet<{ runs: StudioRun[] }>("/api/studio/runs");
      setRuns(data.runs || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const payload = {
        land: {
          type: landType,
          length: landType === "rectangle" ? length : null,
          width: landType === "rectangle" ? width : null,
          points:
            landType === "polygon" && points && points.length >= 3
              ? points
              : null,
        },
        zone_a_percent: zoneAPercent,
        zone_b_percent: zoneBPercent,
      };
      const data = await apiPost<{ run: StudioRun }>(
        "/api/studio/generate",
        payload
      );
      setRuns((prev) => [data.run, ...prev]);
      setSelectedRun(data.run);
    } catch {
      // ignore
    } finally {
      setGenerating(false);
    }
  };

  // Mock runs return fake URLs like /mock-concept.glb. Only pass real URLs when backend provides them.
  const rawGlbUrl = selectedRun?.files?.find((f) => f.type === "glb")?.url ?? null;
  const glbUrl =
    rawGlbUrl && !rawGlbUrl.includes("mock") ? rawGlbUrl : null;

  const loadReferenceSketch = () => {
    setLandType("polygon");
    setPointsStr(getPointsStringForStudio(nalpLandSketch));
    setZoneAPercent(nalpLandSketch.zoneAPercent);
    setZoneBPercent(nalpLandSketch.zoneBPercent);
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
                onChange={(e) =>
                  setLandType(e.target.value as "rectangle" | "polygon")
                }
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
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm">العرض (م)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
                    min={1}
                  />
                </div>
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
                  placeholder="0,0; 200,0; 200,165; 0,165"
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-2 font-mono text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">
                  الصيغة: x1,y1; x2,y2; x3,y3; ... (3 نقاط كحد أدنى)
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-600">
                المساحة: {area.toLocaleString("ar-SA")} م²
              </p>
              <p className="text-sm text-slate-600">
                المحيط: {perimeter.toLocaleString("ar-SA")} م
              </p>
              {area > 0 && areaWarning && (
                <p className="mt-1 text-sm font-medium text-amber-600">
                  ⚠ بعيد عن الهدف 33,000 م²
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">تقسيم المناطق</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm">المنطقة أ %</label>
              <input
                type="range"
                min={0}
                max={100}
                value={zoneAPercent}
                onChange={(e) => setZoneAPercent(Number(e.target.value))}
                className="w-full"
              />
              <span>
                {zoneAPercent}% — {zoneAArea.toLocaleString("ar-SA")} م²
              </span>
            </div>
            <div>
              <label className="block text-sm">المنطقة ب %</label>
              <input
                type="range"
                min={0}
                max={100}
                value={zoneBPercent}
                onChange={(e) => setZoneBPercent(Number(e.target.value))}
                className="w-full"
              />
              <span>
                {zoneBPercent}% — {zoneBArea.toLocaleString("ar-SA")} م²
              </span>
            </div>
          </div>
        </section>

        <Button
          onClick={handleGenerate}
          disabled={generating || !canGenerate}
          className="w-full"
        >
          {generating ? "جاري التوليد..." : "توليد نموذج مبدئي"}
        </Button>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">التشغيلات</h2>
          <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
            {runs.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRun(r)}
                className={`block w-full rounded px-2 py-1 text-right text-sm ${
                  selectedRun?.id === r.id ? "bg-indigo-100" : "hover:bg-slate-100"
                }`}
              >
                تشغيل #{r.id} — {r.status === "completed" ? "مكتمل" : r.status}
              </button>
            ))}
            {runs.length === 0 && (
              <p className="text-sm text-slate-500">لا توجد تشغيلات بعد</p>
            )}
          </div>
        </section>
      </aside>

      <main className="min-h-[600px] flex-1 rounded-xl border border-slate-200 bg-white">
        <div className="h-[600px] w-full">
          <Suspense fallback={<div className="flex h-full items-center justify-center">جاري تحميل العرض الثلاثي الأبعاد...</div>}>
            <CanvasViewer glbUrl={glbUrl} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
