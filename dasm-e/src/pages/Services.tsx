import { useState } from 'react'
import { services } from '@/mock'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function Services() {
  const [phone, setPhone] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [time, setTime] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!phone || phone.length < 10) e.phone = 'رقم الجوال مطلوب (10 أرقام)'
    if (!serviceId) e.serviceId = 'اختر الخدمة'
    if (!time) e.time = 'اختر الوقت'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    alert('تم إرسال طلب الحجز (وهمي)')
    setPhone('')
    setServiceId('')
    setTime('')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">الخدمات (المنطقة د)</h1>

      <div className="mb-12 space-y-4">
        {services.map((s) => (
          <Card key={s.id}>
            <h3 className="font-bold text-slate-900">{s.title}</h3>
            <p className="mt-1 text-slate-600">{s.description}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="mb-6 text-lg font-bold text-slate-900">نموذج حجز</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">رقم الجوال</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">الخدمة</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            >
              <option value="">اختر الخدمة</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
            {errors.serviceId && <p className="mt-1 text-sm text-red-600">{errors.serviceId}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">الوقت</label>
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
            {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
          </div>
          <Button type="submit" fullWidth>
            إرسال طلب الحجز
          </Button>
        </form>
      </Card>
    </div>
  )
}
