export function Rules() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">القوانين والشروط</h1>
      <div className="space-y-6 text-slate-600">
        <section>
          <h2 className="font-bold text-slate-900">١. التسجيل والمشاركة</h2>
          <p className="mt-2">
            يجب على المشارك تسجيل حساب وتفعيل المزايد قبل بدء الجلسة. المزايدة تكون ملزمة عند الضغط على زر المزايدة.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-slate-900">٢. الحد الأدنى للمزايدة</h2>
          <p className="mt-2">
            كل لوت له حد أدنى للزيادة (minIncrement). لا تقبل المزايدات الأقل من هذا الحد.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-slate-900">٣. حالة المقفل (LOCKED)</h2>
          <p className="mt-2">
            بعد كل مزايدة، يُقفل اللوت لفترة محددة (مثال: ٣ دقائق) لتمكين المشاركين من المزايدة. يُفتح تلقائياً بعد انتهاء المدة.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-slate-900">٤. إتمام البيع</h2>
          <p className="mt-2">
            عند انتهاء مدة المقفل دون مزايدات جديدة، يُعلن البيع وإجراءات الاستلام.
          </p>
        </section>
      </div>
    </div>
  )
}
