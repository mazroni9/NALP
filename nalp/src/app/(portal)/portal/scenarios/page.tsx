"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useState } from "react";

export interface Scenario {
  id: string;
  occupancy: number;
  bedRate: number;
  opexCap: number;
  exitPrice: number;
}

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [occupancy, setOccupancy] = useState(85);
  const [bedRate, setBedRate] = useState(1200);
  const [opexCap, setOpexCap] = useState(25);
  const [exitPrice, setExitPrice] = useState(1.2);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);

  const addScenario = () => {
    const id = `s-${Date.now()}`;
    setScenarios((prev) => [
      ...prev,
      { id, occupancy, bedRate, opexCap, exitPrice },
    ]);
  };

  const diff = (a: number, b: number) => ((a - b) / (b || 1)) * 100;

  const scA = scenarios.find((s) => s.id === compareA);
  const scB = scenarios.find((s) => s.id === compareB);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">السيناريوهات</h1>
      <p className="mt-1 text-slate-600">
        اختبر افتراضات مختلفة للإشغال والأسعار والمصاريف، واعرف كيف تؤثر على العائد الإجمالي للمشروع. أنشئ سيناريوهين أو أكثر لمقارنتهم جنباً إلى جنب.
      </p>

      <Card className="mt-8">
        <h2 className="font-semibold">سيناريو جديد</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm">الإشغال (%)</label>
            <input
              type="number"
              value={occupancy}
              onChange={(e) => setOccupancy(Number(e.target.value))}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              min={0}
              max={100}
            />
            <p className="mt-1 text-sm text-gray-400">نسبة المواقف أو الوحدات المشغولة من الإجمالي</p>
          </div>
          <div>
            <label className="block text-sm">سعر السرير (ريال)</label>
            <input
              type="number"
              value={bedRate}
              onChange={(e) => setBedRate(Number(e.target.value))}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
            <p className="mt-1 text-sm text-gray-400">متوسط سعر الإيجار للوحدة (يومي أو شهري حسب المنطقة)</p>
          </div>
          <div>
            <label className="block text-sm">حد التشغيل (%)</label>
            <input
              type="number"
              value={opexCap}
              onChange={(e) => setOpexCap(Number(e.target.value))}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
            <p className="mt-1 text-sm text-gray-400">نسبة المصاريف التشغيلية من الإيراد (OPEX)</p>
          </div>
          <div>
            <label className="block text-sm">سعر الخروج (x)</label>
            <input
              type="number"
              value={exitPrice}
              onChange={(e) => setExitPrice(Number(e.target.value))}
              step={0.1}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
            <p className="mt-1 text-sm text-gray-400">مضاعف التقييم عند التخارج — مثلاً 1.2 تعني قيمة المشروع = الدخل السنوي × 1.2</p>
          </div>
        </div>
        <Button onClick={addScenario} className="mt-4">
          إضافة سيناريو
        </Button>

        {(() => {
          const grossAnnual = (occupancy / 100) * bedRate * 365;
          const annualIncome = grossAnnual * (1 - opexCap / 100);
          const total8Year = annualIncome * 8;
          const exitValue = annualIncome * exitPrice;
          return (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
                <p className="text-sm opacity-90">العائد السنوي التقديري</p>
                <p className="mt-1 text-lg font-semibold">{Math.round(annualIncome).toLocaleString("en-US")} ر.س</p>
              </div>
              <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
                <p className="text-sm opacity-90">العائد الإجمالي (8 سنوات)</p>
                <p className="mt-1 text-lg font-semibold">{Math.round(total8Year).toLocaleString("en-US")} ر.س</p>
              </div>
              <div className="rounded-xl bg-[#1e3a5f] px-4 py-3 text-white">
                <p className="text-sm opacity-90">قيمة الخروج التقديرية</p>
                <p className="mt-1 text-lg font-semibold">{Math.round(exitValue).toLocaleString("en-US")} ر.س</p>
              </div>
            </div>
          );
        })()}
      </Card>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">قائمة السيناريوهات</h2>
          <ul className="mt-4 space-y-2">
            {scenarios.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded border border-slate-100 px-3 py-2"
              >
                <span className="text-sm">
                  إشغال {s.occupancy}% • {s.bedRate} ر.س • تشغيل {s.opexCap}% • خروج {s.exitPrice}x
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
            ))}
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
                    <td className="py-2">الإشغال</td>
                    <td>{scA.occupancy}%</td>
                    <td>{scB.occupancy}%</td>
                    <td>{diff(scA.occupancy, scB.occupancy).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">سعر السرير</td>
                    <td>{scA.bedRate}</td>
                    <td>{scB.bedRate}</td>
                    <td>{diff(scA.bedRate, scB.bedRate).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">حد التشغيل</td>
                    <td>{scA.opexCap}%</td>
                    <td>{scB.opexCap}%</td>
                    <td>{diff(scA.opexCap, scB.opexCap).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="py-2">سعر الخروج</td>
                    <td>{scA.exitPrice}x</td>
                    <td>{scB.exitPrice}x</td>
                    <td>{diff(scA.exitPrice, scB.exitPrice).toFixed(1)}%</td>
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
