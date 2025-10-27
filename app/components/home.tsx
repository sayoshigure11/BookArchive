// chatGPTに書き換えてもらった
// app/books/page.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/BookCard";
import { FilterBottomSheet } from "@/components/FilterBottomSheet";
import { BookDetailModal } from "@/components/BookDetailModal";
import { useBooks } from "@/hooks/bookProvider";

export default function BookListPage() {
  const { books, allBooks, filters, setFilters, allLocations } = useBooks();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const selectedBook = useMemo(
    () => allBooks.find((b) => b.id === selectedBookId) ?? null,
    [selectedBookId, allBooks]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, searchQuery: e.target.value });
    },
    [filters, setFilters]
  );

  const activeFilterCount =
    (filters.showPurchased !== "all" ? 1 : 0) +
    filters.selectedLocations.length +
    (filters.sortBy !== "date" ? 1 : 0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card px-6 py-4">
        <h1 className="text-2xl font-bold">本棚</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log("Add book")}
          aria-label="Add Book"
        >
          <Plus className="text-primary" />
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 border-b bg-muted/50 px-6 py-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3 py-2">
          <Search size={18} className="text-muted-foreground" />
          <Input
            placeholder="タイトルや著者で検索"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="border-none bg-transparent p-0 focus-visible:ring-0"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="relative rounded-xl bg-muted"
          onClick={() => setShowFilter(true)}
        >
          <Filter className="text-primary" />
          {activeFilterCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-yellow-500 p-0 text-[11px] font-bold text-white"
              variant="secondary"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="mb-3 text-xl font-bold">本がまだありません</h2>
            <p className="text-muted-foreground">
              スキャン機能でバーコードを読み取って登録しましょう。
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                // onClick={() => setSelectedBookId(book.id)}
                onClick={() => {
                  setSelectedBookId(book.id);
                  setOpenModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet */}
      {/* <Sheet open={showFilter} onOpenChange={setShowFilter}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>フィルター</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              （ここにFilter UIを実装）
            </p>
            <Button onClick={() => setShowFilter(false)}>閉じる</Button>
          </div>
        </SheetContent>
      </Sheet> */}

      <FilterBottomSheet
        visible={showFilter}
        filters={filters}
        allLocations={allLocations}
        // onClose={() => setShowFilter(false)}
        onOpenChange={() => setShowFilter(false)}
        onApply={setFilters}
      />

      {/* Book Detail Modal */}
      {/* <Dialog
        open={!!selectedBookId}
        onOpenChange={() => setSelectedBookId(null)}
      >
        <DialogContent className="max-w-md">
          {selectedBook ? (
            <>
              <h2 className="text-lg font-bold">{selectedBook.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedBook.author}
              </p>
              <Card className="p-3">
                <p className="text-sm">
                  場所: {selectedBook.locations.map((l) => l.place).join(", ")}
                </p>
                {selectedBook.purchased && (
                  <Badge className="mt-2 bg-green-500">購入済</Badge>
                )}
              </Card>
            </>
          ) : (
            <p>選択中の本がありません</p>
          )}
        </DialogContent>
      </Dialog> */}

      <BookDetailModal
        // visible={selectedBookId !== null}
        visible={selectedBookId !== null}
        book={selectedBook}
        onOpenChange={() => setSelectedBookId(null)}
        // onOpenChange={setOpenModal}
      />
    </div>
  );
}
