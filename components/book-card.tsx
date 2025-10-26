"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const statusLabels: Record<Book["status"], string> = {
  "want-to-read": "読みたい",
  reading: "読書中",
  completed: "読了",
};

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <Card
      className="flex gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-20 h-28 bg-muted rounded overflow-hidden">
        <img
          src={book.coverImage || "/placeholder.svg?height=112&width=80"}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
        </div>

        <div className="flex items-center gap-1 mt-auto">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < book.expectation
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="secondary" className="text-xs px-1.5 py-0">
            {statusLabels[book.status]}
          </Badge>
          {book.purchased && (
            <Badge
              variant="default"
              className="text-xs px-1.5 py-0 bg-green-600"
            >
              購入済み
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
