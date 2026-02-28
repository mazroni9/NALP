"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useState } from "react";

export interface Scenario {
  id: string;
  zoneA: { carsPerDay: number; commissionPerSale: number; workingDaysPerYear: number; opexA: number };
  zoneB: { spotsTotal: number; occupancyB: number; pricePerSpot: number };
  zoneC: { roomsTotal: number; occupancyC: number; roomPrice: number; opexC: number };
  zoneD: { annualRent: number };
  capRate: number;
}

const DEFAULT_ZONE_A = { carsPerDay: 10, commissionPerSale: 1500, workingDaysPerYear: 300, opexA: 30 };
const DEFAULT_ZONE_B = { spotsTotal: 300, occupancyB: 70, pricePerSpot: 30 };
const DEFAULT_ZONE_C = { roomsTotal: 198, occupancyC: 80, roomPrice: 1325, opexC: 10 };
const DEFAULT_ZONE_D = { annualRent: 912000 };
const DEFAULT_CAP_RATE = 9;

function calcResults(s: { zoneA: Scenario["zoneA"]; zoneB: Scenario["zoneB"]; zoneC: Scenario["zoneC"]; zoneD: Scenario["zoneD"]; capRate: number }) {
  const revenueA = s.zoneA.carsPerDay * s.zoneA.commissionPerSale * s.zoneA.workingDaysPerYear * (1 - s.zoneA.opexA / 100);
  const revenueB = s.zoneB.spotsTotal * (s.zoneB.occupancyB / 100) * s.zoneB.pricePerSpot * 365;
  const revenueC = s.zoneC.roomsTotal * (s.zoneC.occupancyC / 100) * s.zoneC.roomPrice * 12 * (1 - s.zoneC.opexC / 100);
  const revenueD = s.zoneD.annualRent;
  const totalAnnual = revenueA + revenueB + revenueC + revenueD;
  const total8Year = totalAnnual * 8;
  const exitValue = totalAnnual / (s.capRate / 100);
  return { revenueA, revenueB, revenueC, revenueD, totalAnnual, total8Year, exitValue };
}

