// chatGPTに書き換えて貰った。
"use client";

import Image from "next/image";
import { Check, Edit2, MapPin, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book } from "@/lib/types";
import { useBooks } from "@/hooks/bookProvider";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

type BookDetailModalProps = {
  visible: boolean;
  book: Book | null;
  onOpenChange: (open: boolean) => void;
  existing?: boolean;
};

export function BookDetailModal({
  visible,
  book,
  onOpenChange,
  existing,
}: BookDetailModalProps) {
  const { updateBook, deleteBook } = useBooks();

  if (!book) return null;

  const handleTogglePurchased = () => {
    updateBook(book.id, { purchased: !book.purchased });
  };

  const handleDelete = () => {
    const confirmed = window.confirm("この本を削除しますか？");
    if (confirmed) {
      deleteBook(book.id);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={visible} onOpenChange={onOpenChange}>
      {/* DialogContent provides modal panel */}
      <SheetContent
        side="bottom"
        className="h-screen w-screen [&>button:first-of-type]:hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              aria-label="Close"
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1 hover:bg-muted/50"
            >
              <X size={20} />
            </button>
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">
                本の詳細{existing ? `（登録済み）` : ""}
              </SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Edit">
              <Edit2 size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              aria-label="Delete"
            >
              <Trash2 size={16} className="text-destructive" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[80vh] overflow-y-auto">
          {/* Cover */}
          <div className="w-full bg-muted">
            <div className="relative h-[420px] w-full">
              <Image
                src={book.coverImage || "/placeholder-book.png"}
                alt={book.title}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Info */}
          <div className="bg-card border-b px-6 py-6">
            <h3 className="mb-2 text-2xl font-bold leading-tight">
              {book.title}
            </h3>
            {/* <p className="mb-4 text-sm text-muted-foreground">{book.author}</p> */}
            <p className="mb-4 text-sm text-muted-foreground">
              {book.author[0].kanji}
            </p>

            <div className="flex items-center gap-4">
              {book.purchased && (
                <Badge className="flex items-center gap-2 bg-green-600 text-white">
                  <Check size={14} />
                  <span className="text-sm font-medium">購入済</span>
                </Badge>
              )}

              {book.expectation > 0 && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: book.expectation }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Publisher / ISBN */}
          <div className="space-y-4 px-6 py-6">
            <Card className="p-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  出版社
                </p>
                <p className="mt-2 text-base text-foreground">
                  {book.publisher || "—"}
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  ISBN
                </p>
                <p className="mt-2 text-base text-foreground">
                  {book.isbn || "—"}
                </p>
              </div>
            </Card>
          </div>

          {/* Locations & Prices */}
          {book.locations && book.locations.length > 0 && (
            <div className="px-6 pb-6">
              <h4 className="mb-4 text-lg font-semibold">購入場所と価格</h4>

              <div className="flex flex-col gap-4">
                {book.locations.map((location, idx) => (
                  <div key={idx} className="rounded-xl bg-muted p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="text-base font-semibold">
                        {location.place}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {location.prices && location.prices.length > 0 ? (
                        location.prices.map((price: number, pIdx: number) => (
                          <div
                            key={pIdx}
                            className="rounded-lg border px-4 py-2 text-sm font-semibold"
                          >
                            ¥{price.toLocaleString()}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          価格情報なし
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchase toggle */}
          <div className="px-6 pb-8 pt-2">
            <button
              onClick={handleTogglePurchased}
              className={`flex w-full items-center justify-center gap-3 rounded-xl py-4 text-lg font-semibold transition ${
                book.purchased
                  ? "bg-green-600 text-white"
                  : "bg-transparent border-2 border-green-600 text-green-600"
              }`}
              aria-pressed={book.purchased}
            >
              <Check
                size={20}
                className={book.purchased ? "text-white" : "text-green-600"}
              />
              <span>{book.purchased ? "未購入に戻す" : "購入済みにする"}</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
