import { Card } from "@/components/ui/Card";
import Link from "next/link";

const MAP_EMBED_URL =
  "https://www.google.com/maps?q=26.470227,50.0134976&hl=ar&z=17&output=embed";
const MAP_LINK =
  "https://www.google.com/maps/place/%D9%85%D9%84%D8%A7%D8%B9%D8%A8+%D8%A7%D9%84%D9%83%D9%84%D8%A7%D8%B3%D9%83%D9%88/@26.4706785,50.01714,17.25z";

export default function LocationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800">الموقع</h1>
      <p className="mt-2 text-slate-600">
        موقع استراتيجي على محور الجبيل–الظهران.
      </p>

      <Card className="mt-8 overflow-hidden p-0">
        <div className="aspect-video w-full">
          <iframe
            src={MAP_EMBED_URL}
            width="100%"
            height="100%"
            className="h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="موقع NALP على الخريطة"
          />
        </div>
        <div className="border-t border-slate-200 p-4">
          <Link
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            فتح الموقع في خرائط جوجل (ملاعب الكلاسكو) ←
          </Link>
        </div>
      </Card>

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
          <p className="mt-2 text-slate-600">
            يرتبط الموقع استراتيجيًا بأهم الموانئ البحرية والطرق السريعة في المنطقة، مما يعزز كفاءته اللوجستية وقدرته على خدمة أسواق الدمام والجبيل وبقية مدن المملكة.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
            <li>مدينة الجبيل الصناعية</li>
            <li>الظهران / الدمام</li>
            <li>ميناء الملك فهد الصناعي بالجبيل</li>
            <li>ميناء الملك عبدالعزيز بالدمام (ميناء الحاويات والتجارة العامة)</li>
            <li>الشبكة الرئيسة للطرق السريعة</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
