import type { Book } from "./types"

const STORAGE_KEY = "book-management-data"

export function getBooks(): Book[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Failed to load books:", error)
    return []
  }
}

export function saveBooks(books: Book[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  } catch (error) {
    console.error("Failed to save books:", error)
  }
}

export function addBook(book: Book): void {
  const books = getBooks()
  books.push(book)
  saveBooks(books)
}

export function updateBook(id: string, updates: Partial<Book>): void {
  const books = getBooks()
  const index = books.findIndex((b) => b.id === id)

  if (index !== -1) {
    books[index] = { ...books[index], ...updates }
    saveBooks(books)
  }
}

export function deleteBook(id: string): void {
  const books = getBooks()
  const filtered = books.filter((b) => b.id !== id)
  saveBooks(filtered)
}
