import { Card } from "@/components/ui/Card";

export default function LocationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800">الموقع</h1>
      <p className="mt-2 text-slate-600">
        موقع استراتيجي على محور الجبيل–الظهران.
      </p>

      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">محور الجبيل–الظهران</h2>
          <p className="mt-2 text-slate-600">
            يقع NALP بشكل استراتيجي على طول ممر الجبيل–الظهران الحيوي،
            مما يوفر اتصالاً ممتازاً بالمناطق الصناعية والموانئ والمراكز
            الحضرية. يستفيد الموقع من القرب من الطرق الرئيسية ومراكز اللوجستيات.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">الربطية</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
            <li>مدينة الجبيل الصناعية</li>
            <li>الظهران / الدمام</li>
            <li>ميناء الملك فهد الصناعي</li>
            <li>وصول للطرق الرئيسية</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
