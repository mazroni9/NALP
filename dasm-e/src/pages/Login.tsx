import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

export function Login() {
  const navigate = useNavigate()
  const { setLoggedIn } = useAuthStore()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')

  const handleSendOtp = () => {
    if (phone.length < 10) return
    setStep('otp')
  }

  const handleVerify = () => {
    // Mock: أي OTP يعمل
    setLoggedIn(true, 'B-2042')
    navigate('/live')
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4">
      <Card className="w-full">
        <h1 className="text-xl font-bold text-slate-900">تسجيل الدخول</h1>
        {step === 'phone' ? (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">رقم الجوال</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>
            <Button fullWidth onClick={handleSendOtp} disabled={phone.length < 10}>
              إرسال رمز التحقق
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">رمز التحقق (OTP)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
              />
              <p className="mt-1 text-xs text-slate-500">وهمي: أي رقم يقبل</p>
            </div>
            <Button fullWidth onClick={handleVerify}>
              تأكيد
            </Button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-sm text-indigo-600 hover:underline"
            >
              تغيير الرقم
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}
