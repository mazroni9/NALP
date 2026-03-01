import { Card } from "@/components/ui/Card";
import { formatNumber, formatSAR } from "@/lib/formatNumber";
import Link from "next/link";
import { ZONE_CONFIGS, ZONE_DIMENSIONS } from "@/lib/nalpLandSketch";
import { ZoneSketch } from "@/components/asset-zones/ZoneSketch";
import { RoomLayoutSketch } from "@/components/asset-zones/RoomLayoutSketch";
import { ROOMS_PER_BUILDING } from "@/lib/roomLayout";
import { computeZoneCAreas } from "@/lib/zoneCAreas";

const zone = ZONE_CONFIGS.find((z) => z.id === "c")!;
const dims = ZONE_DIMENSIONS.find((z) => z.id === "c")!;
const zoneCAreas = computeZoneCAreas();

export default function ZoneCPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/asset-zones" className="text-sm text-indigo-600 hover:underline">
        → العودة للمناطق
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-800">
        المنطقة ج: {zone.title}
      </h1>
      <p className="mt-2 text-slate-600">{zone.shortDesc}</p>

      <Card className="mt-8">
        <h2 className="text-lg font-semibold">اسكتش الأبعاد والحدود</h2>
        <p className="mt-2 text-sm text-slate-600">
          6 مباني و5 مواقف (25م بينها)، مبنى شرقي 7×7م ومباني وسطية 14×14م. المتبقي (6 م طولي) مواقف بين مبنى 6 ومنطقة
          الإيواء. المساحة المتبقية من عمق 52.5م بعد استخدام 48.5م للمباني = 4م تُخصَّص كطريق يربط
          ساحات المواقف من خلف المباني مع بعضها. تُخصَّص الغرف السفلية من مبنى 6 مكاتب لقسم الإيواء
          وخدمات مثل ميني سوبرماركت ومقهى صغير ومغسلة.
        </p>
        <div className="mt-4">
          <ZoneSketch
            dims={dims}
            zoneCLayout={{ eastBuildingWidthM: 7, middleBuildingWidthM: 14, parkingWidthM: 25 }}
          />
        </div>
      </Card>

      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">الوصف</h2>
          <p className="mt-2 text-slate-600">{zone.description}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">تخطيط الغرف لكل مبنى</h2>
          <p className="mt-2 text-sm text-slate-600">
            عمق 7 م، عرض كل غرفة 5 م، منطقة الدرج 3.5 م. العرض الكلي لا يتجاوز 52.5 م.
          </p>
          <div className="mt-4">
            <RoomLayoutSketch />
          </div>
          <div className="mt-4 rounded-md bg-amber-50 border border-amber-200 px-4 py-3">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">عدد الغرف لكل مبنى</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>
                <strong>مبنى 1</strong> (7م): {ROOMS_PER_BUILDING["7m"].perFloor} غرفة/طابق — إجمالي{" "}
                {ROOMS_PER_BUILDING["7m"].total} غرفة
              </li>
              <li>
                <strong>مباني 2–6</strong> (14م): {ROOMS_PER_BUILDING["14m"].perFloor} غرفة/طابق —
                إجمالي {ROOMS_PER_BUILDING["14m"].total} غرفة لكل مبنى
              </li>
            </ul>
            <p className="mt-2 text-sm text-slate-600">
              المجموع: {ROOMS_PER_BUILDING["7m"].total + 5 * ROOMS_PER_BUILDING["14m"].total} غرفة
            </p>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">حساب المساحات</h2>
          <p className="mt-2 text-sm text-slate-600 mb-4">
            تفصيل مساحات المباني والمواقف والطريق ٤م لاستخدامها في بطاقة تقدير التكاليف.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 px-3 py-2 text-right">المبنى</th>
                  <th className="border border-slate-200 px-3 py-2 text-right">العرض × العمق</th>
                  <th className="border border-slate-200 px-3 py-2 text-right">المساحة (م²)</th>
                </tr>
              </thead>
              <tbody>
                {zoneCAreas.buildings.map((b) => (
                  <tr key={b.id}>
                    <td className="border border-slate-200 px-3 py-2">مبنى {b.id}</td>
                    <td className="border border-slate-200 px-3 py-2">{b.widthM} × {b.depthM} م</td>
                    <td className="border border-slate-200 px-3 py-2 font-medium">{formatNumber(b.areaM2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 space-y-2 rounded-lg bg-slate-50 border border-slate-200 p-4">
            <p className="flex justify-between">
              <span className="font-semibold text-slate-700">مجموع المباني:</span>
              <span>{formatNumber(zoneCAreas.buildingsTotalM2)} م²</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold text-slate-700">ساحات المواقف:</span>
              <span>{formatNumber(zoneCAreas.parkingsTotalM2)} م²</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold text-slate-700">طريق ٤م (خلف المباني):</span>
              <span>{formatNumber(zoneCAreas.roadM2)} م²</span>
            </p>
            <p className="flex justify-between pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-800">إجمالي المنطقة ج:</span>
              <span>{formatNumber(zoneCAreas.zoneTotalM2)} م²</span>
            </p>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">تقدير التكاليف</h2>
          <p className="mt-2 text-sm text-slate-600 mb-4">
            تكلفة المباني: ١٬٠٠٠ ريال/م². تسوية المواقف والشوارع والبنية التحتية (كهرباء، هاتف، مجاري، إلخ): ٢٠٠ ريال/م².
          </p>
          <div className="space-y-3 rounded-lg bg-slate-50 border border-slate-200 p-4">
            <p className="flex justify-between text-sm">
              <span className="text-slate-700">تكلفة المباني ({formatNumber(zoneCAreas.buildingsTotalM2)} م² × ١٬٠٠٠ ر.س):</span>
              <span className="font-semibold">{formatSAR(zoneCAreas.buildingsTotalM2 * 1000)}</span>
            </p>
            <p className="flex justify-between text-sm">
              <span className="text-slate-700">المواقف + الطريق ({formatNumber(zoneCAreas.parkingsTotalM2)} + {formatNumber(zoneCAreas.roadM2)} م² × ٢٠٠ ر.س):</span>
              <span className="font-semibold">{formatSAR((zoneCAreas.parkingsTotalM2 + zoneCAreas.roadM2) * 200)}</span>
            </p>
            <p className="flex justify-between pt-3 border-t border-slate-200">
              <span className="font-bold text-slate-800">إجمالي التكلفة التقديرية:</span>
              <span className="font-bold text-indigo-700">
                {formatSAR(zoneCAreas.buildingsTotalM2 * 1000 + (zoneCAreas.parkingsTotalM2 + zoneCAreas.roadM2) * 200)}
              </span>
            </p>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">المميزات الرئيسية</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
            <li>مباني سكنية حديثة بطابقين (G+2)</li>
            <li>حوالي 198 غرفة بنمط استوديو</li>
            <li>مبنى 6 — الطابق الأرضي: مكاتب لقسم الإيواء، سوبرماركت صغير، مغسلة، وخدمات</li>
            <li>ساحات خضراء طولية وممرات مشاة</li>
          </ul>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">جدوى المساحة لـ 198 غرفة</h2>
          <p className="mt-2 text-slate-600">
            على الطول 208 م: مبنى شرقي 7م يطل شرقاً، مواقف 25م، مباني وسطية 14م (ظهر لظهر — جزء يطل على
            المواقف وجزء على ساحة الإيواء)، وبين المبنى الشرقي وساحة الإيواء مواقف مهما كان حجمها.
          </p>
          <p className="mt-2 text-slate-600">
            العمق الكلي 52.5 م يوفّر مجالاً للمباني (7م أو 14م) ومساحات المواقف مع هامش للممرات.
            التصميم النهائي يعتمد على أبعاد وحدات C BOX الفعلية ومتطلبات البناء.
          </p>
        </Card>
      </div>
    </div>
  );
}
