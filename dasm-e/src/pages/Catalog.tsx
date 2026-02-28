import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lots } from '@/mock'
import { Badge } from '@/components/ui/Badge'

export function Catalog() {
  const [yearFilter, setYearFilter] = useState<string>('')
  const [zoneFilter, setZoneFilter] = useState<string>('')

  const filtered = lots.filter((l) => {
    if (yearFilter && l.year !== parseInt(yearFilter)) return false
    if (zoneFilter && l.locationZone !== zoneFilter) return false
    return true
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">المعرض</h1>

      <div className="mb-8 flex flex-wrap gap-4">
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">كل الأعوام</option>
          {[...new Set(lots.map((l) => l.year))].sort((a, b) => b - a).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">كل المناطق</option>
          {['A', 'B'].map((z) => (
            <option key={z} value={z}>المنطقة {z}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((lot) => (
          <Link key={lot.id} to={`/lot/${lot.id}`}>
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              <img
                src={lot.images[0]}
                alt={lot.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="info">{lot.lotNumber}</Badge>
                  <Badge>{lot.locationZone} / {lot.locationBlock}</Badge>
                </div>
                <h2 className="mt-2 font-bold text-slate-900">{lot.title}</h2>
                <p className="text-indigo-600 font-semibold">
                  {lot.currentPrice.toLocaleString('ar-SA')} ر.س
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
