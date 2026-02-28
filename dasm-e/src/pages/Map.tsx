import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ZoneMap } from '@/components/map/ZoneMap'
import { ZoneCard } from '@/components/map/ZoneCard'
import { zones } from '@/mock'

export function Map() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">خريطة المناطق</h1>
      <ZoneMap />
      <div className="mt-12 space-y-6">
        {zones.map((z) => (
          <ZoneCard key={z.id} zoneId={z.id} />
        ))}
      </div>
    </div>
  )
}
