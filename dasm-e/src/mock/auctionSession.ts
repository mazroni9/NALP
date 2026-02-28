import type { AuctionSession } from '@/types'

export const auctionSession: AuctionSession = {
  status: 'LIVE',
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
  lockSeconds: 180,
  sessionName: 'جلسة المزاد الصباحية',
  lane: 'المسار 1',
}
