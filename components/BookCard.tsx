// chatGPTに書き換えて貰った。
// components/BookCard.tsx
"use client";

import Image from "next/image";
import { Check, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Book } from "@/lib/types";

type BookCardProps = {
  book: Book;
  onClick: () => void;
};

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg",
        "dark:bg-neutral-900 dark:hover:shadow-neutral-700"
      )}
    >
      <div className="relative h-[135px] w-[90px] shrink-0 bg-muted">
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-2 text-base font-bold text-foreground">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {book.author}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {book.purchased && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-green-500 text-white hover:bg-green-600"
            >
              <Check size={12} />
              <span className="text-xs font-semibold">購入済</span>
            </Badge>
          )}

          {book.expectation && book.expectation > 0 && (
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{book.expectation}</span>
            </div>
          )}
        </div>

        {book.locations.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-muted-foreground">
            <MapPin size={12} />
            <p className="line-clamp-1 text-xs">
              {book.locations.map((l) => l.place).join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
