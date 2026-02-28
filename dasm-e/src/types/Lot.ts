export type LotStatus = 'OPEN' | 'LOCKED' | 'SOLD'

export interface Lot {
  id: string
  lotNumber: string
  title: string
  year: number
  images: string[]
  currentPrice: number
  minIncrement: number
  status: LotStatus
  locationZone: string
  locationBlock: string
  lockEndsAt?: string
}
