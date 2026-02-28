export type AuctionStatus = 'LIVE' | 'UPCOMING' | 'OFFLINE'

export interface AuctionSession {
  status: AuctionStatus
  startTime: string
  endTime: string
  lockSeconds: number
  sessionName?: string
  lane?: string
}
