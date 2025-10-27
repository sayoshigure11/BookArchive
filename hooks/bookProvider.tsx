"use client";

import { Book, FilterOptions } from "@/lib/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

const STORAGE_KEY = "books_data";

const INITIAL_BOOKS: Book[] = [
  {
    id: "1",
    isbn: "9784167158057",
    title: "ノルウェイの森",
    author: "村上春樹",
    publisher: "講談社",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    expectation: 5,
    purchased: false,
    locations: [
      { place: "東京", prices: [1500, 1800] },
      { place: "Amazon", prices: [1400, 1600] },
    ],
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "2",
    isbn: "9784087606027",
    title: "火花",
    author: "又吉直樹",
    publisher: "文藝春秋",
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    expectation: 4,
    purchased: true,
    locations: [
      { place: "京都", prices: [1300] },
      { place: "楽天", prices: [1200, 1400] },
    ],
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: "3",
    isbn: "9784122018273",
    title: "容疑者Xの献身",
    author: "東野圭吾",
    publisher: "文藝春秋",
    coverImage:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
    expectation: 5,
    purchased: false,
    locations: [
      { place: "大阪", prices: [700, 800] },
      { place: "メルカリ", prices: [500, 600, 700] },
    ],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "4",
    isbn: "9784103534235",
    title: "三体",
    author: "劉慈欣",
    publisher: "早川書房",
    coverImage:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop",
    expectation: 5,
    purchased: false,
    locations: [
      { place: "東京", prices: [2000, 2200] },
      { place: "Amazon", prices: [1980] },
      { place: "横浜", prices: [2100] },
    ],
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "5",
    isbn: "9784101001623",
    title: "人間失格",
    author: "太宰治",
    publisher: "新潮社",
    coverImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=450&fit=crop",
    expectation: 3,
    purchased: true,
    locations: [
      { place: "名古屋", prices: [400, 500] },
      { place: "オンライン", prices: [380] },
    ],
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: "6",
    isbn: "9784087714784",
    title: "コンビニ人間",
    author: "村田沙耶香",
    publisher: "文藝春秋",
    coverImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
    expectation: 4,
    purchased: false,
    locations: [
      { place: "福岡", prices: [600, 700] },
      { place: "楽天", prices: [550, 650] },
    ],
    createdAt: Date.now() - 86400000 * 7,
  },
];

const initialFilters: FilterOptions = {
  searchQuery: "",
  sortBy: "date",
  showPurchased: "all",
  selectedLocations: [],
};

// ------------------------------------------------
// Context定義
// ------------------------------------------------
type BookContextType = {
  books: Book[];
  allBooks: Book[];
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  isLoading: boolean;
  addBook: (book: Omit<Book, "id" | "createdAt">) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  allLocations: string[];
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBooks(JSON.parse(stored));
      } else {
        setBooks(INITIAL_BOOKS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKS));
      }
    } catch (error) {
      console.error("Failed to load books:", error);
      setBooks(INITIAL_BOOKS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadBooks();
    }
  }, [loadBooks]);

  const saveBooks = useCallback((newBooks: Book[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
      setBooks(newBooks);
    } catch (error) {
      console.error("Failed to save books:", error);
    }
  }, []);

  const addBook = useCallback(
    (book: Omit<Book, "id" | "createdAt">) => {
      const newBook: Book = {
        ...book,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      saveBooks([newBook, ...books]);
    },
    [books, saveBooks]
  );

  const updateBook = useCallback(
    (id: string, updates: Partial<Book>) => {
      const updated = books.map((book) =>
        book.id === id ? { ...book, ...updates } : book
      );
      saveBooks(updated);
    },
    [books, saveBooks]
  );

  const deleteBook = useCallback(
    (id: string) => {
      const filtered = books.filter((book) => book.id !== id);
      saveBooks(filtered);
    },
    [books, saveBooks]
  );

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    if (filters.showPurchased !== "all") {
      result = result.filter((book) =>
        filters.showPurchased === "purchased" ? book.purchased : !book.purchased
      );
    }

    if (filters.selectedLocations.length > 0) {
      result = result.filter((book) =>
        book.locations.some((loc) =>
          filters.selectedLocations.includes(loc.place)
        )
      );
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "expectation":
          return b.expectation - a.expectation;
        case "date":
        default:
          return b.createdAt - a.createdAt;
      }
    });

    return result;
  }, [books, filters]);

  const allLocations = useMemo(() => {
    const locations = new Set<string>();
    books.forEach((book) =>
      book.locations.forEach((loc) => locations.add(loc.place))
    );
    return Array.from(locations).sort();
  }, [books]);

  const value = useMemo(
    () => ({
      books: filteredBooks,
      allBooks: books,
      filters,
      setFilters,
      isLoading,
      addBook,
      updateBook,
      deleteBook,
      allLocations,
    }),
    [
      filteredBooks,
      books,
      filters,
      isLoading,
      addBook,
      updateBook,
      deleteBook,
      allLocations,
    ]
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

// ------------------------------------------------
// Hook
// ------------------------------------------------
export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};
