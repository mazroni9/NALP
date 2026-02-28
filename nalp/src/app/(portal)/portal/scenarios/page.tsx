"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ZONE_A,
  ZONE_B,
  ZONE_C,
  ZONE_D,
  PROJECT_TOTALS,
} from "@/lib/projectData";
import { useState } from "react";

export interface Scenario {
  id: string;
  name: string;
  zoneA: { carsPerDay: number; commission: number; workingDays: number; opexA: number };
  zoneB: { spotsTotal: number; occupancyB: number; pricePerSpot: number };
  zoneC: { roomsTotal: number; occupancyC: number; roomPrice: number; opexC: number };
  zoneD: {
    constructionCost: number;
    monthlyRevenue: number;
    opexPercent: number;
    preBreakevenShare: number;
    postBreakevenShare: number;
    partnershipYears: number;
  };
  capRate: number;
  calcYears: number;
}

function calcZoneD(s: Scenario["zoneD"], calcYears: number) {
  const netMonthly =
    s.monthlyRevenue * (1 - s.opexPercent / 100);
  const investorSharePre = 1 - s.preBreakevenShare / 100;
  const investorMonthlyPre = netMonthly * investorSharePre;
  const breakevenMonths =
    investorMonthlyPre > 0 ? s.constructionCost / investorMonthlyPre : 0;
  const ownerMonthlyPre = netMonthly * (s.preBreakevenShare / 100);
  const ownerMonthlyPost = netMonthly * (s.postBreakevenShare / 100);
  const ownerPreBreakeven = ownerMonthlyPre * Math.min(breakevenMonths, calcYears * 12);
  const monthsPost = Math.max(0, calcYears * 12 - breakevenMonths);
  const ownerPostBreakeven = ownerMonthlyPost * monthsPost;
  const ownerTotal = ownerPreBreakeven + ownerPostBreakeven;
  return {
    breakevenMonths,
    ownerPreBreakeven,
    ownerPostBreakeven,
    ownerTotal,
  };
}

function calcResults(s: {
  zoneA: Scenario["zoneA"];
  zoneB: Scenario["zoneB"];
  zoneC: Scenario["zoneC"];
  zoneD: Scenario["zoneD"];
  capRate: number;
  calcYears: number;
}) {
  const ownerA =
    s.zoneA.carsPerDay *
    s.zoneA.commission *
    s.zoneA.workingDays *
    (1 - s.zoneA.opexA / 100);
  const ownerB =
    s.zoneB.spotsTotal *
    (s.zoneB.occupancyB / 100) *
    s.zoneB.pricePerSpot *
    365;
  const ownerC =
    s.zoneC.roomsTotal *
    (s.zoneC.occupancyC / 100) *
    s.zoneC.roomPrice *
    12 *
    (1 - s.zoneC.opexC / 100);
  const zoneDResult = calcZoneD(s.zoneD, s.calcYears);

  const totalAnnual = ownerA + ownerB + ownerC + zoneDResult.ownerTotal / s.calcYears;
  const totalOverCalcYears =
    ownerA * s.calcYears +
    ownerB * s.calcYears +
    ownerC * s.calcYears +
    zoneDResult.ownerTotal;
  const exitValue = (ownerA + ownerB + ownerC + zoneDResult.ownerTotal / s.calcYears) / (s.capRate / 100);

  return {
    ownerA,
    ownerB,
    ownerC,
    zoneD: zoneDResult,
    totalAnnual,
    totalOverCalcYears,
    exitValue,
  };
}

const INIT_ZONE_A = {
  carsPerDay: 10,
  commission: 1500,
  workingDays: 300,
  opexA: ZONE_A.opexPercent,
};

const INIT_ZONE_B = {
  spotsTotal: 300,
  occupancyB: 70,
  pricePerSpot: 30,
};

