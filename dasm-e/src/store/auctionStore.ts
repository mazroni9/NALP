import { create } from 'zustand'
import type { Lot, AuctionSession } from '@/types'
import { auctionSession as mockSession, lots as mockLots } from '@/mock'

export interface BidRecord {
  lotId: string
  amount: number
  bidderNumber: string
  timestamp: string
}

interface AuctionState {
  session: AuctionSession
  currentLot: Lot | null
  nextQueue: Lot[]
  bidHistory: BidRecord[]
  lots: Lot[]
  featureFlags: { doubleBid: boolean }
  setCurrentLot: (lot: Lot | null) => void
  addBid: (record: BidRecord) => void
  updateLotPrice: (lotId: string, newPrice: number) => void
  refreshFromMock: () => void
}

export const useAuctionStore = create<AuctionState>((set) => ({
  session: mockSession,
  currentLot: mockLots[0] ?? null,
  nextQueue: mockLots.slice(1, 6),
  bidHistory: [],
  lots: mockLots,
  featureFlags: { doubleBid: true },

  setCurrentLot: (lot) =>
    set((s) => ({
      currentLot: lot,
      nextQueue: lot
        ? s.lots.filter((l) => l.id !== lot.id).slice(0, 5)
        : s.nextQueue,
    })),

  addBid: (record) =>
    set((s) => ({
      bidHistory: [record, ...s.bidHistory].slice(0, 10),
    })),

  updateLotPrice: (lotId, newPrice) =>
    set((s) => ({
      lots: s.lots.map((l) =>
        l.id === lotId ? { ...l, currentPrice: newPrice } : l
      ),
      currentLot:
        s.currentLot?.id === lotId
          ? { ...s.currentLot, currentPrice: newPrice }
          : s.currentLot,
    })),

  refreshFromMock: () =>
    set({
      session: mockSession,
      lots: mockLots,
      currentLot: mockLots[0] ?? null,
      nextQueue: mockLots.slice(1, 6),
    }),
}))
