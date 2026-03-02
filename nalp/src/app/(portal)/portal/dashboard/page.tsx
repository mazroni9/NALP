import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { formatSAR, formatNumber } from "@/lib/formatNumber";
import {
  PROJECT_TOTALS,
  REQUIRED_CAPITAL,
  type ZoneId,
} from "@/lib/financialCanon";

const ZONE_IDS: ZoneId[] = ["A", "B", "C", "D"];

const ZONE_HOW_EARN: Record<ZoneId, string> = {
  A: "عمولات مزاد السيارات — إيراد من كل عملية بيع",
  B: "تأجير مواقف — إيراد يومي وشهري من المواقف",
  C: "سكن موظفين — إيجارات شهرية مستقرة من 198 غرفة",
  D: "مركز صيانة وخدمات — إيراد من العمليات والتشغيل",
};

const DEAL_MODEL: Record<ZoneId, string> = {
  A: "مشاركة أرباح حتى 50% حسب التمويل",
  B: "مشاركة أرباح حتى 50% حسب التمويل",
  C: "مشاركة أرباح حتى 50% حسب التمويل",
  D: "Waterfall: 90% قبل التعادل، 50% بعده",
};

export default function PortalDashboardPage() {
  return (
    <div className="p-8" dir="rtl">
      {/* A) Hero Section */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold text-slate-800">
          أدوات المستثمر — نظرة استثمارية
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600 leading-relaxed">
          NALP مجمع سيارات وخدمات لوجستية متعدد مصادر الدخل يجمع بين المزادات،
          التخزين، المواقف، سكن الموظفين، ومركز صيانة متكامل.
        </p>
        <p className="mt-2 text-base font-semibold text-indigo-600">
          أربعة محركات دخل مستقلة ضمن مجمع واحد.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/portal/scenarios"
            className="w-fit rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700"
          >
            استكشف السيناريوهات
          </Link>
          <Link
            href="/portal/investors"
            className="text-sm underline text-slate-500 transition hover:text-indigo-600"
          >
            انتقل إلى حاسبة حصة المستثمر
          </Link>
        </div>
      </section>

      {/* فرصة السوق */}
      <section className="mb-12">
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

      {/* B) Executive Snapshot */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          Executive Snapshot
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 transition-all hover:shadow-md">
            <p className="text-sm text-slate-500">إجمالي دخل الملاك 8 سنوات</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatSAR(PROJECT_TOTALS.ownerTotalIncome8Years)}
            </p>
          </Card>
          <Card className="p-4 transition-all hover:shadow-md">
            <p className="text-sm text-slate-500">متوسط الدخل السنوي</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatSAR(PROJECT_TOTALS.avgAnnualIncome)}
            </p>
          </Card>
          <Card className="p-4 transition-all hover:shadow-md">
            <p className="text-sm text-slate-500">التقييم المتوقع</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatSAR(PROJECT_TOTALS.valuationAtExit)}
            </p>
          </Card>
          <Card className="p-4 transition-all hover:shadow-md">
            <p className="text-sm text-slate-500">عدد المناطق</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatNumber(PROJECT_TOTALS.zonesCount, {
                maximumFractionDigits: 0,
              })}
            </p>
          </Card>
        </div>
      </section>

      {/* هيكل الاستثمار */}
      <section className="mb-12">
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

      {/* C) Zones Overview */}
      <section className="mb-12">
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
                  {ZONE_HOW_EARN[zoneId]}
                </p>
                <div className="mt-4 flex flex-1 flex-col gap-2 border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500">رأس المال المطلوب</p>
                  <p className="font-bold text-indigo-600">
                    {formatSAR(required)}
                  </p>
                  <p className="text-xs text-slate-500">نموذج الصفقة</p>
                  <p className="text-sm font-medium text-slate-700">
                    {DEAL_MODEL[zoneId]}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* D) Why Invest */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          لماذا الاستثمار في NALP؟
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <h4 className="font-semibold text-indigo-600">
              تنويع مصادر الدخل
            </h4>
            <p className="mt-2 text-sm text-slate-600">
              4 مناطق مستقلة تخفّف المخاطر وتوزّع العائد بين المزاد، المواقف،
              السكن، ومركز الخدمات.
            </p>
          </Card>
          <Card className="p-5">
            <h4 className="font-semibold text-indigo-600">
              وضوح الصفقة وشفافية الحسابات
            </h4>
            <p className="mt-2 text-sm text-slate-600">
              نموذج مشاركة أرباح واضح عبر returnsEngine — حسابات شفافة وقابلة
              للتحقق.
            </p>
          </Card>
          <Card className="p-5">
            <h4 className="font-semibold text-indigo-600">
              قابلية التوسع والتشغيل
            </h4>
            <p className="mt-2 text-sm text-slate-600">
              موقع استراتيجي على محور الجبيل–الظهران، مع إمكانية التوسع
              والتشغيل المستدام.
            </p>
          </Card>
        </div>
      </section>

      {/* E) Next Steps */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          الخطوات التالية
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/portal/investors"
            className="flex flex-1 min-w-[200px] items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-indigo-700"
          >
            حاسبة حصة المستثمر
          </Link>
          <Link
            href="/portal/scenarios"
            className="flex flex-1 min-w-[200px] items-center justify-center rounded-xl border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
          >
            السيناريوهات المالية
          </Link>
          <Link
            href="/portal/data-room"
            className="flex flex-1 min-w-[200px] items-center justify-center rounded-xl border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
          >
            غرفة البيانات
          </Link>
        </div>
      </section>

      <p className="mt-12 text-center text-sm text-slate-500">
        تنبيه: الأرقام المعروضة تقديرية ومبنية على افتراضات تشغيلية قابلة للتغير وليست تعهدًا بالعائد.
      </p>
    </div>
  );
}