const INIT_ZONE_C = {
  roomsTotal: ZONE_C.totalRooms,
  occupancyC: ZONE_C.occupancyDefault,
  roomPrice: ZONE_C.avgRoomPrice,
  opexC: ZONE_C.opexPercent,
};

const INIT_ZONE_D = {
  constructionCost: ZONE_D.constructionCost,
  monthlyRevenue: ZONE_D.monthlyRevenue,
  opexPercent: ZONE_D.opexPercent,
  preBreakevenShare: ZONE_D.preBreakevenSharePercent,
  postBreakevenShare: ZONE_D.postBreakevenSharePercent,
  partnershipYears: ZONE_D.partnershipYears,
};

export default function ScenariosPage() {
  const [zoneA, setZoneA] = useState(INIT_ZONE_A);
  const [zoneB, setZoneB] = useState(INIT_ZONE_B);
  const [zoneC, setZoneC] = useState(INIT_ZONE_C);
  const [zoneD, setZoneD] = useState(INIT_ZONE_D);
  const [capRate, setCapRate] = useState(PROJECT_TOTALS.capRate);
  const [calcYears, setCalcYears] = useState(8);
  const [scenarioName, setScenarioName] = useState("");

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);

  const saveScenario = () => {
    const id = `s-${Date.now()}`;
    const name = scenarioName.trim() || `سيناريو ${scenarios.length + 1}`;
    setScenarios((prev) => [
      ...prev,
      {
        id,
        name,
        zoneA: { ...zoneA },
        zoneB: { ...zoneB },
        zoneC: { ...zoneC },
        zoneD: { ...zoneD },
        capRate,
        calcYears,
      },
    ]);
    setScenarioName("");
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
    calcYears,
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
          {/* Zone-A */}
          <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">أ</span>
              {ZONE_A.name}
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
                <label className="block text-sm">متوسط العمولة (ريال)</label>
                <input
                  type="number"
                  value={zoneA.commission}
                  onChange={(e) => setZoneA((p) => ({ ...p, commission: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                />
                <p className="mt-1 text-sm text-gray-400">متوسط العمولة المحصلة من بيع كل سيارة</p>
              </div>
              <div>
                <label className="block text-sm">أيام العمل سنوياً</label>
                <input
                  type="number"
                  value={zoneA.workingDays}
                  onChange={(e) => setZoneA((p) => ({ ...p, workingDays: Number(e.target.value) }))}
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

          {/* Zone-B */}
          <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">ب</span>
              {ZONE_B.name}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm">عدد المواقف</label>
                <input
                  type="number"
                  value={zoneB.spotsTotal}
                  readOnly
                  className="mt-1 w-full rounded border border-slate-200 bg-slate-100 px-3 py-2 text-slate-500"
                />
                <p className="mt-1 text-sm text-gray-400">ثابت: إجمالي سعة المواقف</p>
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
                <p className="mt-1 text-sm text-gray-400">نسبة المواقف المستخدمة</p>
              </div>
              <div>
                <label className="block text-sm">سعر الموقف/يوم (ريال)</label>
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

          {/* Zone-C */}
          <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">ج</span>
              {ZONE_C.name}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm">عدد الغرف</label>
                <input
                  type="number"
                  value={zoneC.roomsTotal}
                  readOnly
                  className="mt-1 w-full rounded border border-slate-200 bg-slate-100 px-3 py-2 text-slate-500"
                />
                <p className="mt-1 text-sm text-gray-400">ثابت: إجمالي عدد الغرف</p>
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
                <p className="mt-1 text-sm text-gray-400">نسبة الغرف المشغولة</p>
              </div>
              <div>
                <label className="block text-sm">متوسط سعر الغرفة/شهر (ريال)</label>
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
                <p className="mt-1 text-sm text-gray-400">نسبة المصاريف التشغيلية</p>
              </div>
            </div>
          </section>

          {/* Zone-D — شراكة استثمارية */}
          <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700">د</span>
              Zone-D — شراكة استثمارية
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm">تكلفة الإنشاء (ريال)</label>
                <input
                  type="number"
                  value={zoneD.constructionCost}
                  onChange={(e) => setZoneD((p) => ({ ...p, constructionCost: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                />
                <p className="mt-1 text-sm text-gray-400">تكلفة البناء على المستثمر</p>
              </div>
              <div>
                <label className="block text-sm">الإيراد الشهري (ريال)</label>
                <input
                  type="number"
                  value={zoneD.monthlyRevenue}
                  onChange={(e) => setZoneD((p) => ({ ...p, monthlyRevenue: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                />
                <p className="mt-1 text-sm text-gray-400">إجمالي الإيراد الشهري</p>
              </div>
              <div>
                <label className="block text-sm">OPEX %</label>
                <input
                  type="number"
                  value={zoneD.opexPercent}
                  onChange={(e) => setZoneD((p) => ({ ...p, opexPercent: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  min={0}
                  max={100}
                />
                <p className="mt-1 text-sm text-gray-400">نسبة المصاريف التشغيلية</p>
              </div>
              <div>
                <label className="block text-sm">حد المصاريف الإدارية %</label>
                <input
                  type="number"
                  value={10}
                  readOnly
                  className="mt-1 w-full rounded border border-slate-200 bg-slate-100 px-3 py-2 text-slate-500"
                />
                <p className="mt-1 text-sm text-gray-400">ثابت: المصاريف الإدارية محدودة بـ 10% ولا تُدرج في OPEX</p>
              </div>
              <div>
                <label className="block text-sm">حصة قبل التعادل %</label>
                <input
                  type="number"
                  value={zoneD.preBreakevenShare}
                  onChange={(e) => setZoneD((p) => ({ ...p, preBreakevenShare: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  min={0}
                  max={100}
                />
                <p className="mt-1 text-sm text-gray-400">حصة مالك الأرض قبل استرداد المستثمر تكلفته</p>
              </div>
              <div>
                <label className="block text-sm">حصة بعد التعادل %</label>
                <input
                  type="number"
                  value={zoneD.postBreakevenShare}
                  onChange={(e) => setZoneD((p) => ({ ...p, postBreakevenShare: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  min={0}
                  max={100}
                />
                <p className="mt-1 text-sm text-gray-400">حصة مالك الأرض بعد التعادل</p>
              </div>
              <div>
                <label className="block text-sm">مدة الشراكة (سنوات)</label>
                <input
                  type="number"
                  value={zoneD.partnershipYears}
                  onChange={(e) => setZoneD((p) => ({ ...p, partnershipYears: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  min={1}
                />
                <p className="mt-1 text-sm text-gray-400">مدة اتفاقية الشراكة</p>
              </div>
            </div>
          </section>

          {/* التقييم المشترك */}
          <section className="rounded-lg border border-slate-200 bg-indigo-50/50 p-4">
            <h3 className="mb-4 font-semibold text-slate-800">قسم التقييم (مشترك)</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
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
                <p className="mt-1 text-sm text-gray-400">معدل الرسملة لحساب قيمة التخارج</p>
              </div>
              <div>
                <label className="block text-sm">عدد سنوات الاحتساب</label>
                <input
                  type="number"
                  value={calcYears}
                  onChange={(e) => setCalcYears(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  min={1}
                />
                <p className="mt-1 text-sm text-gray-400">فترة احتساب العائد الإجمالي</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder="اسم السيناريو (اختياري)"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <Button onClick={saveScenario}>حفظ السيناريو</Button>
        </div>

        {/* النتائج الفورية */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
            <p className="text-sm opacity-90">دخل مالك الأرض من Zone-A</p>
            <p className="mt-1 text-lg font-semibold">{Math.round(live.ownerA).toLocaleString("en-US")} ر.س</p>
          </div>
          <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
            <p className="text-sm opacity-90">دخل مالك الأرض من Zone-B</p>
            <p className="mt-1 text-lg font-semibold">{Math.round(live.ownerB).toLocaleString("en-US")} ر.س</p>
          </div>
          <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
            <p className="text-sm opacity-90">دخل مالك الأرض من Zone-C</p>
            <p className="mt-1 text-lg font-semibold">{Math.round(live.ownerC).toLocaleString("en-US")} ر.س</p>
          </div>
          <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white sm:col-span-2">
            <p className="text-sm opacity-90">دخل مالك الأرض من Zone-D</p>
            <p className="mt-1 text-sm">
              قبل التعادل: {Math.round(live.zoneD.ownerPreBreakeven).toLocaleString("en-US")} ر.س • بعد التعادل: {Math.round(live.zoneD.ownerPostBreakeven).toLocaleString("en-US")} ر.س • وقت التعادل: {live.zoneD.breakevenMonths.toFixed(1)} شهر
            </p>
            <p className="mt-1 text-lg font-semibold">الإجمالي: {Math.round(live.zoneD.ownerTotal).toLocaleString("en-US")} ر.س</p>
          </div>
          <div className="rounded-xl border-2 border-[#1e3a5f] bg-[#1e3a5f] px-4 py-3 text-white">
            <p className="text-sm font-medium opacity-90">الإجمالي خلال {calcYears} سنوات</p>
            <p className="mt-1 text-xl font-bold">{Math.round(live.totalOverCalcYears).toLocaleString("en-US")} ر.س</p>
          </div>
          <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white sm:col-span-2">
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
                    {s.name} — أ:{Math.round(r.ownerA / 1e6).toFixed(1)}M ب:{Math.round(r.ownerB / 1e6).toFixed(1)}M ج:{Math.round(r.ownerC / 1e6).toFixed(1)}M د:{Math.round(r.zoneD.ownerTotal / 1e6).toFixed(1)}M • الإجمالي: {Math.round(r.totalOverCalcYears / 1e6).toFixed(1)}M
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
                    <th className="py-2">{scA.name}</th>
                    <th className="py-2">{scB.name}</th>
                    <th className="py-2">الفرق %</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-100">
                    <td className="py-2">دخل أ السنوي</td>
                    <td>{Math.round(calcResults(scA).ownerA).toLocaleString("en-US")}</td>
                    <td>{Math.round(calcResults(scB).ownerA).toLocaleString("en-US")}</td>
                    <td>{diff(calcResults(scA).ownerA, calcResults(scB).ownerA).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">دخل ب السنوي</td>
                    <td>{Math.round(calcResults(scA).ownerB).toLocaleString("en-US")}</td>
                    <td>{Math.round(calcResults(scB).ownerB).toLocaleString("en-US")}</td>
                    <td>{diff(calcResults(scA).ownerB, calcResults(scB).ownerB).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">دخل ج السنوي</td>
                    <td>{Math.round(calcResults(scA).ownerC).toLocaleString("en-US")}</td>
                    <td>{Math.round(calcResults(scB).ownerC).toLocaleString("en-US")}</td>
                    <td>{diff(calcResults(scA).ownerC, calcResults(scB).ownerC).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">دخل د الإجمالي</td>
                    <td>{Math.round(calcResults(scA).zoneD.ownerTotal).toLocaleString("en-US")}</td>
                    <td>{Math.round(calcResults(scB).zoneD.ownerTotal).toLocaleString("en-US")}</td>
                    <td>{diff(calcResults(scA).zoneD.ownerTotal, calcResults(scB).zoneD.ownerTotal).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="py-2">الإجمالي</td>
                    <td>{Math.round(calcResults(scA).totalOverCalcYears).toLocaleString("en-US")}</td>
                    <td>{Math.round(calcResults(scB).totalOverCalcYears).toLocaleString("en-US")}</td>
                    <td>{diff(calcResults(scA).totalOverCalcYears, calcResults(scB).totalOverCalcYears).toFixed(1)}%</td>
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