export default function ScenariosPage() {
  const [zoneA, setZoneA] = useState(DEFAULT_ZONE_A);
  const [zoneB, setZoneB] = useState(DEFAULT_ZONE_B);
  const [zoneC, setZoneC] = useState(DEFAULT_ZONE_C);
  const [zoneD, setZoneD] = useState(DEFAULT_ZONE_D);
  const [capRate, setCapRate] = useState(DEFAULT_CAP_RATE);

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);

  const addScenario = () => {
    const id = `s-${Date.now()}`;
    setScenarios((prev) => [
      ...prev,
      {
        id,
        zoneA: { ...zoneA },
        zoneB: { ...zoneB },
        zoneC: { ...zoneC },
        zoneD: { ...zoneD },
        capRate,
      },
    ]);
  };

  const diff = (a: number, b: number) => ((a - b) / (b || 1)) * 100;
  const scA = scenarios.find((s) => s.id === compareA);
  const scB = scenarios.find((s) => s.id === compareB);

  const live = calcResults({
    zoneA,
    zoneB,
    zoneC,
    zoneD,
    capRate,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">السيناريوهات</h1>
      <p className="mt-1 text-slate-600">
        اختبر افتراضات مختلفة للإشغال والأسعار والمصاريف، واعرف كيف تؤثر على العائد الإجمالي للمشروع. أنشئ سيناريوهين أو أكثر لمقارنتهم جنباً إلى جنب.
      </p>

      <Card className="mt-8">
        <h2 className="font-semibold">سيناريو جديد</h2>

        <div className="mt-6 space-y-8">
          {/* Zone-A — المزاد */}
          <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">أ</span>
              Zone-A — المزاد
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm">عدد السيارات يومياً</label>
                <input
                  type="number"
                  value={zoneA.carsPerDay}
                  onChange={(e) => setZoneA((p) => ({ ...p, carsPerDay: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  min={0}
                />
                <p className="mt-1 text-sm text-gray-400">عدد السيارات المعروضة في المزاد يومياً</p>
              </div>
              <div>
                <label className="block text-sm">متوسط عمولة البيع (ريال)</label>
                <input
                  type="number"
                  value={zoneA.commissionPerSale}
                  onChange={(e) => setZoneA((p) => ({ ...p, commissionPerSale: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                />
                <p className="mt-1 text-sm text-gray-400">متوسط العمولة المحصلة من بيع كل سيارة</p>
              </div>
              <div>
                <label className="block text-sm">أيام العمل سنوياً</label>
                <input
                  type="number"
                  value={zoneA.workingDaysPerYear}
                  onChange={(e) => setZoneA((p) => ({ ...p, workingDaysPerYear: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  min={0}
                  max={365}
                />
                <p className="mt-1 text-sm text-gray-400">عدد أيام تشغيل المزاد في السنة</p>
              </div>
              <div>
                <label className="block text-sm">OPEX %</label>
                <input
                  type="number"
                  value={zoneA.opexA}
                  onChange={(e) => setZoneA((p) => ({ ...p, opexA: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  min={0}
                  max={100}
                />
                <p className="mt-1 text-sm text-gray-400">نسبة المصاريف التشغيلية من الإيراد</p>
              </div>
            </div>
          </section>

          {/* Zone-B — المواقف */}
          <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">ب</span>
              Zone-B — المواقف
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm">عدد المواقف الإجمالية</label>
                <input
                  type="number"
                  value={zoneB.spotsTotal}
                  readOnly
                  className="mt-1 w-full rounded border border-slate-200 bg-slate-100 px-3 py-2 text-slate-500"
                />
                <p className="mt-1 text-sm text-gray-400">ثابت: إجمالي سعة المواقف في المنطقة</p>
              </div>
              <div>
                <label className="block text-sm">نسبة الإشغال %</label>
                <input
                  type="number"
                  value={zoneB.occupancyB}
                  onChange={(e) => setZoneB((p) => ({ ...p, occupancyB: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  min={0}
                  max={100}
                />
                <p className="mt-1 text-sm text-gray-400">نسبة المواقف المستخدمة من الإجمالي</p>
              </div>
              <div>
                <label className="block text-sm">سعر الموقف / يوم (ريال)</label>
                <input
                  type="number"
                  value={zoneB.pricePerSpot}
                  onChange={(e) => setZoneB((p) => ({ ...p, pricePerSpot: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                />
                <p className="mt-1 text-sm text-gray-400">متوسط إيجار الموقف اليومي</p>
              </div>
            </div>
          </section>

          {/* Zone-C — السكن */}
          <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">ج</span>
              Zone-C — السكن
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm">عدد الغرف الإجمالية</label>
                <input
                  type="number"
                  value={zoneC.roomsTotal}
                  readOnly
                  className="mt-1 w-full rounded border border-slate-200 bg-slate-100 px-3 py-2 text-slate-500"
                />
                <p className="mt-1 text-sm text-gray-400">ثابت: إجمالي عدد الغرف السكنية</p>
              </div>
              <div>
                <label className="block text-sm">نسبة الإشغال %</label>
                <input
                  type="number"
                  value={zoneC.occupancyC}
                  onChange={(e) => setZoneC((p) => ({ ...p, occupancyC: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  min={0}
                  max={100}
                />
                <p className="mt-1 text-sm text-gray-400">نسبة الغرف المشغولة من الإجمالي</p>
              </div>
              <div>
                <label className="block text-sm">متوسط سعر الغرفة / شهر (ريال)</label>
                <input
                  type="number"
                  value={zoneC.roomPrice}
                  onChange={(e) => setZoneC((p) => ({ ...p, roomPrice: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                />
                <p className="mt-1 text-sm text-gray-400">متوسط إيجار الغرفة الشهري</p>
              </div>
              <div>
                <label className="block text-sm">OPEX %</label>
                <input
                  type="number"
                  value={zoneC.opexC}
                  onChange={(e) => setZoneC((p) => ({ ...p, opexC: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  min={0}
                  max={100}
                />
                <p className="mt-1 text-sm text-gray-400">نسبة المصاريف التشغيلية من الإيراد</p>
              </div>
            </div>
          </section>

          {/* Zone-D — الورش والمعارض */}
          <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700">د</span>
              Zone-D — الورش والمعارض
            </h3>
            <div className="max-w-xs">
              <label className="block text-sm">إيجار سنوي صافي (ريال)</label>
              <input
                type="number"
                value={zoneD.annualRent}
                onChange={(e) => setZoneD({ annualRent: Number(e.target.value) })}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
              <p className="mt-1 text-sm text-gray-400">ثابت: الإيجار الصافي السنوي لا يتأثر بالإشغال</p>
            </div>
          </section>

          {/* التقييم (مشترك) */}
          <section className="rounded-lg border border-slate-200 bg-indigo-50/50 p-4">
            <h3 className="mb-4 font-semibold text-slate-800">قسم التقييم (مشترك)</h3>
            <div className="max-w-xs">
              <label className="block text-sm">Cap Rate %</label>
              <input
                type="number"
                value={capRate}
                onChange={(e) => setCapRate(Number(e.target.value))}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                min={1}
                max={20}
                step={0.5}
              />
              <p className="mt-1 text-sm text-gray-400">معدل الرسملة المستخدم لحساب قيمة التخارج</p>
            </div>
          </section>
        </div>

        <Button onClick={addScenario} className="mt-6">
          إضافة سيناريو
        </Button>

        {/* النتائج الفورية */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
            <p className="text-sm opacity-90">إيراد Zone-A السنوي (بعد OPEX)</p>
            <p className="mt-1 text-lg font-semibold">{Math.round(live.revenueA).toLocaleString("en-US")} ر.س</p>
          </div>
          <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
            <p className="text-sm opacity-90">إيراد Zone-B السنوي</p>
            <p className="mt-1 text-lg font-semibold">{Math.round(live.revenueB).toLocaleString("en-US")} ر.س</p>
          </div>
          <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
            <p className="text-sm opacity-90">إيراد Zone-C السنوي (بعد OPEX)</p>
            <p className="mt-1 text-lg font-semibold">{Math.round(live.revenueC).toLocaleString("en-US")} ر.س</p>
          </div>
          <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
            <p className="text-sm opacity-90">إيراد Zone-D السنوي</p>
            <p className="mt-1 text-lg font-semibold">{Math.round(live.revenueD).toLocaleString("en-US")} ر.س</p>
          </div>
          <div className="rounded-xl border-2 border-[#1e3a5f] bg-[#1e3a5f] px-4 py-3 text-white sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-medium opacity-90">الإجمالي السنوي</p>
            <p className="mt-1 text-xl font-bold">{Math.round(live.totalAnnual).toLocaleString("en-US")} ر.س</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
            <p className="text-sm opacity-90">العائد الإجمالي 8 سنوات</p>
            <p className="mt-1 text-lg font-semibold">{Math.round(live.total8Year).toLocaleString("en-US")} ر.س</p>
          </div>
          <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
            <p className="text-sm opacity-90">قيمة التخارج = الإجمالي السنوي ÷ Cap Rate</p>
            <p className="mt-1 text-lg font-semibold">{Math.round(live.exitValue).toLocaleString("en-US")} ر.س</p>
          </div>
        </div>
      </Card>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">قائمة السيناريوهات</h2>
          <ul className="mt-4 space-y-2">
            {scenarios.map((s) => {
              const r = calcResults(s);
              return (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-100 px-3 py-2"
                >
                  <span className="text-sm">
                    أ:{Math.round(r.revenueA / 1e6).toFixed(1)}M • ب:{Math.round(r.revenueB / 1e6).toFixed(1)}M • ج:{Math.round(r.revenueC / 1e6).toFixed(1)}M • د:{Math.round(r.revenueD / 1e6).toFixed(1)}M • الإجمالي: {Math.round(r.totalAnnual / 1e6).toFixed(1)}M ر.س
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCompareA(compareA === s.id ? null : s.id)}
                      className={`rounded px-2 py-1 text-xs ${compareA === s.id ? "bg-indigo-200" : "bg-slate-100 hover:bg-slate-200"}`}
                    >
                      أ
                    </button>
                    <button
                      onClick={() => setCompareB(compareB === s.id ? null : s.id)}
                      className={`rounded px-2 py-1 text-xs ${compareB === s.id ? "bg-indigo-200" : "bg-slate-100 hover:bg-slate-200"}`}
                    >
                      ب
                    </button>
                  </div>
                </li>
              );
            })}
            {scenarios.length === 0 && (
              <li className="text-sm text-slate-500">لا توجد سيناريوهات بعد</li>
            )}
          </ul>
        </Card>

        <Card>
          <h2 className="font-semibold">مقارنة</h2>
          {scA && scB ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2">المعامل</th>
                    <th className="py-2">أ</th>
                    <th className="py-2">ب</th>
                    <th className="py-2">الفرق %</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-100">
                    <td className="py-2">إيراد أ السنوي</td>
                    <td>{Math.round(calcResults(scA).revenueA).toLocaleString("en-US")}</td>
                    <td>{Math.round(calcResults(scB).revenueA).toLocaleString("en-US")}</td>
                    <td>{diff(calcResults(scA).revenueA, calcResults(scB).revenueA).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">إيراد ب السنوي</td>
                    <td>{Math.round(calcResults(scA).revenueB).toLocaleString("en-US")}</td>
                    <td>{Math.round(calcResults(scB).revenueB).toLocaleString("en-US")}</td>
                    <td>{diff(calcResults(scA).revenueB, calcResults(scB).revenueB).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">إيراد ج السنوي</td>
                    <td>{Math.round(calcResults(scA).revenueC).toLocaleString("en-US")}</td>
                    <td>{Math.round(calcResults(scB).revenueC).toLocaleString("en-US")}</td>
                    <td>{diff(calcResults(scA).revenueC, calcResults(scB).revenueC).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">إيراد د السنوي</td>
                    <td>{Math.round(calcResults(scA).revenueD).toLocaleString("en-US")}</td>
                    <td>{Math.round(calcResults(scB).revenueD).toLocaleString("en-US")}</td>
                    <td>{diff(calcResults(scA).revenueD, calcResults(scB).revenueD).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="py-2">الإجمالي السنوي</td>
                    <td>{Math.round(calcResults(scA).totalAnnual).toLocaleString("en-US")}</td>
                    <td>{Math.round(calcResults(scB).totalAnnual).toLocaleString("en-US")}</td>
                    <td>{diff(calcResults(scA).totalAnnual, calcResults(scB).totalAnnual).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              اختر سيناريوين (أ و ب) للمقارنة.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
