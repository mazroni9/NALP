import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function PortalDashboardPage() {
  return (
    <div className="p-8">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-slate-800">أدوات المستثمر</h1>
        <p className="mt-1 text-slate-600">ادرس التفاصيل الكاملة، شغّل السيناريوهات المالية، وتصفح وثائق المشروع.</p>
      </header>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-500">
            أدوات البوابة
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/portal/data-room">
              <Card className="h-full cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
                <h2 className="text-lg font-semibold text-indigo-600">
                  غرفة البيانات
                </h2>
                <p className="mt-2 text-slate-600">
                  تصفح وتنزيل المستندات القانونية والمالية والفنية.
                </p>
              </Card>
            </Link>
            <Link href="/portal/scenarios">
              <Card className="h-full cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
                <h2 className="text-lg font-semibold text-indigo-600">
                  السيناريوهات
                </h2>
                <p className="mt-2 text-slate-600">
                  إنشاء ومقارنة السيناريوهات المالية.
                </p>
              </Card>
            </Link>
            <Link href="/portal/partners">
              <Card className="h-full cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
                <h2 className="text-lg font-semibold text-indigo-600">
                  لوحة الشركاء — ملاك الأرض
                </h2>
                <p className="mt-2 text-slate-600">
                  تصفح حصتك وبيانات الشركاء.
                </p>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
