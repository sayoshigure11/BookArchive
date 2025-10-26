"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/book-card";
import {
  BookFilterDrawer,
  type FilterOptions,
} from "@/components/book-filter-drawer";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { BookRegistrationDrawer } from "@/components/book-registration-drawer";
import { BookDetailDrawer } from "@/components/book-detail-drawer";
import { getBooks, addBook, updateBook, deleteBook } from "@/lib/book-storage";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Book } from "@/lib/types";
import { fetchBookByISBN, ISBNBookData } from "@/lib/isbn-api";

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [registrationDrawerOpen, setRegistrationDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [scannedBookData, setScannedBookData] = useState<ISBNBookData | null>(
    null
  );
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    sortBy: "date",
    purchasedOnly: false,
    locations: [],
  });

  useEffect(() => {
    function getData() {
      setBooks(getBooks());
    }
    getData();
  }, []);

  const availableLocations = useMemo(() => {
    const locations = new Set<string>();
    books.forEach((book) => {
      book.purchaseLocations.forEach((pl) => {
        locations.add(pl.location);
      });
    });
    return Array.from(locations);
  }, [books]);

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.publisher.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter((book) => book.status === filters.status);
    }

    // Purchased filter
    if (filters.purchasedOnly) {
      result = result.filter((book) => book.purchased);
    }

    // Location filter
    if (filters.locations.length > 0) {
      result = result.filter((book) =>
        book.purchaseLocations.some((pl) =>
          filters.locations.includes(pl.location)
        )
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "title":
          return a.title.localeCompare(b.title, "ja");
        case "author":
          return a.author.localeCompare(b.author, "ja");
        case "expectation":
          return b.expectation - a.expectation;
        case "date":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return result;
  }, [books, searchQuery, filters]);

  const activeFilterCount =
    (filters.status !== "all" ? 1 : 0) +
    (filters.sortBy !== "date" ? 1 : 0) +
    (filters.purchasedOnly ? 1 : 0) +
    filters.locations.length;

  const clearFilter = (
    type: "status" | "sort" | "purchased" | "location",
    value?: string
  ) => {
    if (type === "status") {
      setFilters({ ...filters, status: "all" });
    } else if (type === "sort") {
      setFilters({ ...filters, sortBy: "date" });
    } else if (type === "purchased") {
      setFilters({ ...filters, purchasedOnly: false });
    } else if (type === "location" && value) {
      setFilters({
        ...filters,
        locations: filters.locations.filter((l) => l !== value),
      });
    }
  };

  const handleScan = async (isbn: string) => {
    setScannerOpen(false);
    const bookData = await fetchBookByISBN(isbn);
    if (bookData) {
      setScannedBookData(bookData);
      setRegistrationDrawerOpen(true);
    }
  };

  const handleRegistration = (data: {
    status: Book["status"];
    expectation: number;
    purchased: boolean;
    purchaseLocations: Book["purchaseLocations"];
    notes: string;
  }) => {
    if (!scannedBookData) return;

    const newBook: Book = {
      id: crypto.randomUUID(),
      isbn: scannedBookData.isbn,
      title: scannedBookData.title,
      author: scannedBookData.author,
      publisher: scannedBookData.publisher,
      coverImage: scannedBookData.coverImage,
      status: data.status,
      expectation: data.expectation,
      purchased: data.purchased,
      purchaseLocations: data.purchaseLocations,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    addBook(newBook);
    setBooks(getBooks());
    setRegistrationDrawerOpen(false);
    setScannedBookData(null);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setDetailDrawerOpen(true);
  };

  const handleUpdate = (id: string, updates: Partial<Book>) => {
    updateBook(id, updates);
    setBooks(getBooks());
    setSelectedBook((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev
    );
  };

  const handleDelete = (id: string) => {
    deleteBook(id);
    setBooks(getBooks());
    setDetailDrawerOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold mb-3">読書記録</h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="タイトル、著者、出版社で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4"
            />
          </div>

          {/* Filter Button */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterDrawerOpen(true)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              フィルター
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-1 px-1.5 py-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {filters.status !== "all" && (
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => clearFilter("status")}
                >
                  {filters.status === "want-to-read"
                    ? "読みたい"
                    : filters.status === "reading"
                    ? "読書中"
                    : "読了"}
                  <span className="ml-1">×</span>
                </Badge>
              )}
              {filters.sortBy !== "date" && (
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => clearFilter("sort")}
                >
                  {filters.sortBy === "title"
                    ? "タイトル順"
                    : filters.sortBy === "author"
                    ? "著者名順"
                    : "期待度順"}
                  <span className="ml-1">×</span>
                </Badge>
              )}
              {filters.purchasedOnly && (
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => clearFilter("purchased")}
                >
                  購入済み
                  <span className="ml-1">×</span>
                </Badge>
              )}
              {filters.locations.map((location) => (
                <Badge
                  key={location}
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => clearFilter("location", location)}
                >
                  {location}
                  <span className="ml-1">×</span>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Book List */}
      <main className="px-4 py-4">
        {filteredAndSortedBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || activeFilterCount > 0
                ? "該当する本が見つかりません"
                : "本を追加してください"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => handleBookClick(book)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
        onClick={() => setScannerOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Filter Drawer */}
      <BookFilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        filters={filters}
        onFiltersChange={setFilters}
        availableLocations={availableLocations}
      />

      {/* Barcode Scanner */}
      {scannerOpen && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* Book Registration Drawer */}
      <BookRegistrationDrawer
        open={registrationDrawerOpen}
        onOpenChange={setRegistrationDrawerOpen}
        bookData={scannedBookData}
        onConfirm={handleRegistration}
        existingLocations={availableLocations}
      />

      {/* Book Detail Drawer */}
      <BookDetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        book={selectedBook}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        existingLocations={availableLocations}
      />
    </div>
  );
}
