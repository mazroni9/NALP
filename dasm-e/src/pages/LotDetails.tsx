import { useParams, Link } from 'react-router-dom'
import { lots } from '@/mock'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export function LotDetails() {
  const { id } = useParams()
  const lot = lots.find((l) => l.id === id)

  if (!lot) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">اللوت غير موجود</h1>
        <Link to="/catalog" className="mt-4 inline-block text-indigo-600 hover:underline">
          العودة للمعرض
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <img
            src={lot.images[0]}
            alt={lot.title}
            className="w-full rounded-xl object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="info">{lot.lotNumber}</Badge>
            <Badge>
              {lot.locationZone} / بلوك {lot.locationBlock}
            </Badge>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">{lot.title}</h1>
          <p className="text-slate-600">{lot.year}</p>
          <div className="mt-6">
            <span className="text-3xl font-bold text-indigo-600">
              {lot.currentPrice.toLocaleString('ar-SA')}
            </span>
            <span className="text-slate-500"> ر.س</span>
          </div>
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-slate-800">تقرير الفحص</h3>
            <p className="mt-2 text-sm text-slate-600">(مكان لقيمة placeholder)</p>
          </div>
          <Link to="/live" className="mt-6 inline-block">
            <Button>اذهب للمزاد</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
