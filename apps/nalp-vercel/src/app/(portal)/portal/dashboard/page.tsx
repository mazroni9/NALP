import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function PortalDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">لوحة المستثمر</h1>
      <p className="mt-1 text-slate-600">
        مرحباً بك في لوحتك. (سيتم إضافة المصادقة لاحقاً)
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link href="/portal/data-room">
          <Card className="cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
            <h2 className="text-lg font-semibold text-indigo-600">غرفة البيانات</h2>
            <p className="mt-2 text-slate-600">تصفح وتنزيل المستندات.</p>
          </Card>
        </Link>
        <Link href="/portal/scenarios">
          <Card className="cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
            <h2 className="text-lg font-semibold text-indigo-600">السيناريوهات</h2>
            <p className="mt-2 text-slate-600">
              إنشاء ومقارنة السيناريوهات المالية.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
