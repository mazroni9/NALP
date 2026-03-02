import { Card } from "@/components/ui/Card";
import { formatSAR, formatNumber } from "@/lib/formatNumber";
import { REQUIRED_CAPITAL, type ZoneId } from "@/lib/financialCanon";
import { computeProjectTotalsFromEngine } from "@/lib/calculators/projectTotalsEngine";

const TOTALS = computeProjectTotalsFromEngine({ years: 8 });
const ZONE_IDS: ZoneId[] = ["A", "B", "C", "D"];

const ZONE_HOW_EARN: Record<ZoneId, string> = {
  A: "عمولات مزاد السيارات — إيراد من كل عملية بيع",
  B: "تأجير مواقف — إيراد يومي وشهري من المواقف",
  C: "سكن موظفين — إيجارات شهرية مستقرة من 198 غرفة",
  D: "مركز صيانة وخدمات — إيراد من العمليات والتشغيل",
};

const DEAL_MODEL_SHORT: Record<ZoneId, string> = {
  A: "مشاركة أرباح حتى 50%",
  B: "مشاركة أرباح حتى 50%",
  C: "مشاركة أرباح حتى 50%",
  D: "Waterfall 90% قبل التعادل / 50% بعده",
};

export default function PortalDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 p-8" dir="rtl">
      {/* Hero Section — نظيف بدون أزرار */}
      <section>
        <h1 className="text-3xl font-bold text-slate-800">
          أدوات المستثمر — نظرة استثمارية
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600 leading-relaxed">
          NALP مجمع سيارات وخدمات لوجستية يجمع المزاد والمواقف والسكن ومركز
          الصيانة ضمن مجمع واحد.
        </p>
        <p className="mt-2 max-w-2xl text-base text-slate-600 leading-relaxed">
          أربعة محركات دخل مستقلة — تخفيف مخاطر وتنويع عائد.
        </p>
        <p className="mt-3 text-sm text-slate-500">
          آخر تحديث: اليوم
        </p>
      </section>

      {/* فرصة السوق */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          فرصة السوق
        </h2>
        <Card className="p-5">
          <p className="text-slate-600 leading-relaxed">
            سوق السيارات المستعملة يعاني من تشتّت الخدمات وضعف التنظيم وارتفاع تكلفة التشغيل على الأطراف المختلفة.
          </p>
          <p className="mt-3 text-slate-600 leading-relaxed">
            NALP يجمع المزاد والخدمات والسكن والمواقف داخل مجمع واحد لتكوين مصادر دخل متعددة ومترابطة.
          </p>
        </Card>
      </section>

      {/* Executive Snapshot */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          Executive Snapshot
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 transition-all hover:shadow-md">
            <p className="text-sm text-slate-500">إجمالي دخل الملاك (8 سنوات)</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatSAR(TOTALS.ownerTotalIncome8Years)}
            </p>
          </Card>
          <Card className="p-4 transition-all hover:shadow-md">
            <p className="text-sm text-slate-500">متوسط دخل سنوي</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatSAR(TOTALS.avgAnnualIncome)}
            </p>
          </Card>
          <Card className="p-4 transition-all hover:shadow-md">
            <p className="text-sm text-slate-500">التقييم المتوقع (Cap Rate 9%)</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatSAR(TOTALS.valuationAtExit)}
            </p>
          </Card>
          <Card className="p-4 transition-all hover:shadow-md">
            <p className="text-sm text-slate-500">عدد محركات الدخل</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatNumber(TOTALS.zonesCount, {
                maximumFractionDigits: 0,
              })}
            </p>
          </Card>
        </div>
      </section>

      {/* هيكل الاستثمار */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          هيكل الاستثمار
        </h2>
        <Card className="p-5">
          <ul className="list-inside list-disc space-y-2 text-slate-600">
            <li>
              Zones A/B/C: مشاركة أرباح حتى 50% حسب نسبة التمويل من رأس المال المطلوب.
            </li>
            <li>
              Zone D: Waterfall — 90% قبل التعادل، 50% بعده.
            </li>
            <li>
              رأس المال المطلوب لكل منطقة محدد مسبقًا ويُستخدم لحساب نسبة التمويل.
            </li>
          </ul>
        </Card>
      </section>

      {/* محركات الدخل — بطاقات تفسير */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          محركات الدخل
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ZONE_IDS.map((zoneId) => {
            const required = REQUIRED_CAPITAL[zoneId];
            return (
              <Card
                key={zoneId}
                className="flex flex-col p-4 transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-800">
                  المنطقة {zoneId}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-medium">كيف يربح؟</span>{" "}
                  {ZONE_HOW_EARN[zoneId]}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-medium">نموذج الصفقة:</span>{" "}
                  {DEAL_MODEL_SHORT[zoneId]}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-medium">رأس المال المطلوب:</span>{" "}
                  {formatSAR(required)}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* لماذا الاستثمار في NALP؟ — 4 نقاط حاسمة */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          لماذا الاستثمار في NALP؟
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <h4 className="font-semibold text-indigo-600">تنويع دخل (4 مصادر)</h4>
            <p className="mt-2 text-sm text-slate-600">
              المزاد، المواقف، السكن، ومركز الصيانة — تخفيف مخاطر وتوزيع عائد.
            </p>
          </Card>
          <Card className="p-5">
            <h4 className="font-semibold text-indigo-600">حماية تشغيلية (OPEX سقف 25% بالمزاد)</h4>
            <p className="mt-2 text-sm text-slate-600">
              سقف مصاريف تشغيلية يحمي الربحية ويحدّ التقلبات.
            </p>
          </Card>
          <Card className="p-5">
            <h4 className="font-semibold text-indigo-600">شفافية الحسابات (محرك returnsEngine + دفتر تشغيل)</h4>
            <p className="mt-2 text-sm text-slate-600">
              نموذج مشاركة أرباح واضح — حسابات قابلة للتحقق ودفتر تشغيل شهري.
            </p>
          </Card>
          <Card className="p-5">
            <h4 className="font-semibold text-indigo-600">قابلية التوسع</h4>
            <p className="mt-2 text-sm text-slate-600">
              زيادة سيارات/عمولات دون تغيير البنية — نمو مرن في نفس المجمع.
            </p>
          </Card>
        </div>
      </section>

      {/* ملاحظات مهمة */}
      <section>
        <Card className="p-5">
          <h3 className="mb-3 font-semibold text-slate-800">ملاحظات</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• الأرقام تقديرية تشغيلية وليست التزامًا.</li>
            <li>• النتائج تتغير حسب دفتر التشغيل (الميزانية).</li>
            <li>• نقطة التعادل تغيّر توزيع الأرباح (قبل/بعد).</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
