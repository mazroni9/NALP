import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useAuctionStore } from '@/store/auctionStore'

interface BidControlsProps {
  lotId: string
  currentPrice: number
  minIncrement: number
  status: string
}

export function BidControls({ lotId, currentPrice, minIncrement, status }: BidControlsProps) {
  const navigate = useNavigate()
  const { isLoggedIn, bidderNumber } = useAuthStore()
  const { addBid, updateLotPrice, featureFlags } = useAuctionStore()

  const newBid = currentPrice + minIncrement

  const handleBid = () => {
    if (!isLoggedIn || !bidderNumber) {
      navigate('/login')
      return
    }
    addBid({
      lotId,
      amount: newBid,
      bidderNumber,
      timestamp: new Date().toISOString(),
    })
    updateLotPrice(lotId, newBid)
  }

  const handleDouble = () => {
    if (!isLoggedIn || !bidderNumber) return
    const doubled = currentPrice + minIncrement * 2
    addBid({ lotId, amount: doubled, bidderNumber, timestamp: new Date().toISOString() })
    updateLotPrice(lotId, doubled)
  }

  const canBid = status === 'OPEN'

  return (
    <div className="space-y-3">
      {!isLoggedIn ? (
        <Button fullWidth onClick={() => navigate('/login')} variant="outline">
          سجّل لتزايد
        </Button>
      ) : canBid ? (
        <>
          <Button fullWidth onClick={handleBid}>
            زايد الآن ({newBid.toLocaleString('ar-SA')} ر.س)
          </Button>
          {featureFlags.doubleBid && (
            <Button fullWidth variant="secondary" onClick={handleDouble}>
              ضاعف مزايدتك ({newBid + minIncrement} ر.س)
            </Button>
          )}
        </>
      ) : (
        <Button fullWidth disabled>
          المزاد مغلق حالياً
        </Button>
      )}
    </div>
  )
}
