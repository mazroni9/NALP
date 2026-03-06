import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/formatNumber";
import { LAND } from "@/lib/projectData";
import Link from "next/link";

const keyNumbers = [
  {
    label: "إجمالي مساحة الأرض",
    value: `${formatNumber(LAND.totalArea)} م²`,
    subValue: `منها ${formatNumber(LAND.netDevelopableArea)} م² صافٍ قابل للتطوير`,
  },
  { label: "المناطق", value: "4" },
  { label: "المنطقة أ (المزاد)", value: "منصة وعرض" },
  { label: "المنطقة ب (إيواء المركبات)", value: "تخزين ومواقف" },
  { label: "المنطقة ج (سكن الموظفين والمرافق)", value: "G+2 ومرافق مركزية" },
  { label: "المنطقة د (استثمارية على الشارع)", value: "معارض وورش ومكاتب" },
];

export default function HomePage() {
  return (
    <div className="relative">
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 px-4 py-10 text-white sm:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            مجمع النابية للسيارات والخدمات اللوجستية (NALP)
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-indigo-100">
            مشروع تطوير متعدد الاستخدامات يجمع بين إسكان العمالة وخدمات
            السيارات والمزادات والتخزين—بموقع استراتيجي على محور الجبيل–الظهران.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link href="/asset-zones">
              <Button variant="secondary" className="!bg-white !text-indigo-600 hover:!bg-indigo-50">
                استكشف المناطق
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="!border-white !text-white hover:!bg-white/10">
                طلب اتفاقية عدم إفصاح
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-4 py-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white">
            مركز النابية — عرض مرئي للمشروع
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200">
            مقطع تعريفي يوضّح فكرة مشروع NALP ومركز النابية للخدمات اللوجستية على أرض الواقع.
          </p>
          <div className="mt-6 mx-auto max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-black aspect-video">
            <iframe
              src="https://player.vimeo.com/video/1171118477"
              title="مركز النابية — عرض مرئي للمشروع"
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            إن لم يظهر الفيديو،
            <a
              href="https://vimeo.com/1171118477?share=copy&fl=sv&fe=ci"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:underline ml-1"
            >
              افتح رابط Vimeo مباشرة
            </a>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-800">
          أرقام رئيسية
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {keyNumbers.map((item, i) => (
            <Card key={i}>
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-indigo-600">
                {item.value}
              </p>
              {"subValue" in item && item.subValue && (
                <p className="mt-1 text-sm text-slate-400">{item.subValue}</p>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-100 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            بوابة المستثمر واستوديو التصميم
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            تصفح غرفة البيانات، شغّل سيناريوهات مالية، وصمم تخطيطات الأراضي
            باستخدام استوديو التصميم المعزز بالذكاء الاصطناعي.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/portal">
              <Button>دخول البوابة</Button>
            </Link>
            <Link href="/studio">
              <Button variant="outline">استوديو التصميم</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
