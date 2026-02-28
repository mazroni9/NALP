import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CurrentLotCard } from '@/components/auction/CurrentLotCard'
import { BidControls } from '@/components/auction/BidControls'
import { BidHistory } from '@/components/auction/BidHistory'
import { NextQueue } from '@/components/auction/NextQueue'
import { useAuctionStore } from '@/store/auctionStore'

export function LiveAuction() {
  const { session, currentLot, nextQueue, bidHistory } = useAuctionStore()
  const [lockTimer, setLockTimer] = useState(0)

  useEffect(() => {
    if (!currentLot?.lockEndsAt || currentLot.status !== 'LOCKED') return
    const interval = setInterval(() => {
      const remaining = Math.max(0, new Date(currentLot.lockEndsAt!).getTime() - Date.now())
      setLockTimer(remaining / 1000)
    }, 1000)
    return () => clearInterval(interval)
  }, [currentLot?.lockEndsAt, currentLot?.status])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="text-indigo-600 hover:underline">← رجوع</Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{session.sessionName}</h1>
          <p className="text-slate-600">{session.lane}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <CurrentLotCard lot={currentLot} lockTimer={lockTimer} />
          {currentLot && (
            <BidControls
              lotId={currentLot.id}
              currentPrice={currentLot.currentPrice}
              minIncrement={currentLot.minIncrement}
              status={currentLot.status}
            />
          )}
          <BidHistory history={bidHistory} />
        </div>
        <div>
          <NextQueue queue={nextQueue} />
        </div>
      </div>
    </div>
  )
}
