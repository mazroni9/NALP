import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useAuctionStore } from '@/store/auctionStore'

export function TopBar() {
  const { session } = useAuctionStore()
  const { isLoggedIn } = useAuthStore()

  const statusVariant = session.status === 'LIVE' ? 'success' : session.status === 'UPCOMING' ? 'warning' : 'default'

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant={statusVariant}>
            {session.status === 'LIVE' ? 'مباشر' : session.status === 'UPCOMING' ? 'قادم' : 'غير متاح'}
          </Badge>
          <span className="text-sm text-slate-600">
            {session.status === 'LIVE' && 'ينتهي بعد 3 ساعات'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant={isLoggedIn ? 'ghost' : 'outline'} size="sm">
              {isLoggedIn ? 'حسابي' : 'تسجيل الدخول'}
            </Button>
          </Link>
          {session.status === 'LIVE' && (
            <>
              <Button variant="secondary" size="sm">
                تفعيل المزايد
              </Button>
              <Link to="/live">
                <Button size="sm">جدول المزاد</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
