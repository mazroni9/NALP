import {
  SnapshotCards,
  AssumptionsPanel,
  FinancialsZoneCards,
  IncomeChart,
  ValuationSimulator,
  ShareBar,
  InvestorViewBlock,
} from "@/components/financials";
import { Card } from "@/components/ui/Card";

export default function FinancialsPage() {
  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
            Public Investor View
          </span>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            لوحة المستثمر — Investor Dashboard
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            ملخص استثماري لمشروع NALP — يعتمد على محرك العوائد المركزي
          </p>
        </header>

        <section className="space-y-12">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Executive Snapshot
            </h2>
            <SnapshotCards />
          </div>

          <div className="mt-10 mb-6">
            <h3 className="mb-2 text-lg font-semibold">
              How Zone-A Works (in 90 seconds)
            </h3>
            <p>
              Zone-A is the commission engine of the project. Revenue scales with daily car volume and average commission, while operating expenses are capped at 25%.
            </p>
            <p className="mt-2">Before breakeven:</p>
            <p>• Landowners receive 100 SAR per car.</p>
            <p>• Operating income is calculated and OPEX is applied (max 25%).</p>
            <p className="mt-2">After breakeven:</p>
            <p>• The 100 SAR per car stops.</p>
            <p>• Landowners receive 50% of profit after OPEX.</p>
            <p>• The operator receives 50%.</p>
            <p>• The investor participates through the operator share based on funding ratio.</p>
            <p className="mt-2">
              All figures are engine-derived and governed by the Financial Canon.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              تفصيل المناطق (Zone Cards)
            </h2>
            <FinancialsZoneCards />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Investor View — حاسبة المستثمر
            </h2>
            <InvestorViewBlock />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              الافتراضات الرئيسية
            </h2>
            <AssumptionsPanel />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              تدفق دخل ملاك الأرض عبر السنوات (تقديري)
            </h2>
            <Card className="p-6">
              <IncomeChart />
            </Card>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              محاكي التقييم
            </h2>
            <ValuationSimulator />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              مشاركة وتحميل
            </h2>
            <ShareBar />
          </div>

          <a
            href="/portal"
            className="mt-12 mb-8 flex w-full items-center justify-center rounded-xl bg-[#1e3a5f] px-8 py-4 text-lg text-white transition hover:bg-[#2d5a7f]"
          >
            للاطلاع على التفاصيل الكاملة والسيناريوهات المالية — ادخل البوابة ←
          </a>
        </section>

        <footer className="mt-16 border-t border-slate-200 pt-8">
          <p className="text-center text-sm text-slate-500">
            الأرقام تقديرية مبنية على افتراضات تشغيلية، وتخضع للتحديث حسب
            التنفيذ الفعلي والعقود.
          </p>
        </footer>
      </div>
    </div>
  );
}
