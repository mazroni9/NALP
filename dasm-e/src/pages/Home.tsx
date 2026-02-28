import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ZoneMap } from '@/components/map/ZoneMap'
import { lots } from '@/mock'

export function Home() {
  const upcoming = lots.slice(0, 8)

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-br from-indigo-600 to-indigo-800 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold">المزاد الآن</h1>
          <p className="mt-2 text-indigo-100">
            جلسة المزاد الصباحية جارية. انضم الآن لمتابعة المزايدات الحية.
          </p>
          <Link to="/live" className="mt-6 inline-block">
            <Button variant="secondary" className="!bg-white !text-indigo-600 hover:!bg-indigo-50">
              شاهد المزاد
            </Button>
          </Link>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-xl font-bold text-slate-900">خريطة المناطق</h2>
          <ZoneMap />
          <p className="mt-2 text-center text-sm text-slate-500">
            اضغط على المنطقة للانتقال
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-xl font-bold text-slate-900">القادمة خلال ساعة</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((lot) => (
              <Link key={lot.id} to={`/lot/${lot.id}`}>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                  <img
                    src={lot.images[0]}
                    alt={lot.title}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <p className="mt-2 font-medium text-slate-800">{lot.title}</p>
                  <p className="text-sm text-indigo-600">
                    {lot.currentPrice.toLocaleString('ar-SA')} ر.س
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-bold text-slate-900">كيف تحضر وتزايد؟</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">١</div>
              <p className="mt-3 font-medium">سجّل حسابك</p>
              <p className="text-sm text-slate-600">أنشئ حساباً وفعّل المزايد</p>
            </div>
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">٢</div>
              <p className="mt-3 font-medium">تصفّح المعرض</p>
              <p className="text-sm text-slate-600">اختر السيارة وراجع التقرير</p>
            </div>
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">٣</div>
              <p className="mt-3 font-medium">زايد مباشرة</p>
              <p className="text-sm text-slate-600">شارك في المزاد الحي</p>
            </div>
          </div>
          <Link to="/rules" className="mt-8 inline-block">
            <Button variant="outline">القوانين والشروط</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
