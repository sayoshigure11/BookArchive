export type ReadingStatus = "want-to-read" | "reading" | "completed"

export interface PricePoint {
  id: string
  price: number
}

export interface PurchaseLocation {
  id: string
  location: string
  prices: PricePoint[]
}

export interface Book {
  id: string
  isbn: string
  title: string
  author: string
  publisher: string
  coverImage: string
  status: ReadingStatus
  expectation: number // 1-5 stars
  purchased: boolean
  purchaseLocations: PurchaseLocation[]
  notes?: string
  completedDate?: string
  createdAt: string
}
