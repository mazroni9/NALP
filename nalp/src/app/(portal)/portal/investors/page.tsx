"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatSAR } from "@/lib/formatNumber";
import { ZONE_A, ZONE_B, ZONE_C, ZONE_D } from "@/lib/projectData";

export default function InvestorsPage() {
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000000);

  // إجمالي دخل الملاك من كل المناطق (8 سنوات)
  const totalOwnerIncome8Years = 
    ZONE_A.ownerIncome8Years + 
    ZONE_B.ownerIncome8Years + 
    ZONE_C.ownerIncome8Years + 
    ZONE_D.ownerIncome8Years;

  // حساب نسبة المستثمر من إجمالي المشروع
  const calculateInvestorShare = (investment: number) => {
    // افترض أن قيمة المشروع الكلية = 75 مليون ريال (يمكن تعديلها)
    const totalProjectValue = 75000000;
    const sharePercentage = (investment / totalProjectValue) * 100;
    return sharePercentage;
  };

  // حساب عوائد المستثمر من كل منطقة
  const calculateZoneReturns = (investment: number) => {
    const sharePercentage = calculateInvestorShare(investment) / 100;
    
    return {
      zoneA: {
        name: "Zone-A — المزاد",
        income8Years: ZONE_A.ownerIncome8Years * sharePercentage,
        annualAverage: (ZONE_A.ownerIncome8Years * sharePercentage) / 8,
        risk: ZONE_A.risk,
      },
      zoneB: {
        name: "Zone-B — المواقف",
        income8Years: ZONE_B.ownerIncome8Years * sharePercentage,
        annualAverage: (ZONE_B.ownerIncome8Years * sharePercentage) / 8,
        risk: ZONE_B.risk,
      },
      zoneC: {
        name: "Zone-C — السكن",
        income8Years: ZONE_C.ownerIncome8Years * sharePercentage,
        annualAverage: (ZONE_C.ownerIncome8Years * sharePercentage) / 8,
        risk: ZONE_C.risk,
      },
      zoneD: {
        name: "Zone-D — مركز الخدمات",
        income8Years: ZONE_D.ownerIncome8Years * sharePercentage,
        annualAverage: (ZONE_D.ownerIncome8Years * sharePercentage) / 8,
        risk: ZONE_D.risk,
      },
      total: {
        income8Years: totalOwnerIncome8Years * sharePercentage,
        annualAverage: (totalOwnerIncome8Years * sharePercentage) / 8,
        roi: investment > 0 ? ((totalOwnerIncome8Years * sharePercentage) / investment) * 100 : 0,
      }
    };
  };

  const returns = calculateZoneReturns(investmentAmount);
  const sharePercentage = calculateInvestorShare(investmentAmount);

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">حاسبة حصة المستثمر</h1>
        <p className="text-slate-600">
          احسب حصتك وعوائدك المتوقعة من المناطق الأربعة في مشروع NALP
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">مبلغ الاستثمار</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">مبلغ الاستثمار (ريال سعودي)</label>
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              min="0"
              step="100000"
              className="w-full rounded border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-sm text-indigo-600 font-medium">نسبة ملكيتك</p>
              <p className="text-2xl font-bold text-indigo-900">{sharePercentage.toFixed(4)}%</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-sm text-emerald-600 font-medium">إجمالي العائد (8 سنوات)</p>
              <p className="text-2xl font-bold text-emerald-900">{formatSAR(returns.total.income8Years)}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{returns.zoneA.name}</h3>
            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">{returns.zoneA.risk}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">عائد 8 سنوات:</span>
              <span className="font-bold text-slate-900">{formatSAR(returns.zoneA.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">متوسط سنوي:</span>
              <span className="font-bold text-slate-900">{formatSAR(returns.zoneA.annualAverage)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{returns.zoneB.name}</h3>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">{returns.zoneB.risk}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">عائد 8 سنوات:</span>
              <span className="font-bold text-slate-900">{formatSAR(returns.zoneB.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">متوسط سنوي:</span>
              <span className="font-bold text-slate-900">{formatSAR(returns.zoneB.annualAverage)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{returns.zoneC.name}</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{returns.zoneC.risk}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">عائد 8 سنوات:</span>
              <span className="font-bold text-slate-900">{formatSAR(returns.zoneC.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">متوسط سنوي:</span>
              <span className="font-bold text-slate-900">{formatSAR(returns.zoneC.annualAverage)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{returns.zoneD.name}</h3>
            <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">{returns.zoneD.risk}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">عائد 8 سنوات:</span>
              <span className="font-bold text-slate-900">{formatSAR(returns.zoneD.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">متوسط سنوي:</span>
              <span className="font-bold text-slate-900">{formatSAR(returns.zoneD.annualAverage)}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-2 border-indigo-200">
        <h2 className="text-xl font-bold mb-4 text-slate-800">ملخص الاستثمار</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-slate-600">مبلغ الاستثمار:</span>
            <span className="font-bold text-slate-900">{formatSAR(investmentAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-xl">
            <span className="text-slate-600">إجمالي العائد (8 سنوات):</span>
            <span className="font-bold text-emerald-600">{formatSAR(returns.total.income8Years)}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-slate-600">متوسط العائد السنوي:</span>
            <span className="font-bold text-slate-900">{formatSAR(returns.total.annualAverage)}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-slate-600">نسبة العائد على الاستثمار (ROI):</span>
            <span className="font-bold text-indigo-600">{returns.total.roi.toFixed(2)}%</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-slate-50 border-none shadow-none">
        <h2 className="text-lg font-bold mb-3 text-slate-800 flex items-center gap-2">
          <span>⚠️</span> ملاحظات هامة
        </h2>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex gap-2">
            <span>•</span>
            <span>الأرقام المعروضة هي توقعات بناءً على الدراسات المالية الحالية وتخضع للتغيير.</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>قيمة المشروع الكلية المفترضة: 75,000,000 ريال سعودي (لأغراض الحساب).</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>إجمالي دخل الملاك خلال 8 سنوات: {formatSAR(totalOwnerIncome8Years)}.</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>العوائد الفعلية تعتمد على أداء التشغيل الفعلي لكل منطقة والظروف السوقية.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
