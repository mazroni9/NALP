import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ZONE_CONFIGS, ZONE_DIMENSIONS } from "@/lib/nalpLandSketch";
import { ZoneSketch } from "@/components/asset-zones/ZoneSketch";
import { ZoneALayoutPlan } from "@/components/asset-zones/ZoneALayoutPlan";

const zone = ZONE_CONFIGS.find((z) => z.id === "a")!;
const dims = ZONE_DIMENSIONS.find((z) => z.id === "a")!;

export default function ZoneAPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/asset-zones" className="text-sm text-indigo-600 hover:underline">
        → العودة للمناطق
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-800">
        المنطقة أ: {zone.title}
      </h1>
      <p className="mt-2 text-slate-600">{zone.shortDesc}</p>

      <Card className="mt-8">
        <h2 className="text-lg font-semibold">اسكتش الأبعاد والحدود</h2>
        <div className="mt-4">
          <ZoneSketch dims={dims} />
        </div>
      </Card>

      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">الوصف</h2>
          <p className="mt-2 text-slate-600">{zone.description}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4">الرسم التنفيذي لساحة المزاد</h2>
          <ZoneALayoutPlan />
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">دورة حركة المزاد وإجراءاته</h2>
          <div className="mt-4 space-y-4 text-slate-600">
            <section>
              <h3 className="font-medium text-slate-800">مسار الحركة من الدخول إلى الخروج</h3>
              <ol className="mt-2 list-decimal list-inside space-y-1.5">
                <li><strong>الدخول:</strong> تدخل السيارات من مدخل 7م (شمال شرق) القادمة من طريق الجبيل.</li>
                <li><strong>التوزيع:</strong> تسلك الطريق الداخلي 7م وتُوزَّع على الصفوف العرضية (~150 سيارة).</li>
                <li><strong>التدفق:</strong> تتحرك السيارات من الشمال إلى الجنوب عبر الممرات نحو منصة المزاد.</li>
                <li><strong>المنصة + منطقتا التجميع:</strong> منصة المزاد في المنتصف. على يمينها تُجمَّع السيارات المُباعة لانتظار الخروج مع المشتري؛ على يسارها تُجمَّع السيارات التي انتهى التحريج عليها ولم تُبع وأصحابها غائبون.</li>
                <li><strong>الخروج:</strong> تخرج من مخرج ١ (جنوب غرب) أو مخرج ٢ (جنوب شرق) إلى شارعنا 12.5م.</li>
              </ol>
              <p className="mt-3 text-slate-500 text-sm"><strong>ما بين منطقة التجميع وشارعنا؟</strong> بوابات المخرج فقط (كل منها ٧م) — لا يوجد فاصل أو مساحة إضافية؛ منطقة التجميع تنتهي عند البوابات، والسيارات تعبر منها مباشرةً إلى شارعنا.</p>
            </section>
            <section>
              <h3 className="font-medium text-slate-800">مدة بقاء السيارات في الساحة</h3>
              <p>عادةً تُقام جلسات المزاد في يوم محدد؛ تدخل السيارات وتُعرض وتُباع وتغادر في نفس اليوم. السيارات التي لم تُبع أو تحتاج تأخيراً تغادر خلال 24–48 ساعة حسب سياسة التشغيل.</p>
            </section>
            <section>
              <h3 className="font-medium text-slate-800">تكاليف الاحتفاظ في الساحة</h3>
              <p>يمكن تطبيق رسوم احتفاظ يومية للسيارات التي تتجاوز المدة المسموح بها (مثلاً 24–48 ساعة) دون بيع أو تحريك، لتشجيع الإخلاء السريع وتحفيز الكفاءة التشغيلية.</p>
            </section>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">منطقة صفوف العرض — مساحة واستيعاب</h2>
          <div className="mt-4 space-y-3 text-slate-600">
            <p><strong>هل المنطقة المقابلة لمنصة المزاد فارغة؟</strong> لا، ليست فارغة. هي منطقة <strong>صفوف العرض</strong> المخصصة لوقوف السيارات المعروضة في المزاد. المربعات في الرسم تمثل أماكن وقوف (حوالي 5م × 2.5م لكل سيارة)، وليست سيارات مرسومة.</p>
            <p><strong>أبعاد المنطقة:</strong> العرض ≈ <strong>86 م</strong> (شرق–غرب)، العمق ≈ <strong>36 م</strong> (شمال–جنوب). المساحة الإجمالية ≈ <strong>4,100 م²</strong> (بعد حسم الشريط الغربي 8.5م والطريق الداخلي 7م من إجمالي المنطقة أ ≈5,460 م²).</p>
            <p><strong>هل تَسَع 150 سيارة فعلاً؟</strong> نعم. بفرض وقوف سيارة متوسطة ≈ 5م × 2.5م (12.5 م²)، نحتاج ≈1,875 م² للسيارات فقط. المساحة الباقية (~2,200 م²) للممرات والتنقل. إجمالاً 4,100 م² تكفي لـ ~150 سيارة مع ممرات آمنة.</p>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">المميزات الرئيسية</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
            <li>واجهة المشروع على طريق الجبيل–الدمام</li>
            <li>منصة المزاد ومنطقة العرض المباشر</li>
            <li>مسارات حركة الجمهور والمزايدين</li>
            <li>سهولة دخول السيارات المعروضة وخروجها</li>
            <li>مخرجان على شارعنا 12.5م لتسريع تدفق الخروج</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
