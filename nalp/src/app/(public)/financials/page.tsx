import {
  SnapshotCards,
  AssumptionsPanel,
  ZoneCards,
  IncomeChart,
  ValuationSimulator,
  ShareBar,
} from "@/components/financials";
import { Card } from "@/components/ui/Card";

export default function FinancialsPage() {
  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 1) Hero / عنوان الصفحة */}
        <header className="mb-12">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
            Public Investor View
          </span>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">لوحة المستثمر</h1>
          <p className="mt-2 text-lg text-slate-600">
            ملخص استثماري لمشروع NALP — 8 سنوات
          </p>
        </header>

        <section className="space-y-12">
          {/* 2) Executive Snapshot */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Executive Snapshot
            </h2>
            <SnapshotCards />
          </div>

          {/* 3) Assumptions Panel */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              الافتراضات الرئيسية
            </h2>
            <AssumptionsPanel />
          </div>

          {/* 4) Revenue Breakdown by Zone */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              تفصيل الإيرادات حسب المنطقة
            </h2>
            <ZoneCards />
          </div>

          {/* 5) 8-Year Landlord Income Chart */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              تدفق دخل ملاك الأرض عبر السنوات (تقديري)
            </h2>
            <Card className="p-6">
              <IncomeChart />
            </Card>
          </div>

          {/* 6) Valuation Simulator */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              محاكي التقييم
            </h2>
            <ValuationSimulator />
          </div>

          {/* 7) Download / Share Section */}
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

        {/* 8) Footer Disclaimer */}
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
