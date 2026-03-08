"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

type TabId = "one-pager" | "memo" | "pitch";

const TABS: { id: TabId; label: string }[] = [
  { id: "one-pager", label: "ملخص صفحة واحدة" },
  { id: "memo", label: "مذكرة قصيرة" },
  { id: "pitch", label: "صياغة العرض" },
];

export default function InvestorMaterialsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("one-pager");

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8" dir="rtl">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">مواد المستثمر</h1>
        <p className="mt-1 text-sm text-slate-600">
          ملخصات ونصوص جاهزة للاستخدام في العروض والمحادثات الاستثمارية — مبنية على النموذج الحالي والرسائل المنضبطة.
        </p>
      </header>

      <Card className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">مستوى الإثبات الحالي</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div>
            <span className="font-medium text-emerald-700">ثابت:</span> عدد الغرف (198)، هيكل الصفقة، رأس المال المطلوب (قيم إدارية)، معادلات النموذج.
          </div>
          <div>
            <span className="font-medium text-amber-700">تقديري:</span> الإشغال، الأسعار، الإيراد، نسبة الرسملة، منحنى المزاد، نقطة التعادل — من النموذج وتحتاج تحققاً سوقياً.
          </div>
          <div>
            <span className="font-medium text-slate-600">يحتاج تحققاً:</span> إشغال وسعر منطقة ج، إيراد منطقة د، CAPEX ج، منحنى منطقة أ، مرجع cap rate.
          </div>
        </div>
      </Card>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "one-pager" && (
        <Card className="p-6 space-y-5">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">ملخص صفحة واحدة (One-Pager)</h2>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">ما هو مشروع NALP</h3>
            <p className="text-sm text-slate-600">
              مجمع متعدد الاستخدامات: مزاد سيارات، مواقف، سكن موظفين، مركز خدمات. هيكل شراكة بين ملاك الأرض والمستثمر والمشغّل مع توزيع أرباح وفق نموذج محدد.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">لماذا هو مثير للاهتمام استثماريًا</h3>
            <p className="text-sm text-slate-600">
              تنويع مصادر الدخل؛ نموذج waterfall في منطقة مركز الخدمات يعطي المستثمر حصة كبيرة حتى التعادل؛ إمكانية عائد من المزاد والمواقف والسكن عند تحقيق افتراضات التشغيل. الأرقام المعروضة ناتجة عن نموذج إسقاط وليست التزاماً.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">ما هو ثابت اليوم</h3>
            <p className="text-sm text-slate-600">
              عدد الغرف (198)، هيكل الصفقة (مشاركة أرباح، waterfall منطقة د)، رأس المال المطلوب كقيم إدارية، ومعادلات النموذج (مجموع المناطق = الإجمالي، التقييم = دخل سنوي / نسبة رسملة). المنطق الحسابي متسق ومختبر.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">ما هو تقدير من النموذج (model-based estimate)</h3>
            <p className="text-sm text-slate-600">
              نسبة الإشغال والأسعار (مناطق ج، د)، الإيراد الشهري لمركز الخدمات، نسبة الرسملة وتقييم الخروج، منحنى نمو المزاد (سيارات/عمولات)، نقطة التعادل. تُعرض كنطاق أو تقدير حسب السيناريو.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">ما الذي ما زال يحتاج تحققاً (validation)</h3>
            <p className="text-sm text-slate-600">
              إشغال وسعر غرفة منطقة ج (عقود أو نوايا إيجار، مقارنات سوقية)؛ إيراد منطقة د (اتفاقيات تشغيل أو بيانات مواقع مشابهة)؛ CAPEX منطقة ج (عروض مقاولات)؛ منحنى المزاد (بيانات تشغيلية)؛ نسبة الرسملة (مرجع سوقي).
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">السيناريوهات (بدون مبالغة)</h3>
            <p className="text-sm text-slate-600">
              النموذج يعرض ثلاثة سيناريوهات: متحفظ، أساسي (واقعي)، متفائل. النتائج — دخل الملاك، التقييم — تختلف حسب الافتراضات؛ يُفضّل عرض النتائج كنطاق وليس رقماً وحيداً.
            </p>
          </section>

          <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-sm text-amber-900">
            <strong>تنبيه:</strong> بعض الأرقام في اللوحات والجداول تقديرات من النموذج وليست التزاماً أو ضماناً. التقييم عند الخروج ونقطة التعادل تعتمدان على افتراضات قيد التحقق السوقي.
          </div>
        </Card>
      )}

      {activeTab === "memo" && (
        <Card className="p-6 space-y-5">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">مذكرة استثمارية قصيرة (Short Memo)</h2>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Overview</h3>
            <p className="text-sm text-slate-600">
              NALP مجمع يجمع أربعة أنشطة: مزاد سيارات، مواقف، سكن موظفين (198 غرفة)، مركز خدمات. الشراكة بين ملاك الأرض والمستثمر والمشغّل مع توزيع أرباح وفق هيكل محدد. النتائج المالية المعروضة مستمدة من نموذج إسقاط معايرة (base واقعي) وليست مضمونة.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Investment logic</h3>
            <p className="text-sm text-slate-600">
              تنويع الدخل؛ حماية المستثمر في منطقة د عبر waterfall حتى التعادل؛ إمكانية عائد من مناطق متعددة. الجاذبية تعتمد على تحقق افتراضات التشغيل (إشغال، إيراد، منحنى المزاد) التي ما زالت قيد التحقق.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Revenue architecture</h3>
            <p className="text-sm text-slate-600">
              منطقة أ: عمولات مزاد (رامب على سنوات). منطقة ب: إيراد مواقف. منطقة ج: إيجارات غرف (غرف × إشغال × سعر). منطقة د: إيراد شهري من مركز الخدمات. كل المناطق تساهم في دخل الملاك عبر نموذج توزيع محدد.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">What is fixed vs estimated</h3>
            <p className="text-sm text-slate-600">
              <strong>ثابت:</strong> عدد الغرف، هيكل الصفقة، رأس المال المطلوب (إداري)، معادلات النموذج. <strong>تقديري (model-based):</strong> الإشغال (مثلاً 72% base)، سعر الغرفة، إيراد منطقة د، نسبة الرسملة (10% base)، منحنى السيارات/العمولة، نقطة التعادل. لا يُعرض التقديري كحقيقة مؤكدة.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Scenario framing</h3>
            <p className="text-sm text-slate-600">
              متحفظ: إيراد أقل، مصاريف أعلى، cap rate أعلى. أساسي (واقعي): افتراضات معايرة. متفائل: إيراد أعلى، cap rate أدنى. يُوصى بعرض دخل الملاك والتقييم كنطاق (من متحفظ إلى متفائل) وليس رقماً واحداً.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Key risks / validation gaps</h3>
            <p className="text-sm text-slate-600">
              منطقة ج: الإشغال والسعر غير مدعومين بعقود أو نوايا؛ CAPEX placeholder. منطقة د: الإيراد الشهري غير مدعوم باتفاقيات تشغيل أو بيانات مشابهة؛ نقطة التعادل تقديرية. منطقة أ: منحنى الرامب غير مدعوم ببيانات تشغيل. نسبة الرسملة دون مرجع سوقي. هذه الفجوات تُخفّف عبر الصياغة (تقدير، من النموذج، يحتاج تحققاً) وليس بالإخفاء.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Why the project is worth further diligence</h3>
            <p className="text-sm text-slate-600">
              المشروع يجمع أصولاً قائمة (غرف، مواقف، موقع) ونموذج توزيع واضح. النتائج حساسة لافتراضات التشغيل — مناقشة هذه الافتراضات وجمع أدلة (مقارنات سوقية، عقود نوايا، عروض مقاولات) يزيد الجاهزية للمستثمر دون تغيير جوهر النموذج.
            </p>
          </section>
        </Card>
      )}

      {activeTab === "pitch" && (
        <Card className="p-6 space-y-5">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">صياغة العرض (Pitch Wording)</h2>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Opening positioning</h3>
            <p className="text-sm text-slate-600">
              NALP مجمع متعدد الاستخدامات — مزاد، مواقف، سكن، مركز خدمات — مع هيكل شراكة واضح بين ملاك الأرض والمستثمر والمشغّل. الأرقام التي نعرضها من نموذج إسقاط معايرة؛ نفضّل أن نبدأ بما هو ثابت ثم ما هو تقديري وما الذي ما زال يحتاج تحققاً.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Short project summary</h3>
            <p className="text-sm text-slate-600">
              أربعة محركات دخل: المزاد (عمولات)، المواقف، السكن (198 غرفة)، مركز الخدمات. توزيع أرباح وفق نموذج محدد؛ في منطقة مركز الخدمات نموذج waterfall لحماية المستثمر حتى التعادل. النتائج المعروضة تقديرية وتعتمد على السيناريو.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Why now / why this project</h3>
            <p className="text-sm text-slate-600">
              المشروع يجمع بين أصول قائمة ونموذج توزيع واضح. نركز على توثيق افتراضات التشغيل (إشغال، إيراد، منحنى المزاد) لرفع الجاهزية الاستثمارية. نعرض النتائج كنطاق وليس كرقم واحد.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">How to describe the economics carefully</h3>
            <p className="text-sm text-slate-600">
              دخل الملاك والتقييم عند الخروج ناتجان عن النموذج تحت افتراضات قابلة للتعديل. نعرض ثلاثة سيناريوهات — متحفظ، أساسي، متفائل — والنطاق بينها. نسبة الرسملة المستخدمة في التقييم ضمن نطاق نموذجي حتى نوثقها بمرجع سوقي. نقطة التعادل لمنطقة مركز الخدمات تقديرية وتعتمد على تحقق الإيراد والتكلفة.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">How to talk about the current stage without overstating</h3>
            <p className="text-sm text-slate-600">
              نحن في مرحلة جاهزة لمحادثات استثمارية مبكرة. ما هو ثابت: الهيكل وعدد الغرف والمعادلات. ما هو تقديري: الإشغال، الإيراد، التقييم، التعادل — نعمل على دعمها بمقارنات سوقية وعقود نوايا وعروض مقاولات حيث يلزم. لا نقدم أي رقم كضمان.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Recommended investor-facing wording</h3>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
              <li>استخدم «تقدير من النموذج» أو «حسب السيناريو» عند عرض الدخل أو التقييم أو التعادل.</li>
              <li>استخدم «نطاق النتائج (من متحفظ إلى متفائل)» بدل رقم واحد.</li>
              <li>قل «يحتاج تحققاً سوقياً» عند ذكر الإشغال أو إيراد منطقة د أو منحنى المزاد.</li>
              <li>قل «نسبة الرسملة افتراضية حتى مرجع سوقي» عند ذكر التقييم.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">What not to overstate</h3>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
              <li>لا تقدم الإشغال أو سعر الغرفة أو إيراد منطقة د كـ market-proven.</li>
              <li>لا تقدم نقطة التعادل أو التقييم كرقم مضمون.</li>
              <li>لا تستخدم «العائد المتوقع» أو «الربحية المضمونة» دون caveat.</li>
              <li>لا تبرز تعادل منطقة د كهدف رئيسي دون توضيح أنه تقدير من النموذج.</li>
            </ul>
          </section>
        </Card>
      )}

      <p className="text-xs text-slate-500 pt-2">
        المراجع: investor-materials-hardening، validation-requirements-pack، financial-calibration-pass، investment-assumptions-register، zone-c-zone-d-risk-notes.
      </p>
    </div>
  );
}
