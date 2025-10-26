export interface ISBNBookData {
  isbn: string
  title: string
  author: string
  publisher: string
  coverImage: string
}

// Mock function - In production, use Google Books API or OpenBD API
export async function fetchBookByISBN(isbn: string): Promise<ISBNBookData | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data for demonstration
  const mockBooks: Record<string, ISBNBookData> = {
    "9784101001012": {
      isbn: "9784101001012",
      title: "人間失格",
      author: "太宰治",
      publisher: "新潮社",
      coverImage: "/-----book-cover.jpg",
    },
    "9784167158057": {
      isbn: "9784167158057",
      title: "ノルウェイの森",
      author: "村上春樹",
      publisher: "講談社",
      coverImage: "/--------book-cover.jpg",
    },
  }

  return (
    mockBooks[isbn] || {
      isbn,
      title: "サンプル書籍",
      author: "著者名",
      publisher: "出版社名",
      coverImage: "/abstract-book-cover.png",
    }
  )
}
