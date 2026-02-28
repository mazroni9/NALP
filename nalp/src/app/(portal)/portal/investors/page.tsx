"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumber } from "@/lib/formatNumber";
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
        roi: ((totalOwnerIncome8Years * sharePercentage) / investment) * 100,
      }
    };
  };

  const returns = calculateZoneReturns(investmentAmount);
  const sharePercentage = calculateInvestorShare(investmentAmount);

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">حاسبة حصة المستثمر</h1>
        <p className="text-muted-foreground">
          احسب حصتك وعوائدك المتوقعة من المناطق الأربعة في مشروع NALP
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>مبلغ الاستثمار</CardTitle>
          <CardDescription>
            أدخل المبلغ الذي تنوي استثماره لحساب حصتك وعوائدك المتوقعة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="investment">مبلغ الاستثمار (ريال سعودي)</Label>
            <Input
              id="investment"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              min="0"
              step="100000"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">نسبة ملكيتك</p>
              <p className="text-2xl font-bold">{sharePercentage.toFixed(4)}%</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">إجمالي العائد (8 سنوات)</p>
              <p className="text-2xl font-bold">{formatNumber(returns.total.income8Years)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{returns.zoneA.name}</span>
              <span className="text-sm font-normal text-muted-foreground">{returns.zoneA.risk}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">عائد 8 سنوات:</span>
              <span className="font-bold">{formatNumber(returns.zoneA.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">متوسط سنوي:</span>
              <span className="font-bold">{formatNumber(returns.zoneA.annualAverage)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{returns.zoneB.name}</span>
              <span className="text-sm font-normal text-muted-foreground">{returns.zoneB.risk}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">عائد 8 سنوات:</span>
              <span className="font-bold">{formatNumber(returns.zoneB.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">متوسط سنوي:</span>
              <span className="font-bold">{formatNumber(returns.zoneB.annualAverage)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{returns.zoneC.name}</span>
              <span className="text-sm font-normal text-muted-foreground">{returns.zoneC.risk}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">عائد 8 سنوات:</span>
              <span className="font-bold">{formatNumber(returns.zoneC.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">متوسط سنوي:</span>
              <span className="font-bold">{formatNumber(returns.zoneC.annualAverage)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{returns.zoneD.name}</span>
              <span className="text-sm font-normal text-muted-foreground">{returns.zoneD.risk}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">عائد 8 سنوات:</span>
              <span className="font-bold">{formatNumber(returns.zoneD.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">متوسط سنوي:</span>
              <span className="font-bold">{formatNumber(returns.zoneD.annualAverage)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>ملخص الاستثمار</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-lg">
            <span>مبلغ الاستثمار:</span>
            <span className="font-bold">{formatNumber(investmentAmount)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>إجمالي العائد (8 سنوات):</span>
            <span className="font-bold text-green-600">{formatNumber(returns.total.income8Years)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>متوسط العائد السنوي:</span>
            <span className="font-bold">{formatNumber(returns.total.annualAverage)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>نسبة العائد على الاستثمار (ROI):</span>
            <span className="font-bold text-blue-600">{returns.total.roi.toFixed(2)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>ملاحظات هامة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>الأرقام المعروضة هي توقعات بناءً على الدراسات المالية الحالية</li>
            <li>قيمة المشروع الكلية المفترضة: 75 مليون ريال سعودي</li>
            <li>إجمالي دخل الملاك خلال 8 سنوات: {formatNumber(totalOwnerIncome8Years)}</li>
            <li>العوائد قد تختلف بناءً على الأداء الفعلي والظروف السوقية</li>
            <li>يُنصح بمراجعة جميع الوثائق المالية قبل اتخاذ قرار الاستثمار</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { formatNumber } from "@/lib/formatNumber";
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
        <h1 className="text-3xl font-bold">حاسبة حصة المستثمر</h1>
        <p className="text-muted-foreground">
          احسب حصتك وعوائدك المتوقعة من المناطق الأربعة في مشروع NALP
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>مبلغ الاستثمار</CardTitle>
          <CardDescription>
            أدخل المبلغ الذي تنوي استثماره لحساب حصتك وعوائدك المتوقعة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="investment">مبلغ الاستثمار (ريال سعودي)</Label>
            <Input
              id="investment"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              min="0"
              step="100000"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">نسبة ملكيتك</p>
              <p className="text-2xl font-bold">{sharePercentage.toFixed(4)}%</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">إجمالي العائد (8 سنوات)</p>
              <p className="text-2xl font-bold">{formatNumber(returns.total.income8Years)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{returns.zoneA.name}</span>
              <span className="text-sm font-normal text-muted-foreground">{returns.zoneA.risk}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">عائد 8 سنوات:</span>
              <span className="font-bold">{formatNumber(returns.zoneA.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">متوسط سنوي:</span>
              <span className="font-bold">{formatNumber(returns.zoneA.annualAverage)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{returns.zoneB.name}</span>
              <span className="text-sm font-normal text-muted-foreground">{returns.zoneB.risk}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">عائد 8 سنوات:</span>
              <span className="font-bold">{formatNumber(returns.zoneB.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">متوسط سنوي:</span>
              <span className="font-bold">{formatNumber(returns.zoneB.annualAverage)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{returns.zoneC.name}</span>
              <span className="text-sm font-normal text-muted-foreground">{returns.zoneC.risk}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">عائد 8 سنوات:</span>
              <span className="font-bold">{formatNumber(returns.zoneC.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">متوسط سنوي:</span>
              <span className="font-bold">{formatNumber(returns.zoneC.annualAverage)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{returns.zoneD.name}</span>
              <span className="text-sm font-normal text-muted-foreground">{returns.zoneD.risk}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">عائد 8 سنوات:</span>
              <span className="font-bold">{formatNumber(returns.zoneD.income8Years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">متوسط سنوي:</span>
              <span className="font-bold">{formatNumber(returns.zoneD.annualAverage)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>ملخص الاستثمار</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-lg">
            <span>مبلغ الاستثمار:</span>
            <span className="font-bold">{formatNumber(investmentAmount)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>إجمالي العائد (8 سنوات):</span>
            <span className="font-bold text-green-600">{formatNumber(returns.total.income8Years)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>متوسط العائد السنوي:</span>
            <span className="font-bold">{formatNumber(returns.total.annualAverage)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>نسبة العائد على الاستثمار (ROI):</span>
            <span className="font-bold text-blue-600">{returns.total.roi.toFixed(2)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>ملاحظات هامة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>الأرقام المعروضة هي توقعات بناءً على الدراسات المالية الحالية</li>
            <li>قيمة المشروع الكلية المفترضة: 75 مليون ريال سعودي</li>
            <li>إجمالي دخل الملاك خلال 8 سنوات: {formatNumber(totalOwnerIncome8Years)}</li>
            <li>العوائد قد تختلف بناءً على الأداء الفعلي والظروف السوقية</li>
            <li>يُنصح بمراجعة جميع الوثائق المالية قبل اتخاذ قرار الاستثمار</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
