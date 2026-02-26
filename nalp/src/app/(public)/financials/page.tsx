import { Card } from "@/components/ui/Card";

export default function FinancialsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800">نظرة مالية</h1>
      <p className="mt-2 text-slate-600">
        مقاييس وافتراضات مالية مبسطة.
      </p>

      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">الافتراضات الرئيسية</h2>
          <ul className="mt-4 space-y-2 text-slate-600">
            <li>• معدلات الإشغال</li>
            <li>• سعر السرير (ريال)</li>
            <li>• حد التشغيل (OPEX)</li>
            <li>• افتراضات سعر خروج الأرض</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">جدول الافتراضات</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2">المعامل</th>
                  <th className="py-2">الحالة الأساسية</th>
                  <th className="py-2">المحافظ</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr className="border-b border-slate-100">
                  <td className="py-2">الإشغال</td>
                  <td>85%</td>
                  <td>70%</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2">سعر السرير (ريال)</td>
                  <td>1,200</td>
                  <td>1,000</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2">حد التشغيل</td>
                  <td>25%</td>
                  <td>30%</td>
                </tr>
                <tr>
                  <td className="py-2">مضاعف الخروج</td>
                  <td>1.2x</td>
                  <td>1.0x</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-sm text-slate-500">
          للنماذج المالية التفصيلية ومقارنة السيناريوهات، سجّل الدخول إلى
          بوابة المستثمر.
        </p>
      </div>
    </div>
  );
}
