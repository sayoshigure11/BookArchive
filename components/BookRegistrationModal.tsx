// chatGPTに書き換えて貰った。
// components/BookRegistrationModal.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { MapPin, Plus, Star, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useBooks } from "@/hooks/bookProvider";
import { COMMON_LOCATIONS, COMMON_PRICES } from "@/lib/common-locations";
import { BookDetailModal } from "./BookDetailModal";

// const COMMON_LOCATIONS = ["Amazon", "BookOff", "楽天ブックス", "紀伊國屋"];
// const COMMON_PRICES = [110, 220, 500, 1000, 2000];

type BookLocation = {
  place: string;
  prices: number[];
};

type ScannedBook = {
  isbn: string;
  title: string;
  // author: string;
  author: {
    kanji: string;
    yomi: string;
  }[];
  publisher: string;
  coverImage: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  bookData: ScannedBook;
};

export function BookRegistrationModal({ visible, onClose, bookData }: Props) {
  const { addBook, allBooks } = useBooks();
  const [expectation, setExpectation] = useState(3);
  const [purchased, setPurchased] = useState(false);
  const [locations, setLocations] = useState<BookLocation[]>([]);
  const [showCustom, setShowCustom] = useState(false);
  const [customPlace, setCustomPlace] = useState("");
  const [customPrices, setCustomPrices] = useState<string[]>([""]);

  // --- Handlers ---
  const handleAddLocation = useCallback((place: string) => {
    setLocations((prev) =>
      prev.some((l) => l.place === place)
        ? prev
        : [...prev, { place, prices: [] }]
    );
  }, []);

  const handleRemoveLocation = (place: string) => {
    setLocations((prev) => prev.filter((l) => l.place !== place));
  };

  const handleAddPrice = (place: string, price: number) => {
    setLocations((prev) =>
      prev.map((l) =>
        l.place === place
          ? { ...l, prices: Array.from(new Set([...l.prices, price])) }
          : l
      )
    );
  };

  const handleRemovePrice = (place: string, index: number) => {
    setLocations((prev) =>
      prev.map((l) =>
        l.place === place
          ? { ...l, prices: l.prices.filter((_, i) => i !== index) }
          : l
      )
    );
  };

  const handleAddCustomLocation = () => {
    const place = customPlace.trim();
    const prices = customPrices
      .map((p) => parseInt(p.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    if (!place) return alert("場所名を入力してください");
    if (prices.length === 0) return alert("価格を入力してください");

    setLocations((prev) => {
      const existing = prev.find((l) => l.place === place);
      if (existing) {
        return prev.map((l) =>
          l.place === place
            ? { ...l, prices: Array.from(new Set([...l.prices, ...prices])) }
            : l
        );
      }
      return [...prev, { place, prices }];
    });
    setCustomPlace("");
    setCustomPrices([""]);
    setShowCustom(false);
  };

  const handleRegister = () => {
    addBook({
      isbn: bookData.isbn,
      title: bookData.title,
      author: bookData.author,
      publisher: bookData.publisher,
      coverImage: bookData.coverImage,
      expectation,
      purchased,
      locations,
    });
    onClose();
  };

  // スキャンした本が登録済みだった場合は代わりにその本の詳細モーダルを開く。
  const bookCheck = useMemo(() => {
    return allBooks.some((book) => book.isbn === bookData.isbn);
  }, [bookData, allBooks]);

  if (bookCheck) {
    const existingBookData =
      allBooks.find((book) => book.isbn === bookData.isbn) ?? null;
    return (
      <BookDetailModal
        visible={visible}
        book={existingBookData}
        onOpenChange={onClose}
        existing={true}
      />
    );
  }

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader className="flex flex-row justify-between items-center mb-4">
          <DialogTitle className="text-xl font-semibold">本の登録</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        {/* 本の情報 */}
        <div className="space-y-2 mb-6">
          <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden">
            <Image
              src={bookData.coverImage}
              alt="book cover"
              fill
              className="object-contain bg-muted"
            />
          </div>
          <div>
            <p className="text-lg font-bold">{bookData.title}</p>
            <p className="text-sm text-muted-foreground">
              {/* 著者: {bookData.author} */}
              著者:{" "}
              {bookData.author.length > 1
                ? bookData.author[0].kanji + "ほか"
                : bookData.author[0].kanji}
            </p>
            <p className="text-sm text-muted-foreground">
              出版社: {bookData.publisher}
            </p>
            <p className="text-sm text-muted-foreground">
              ISBN: {bookData.isbn}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* 期待度 */}
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-2">期待度</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Button
                key={i}
                variant="ghost"
                size="icon"
                onClick={() => setExpectation(i)}
              >
                <Star
                  className={cn(
                    "h-6 w-6",
                    i <= expectation ? "fill-yellow-400 text-yellow-400" : ""
                  )}
                />
              </Button>
            ))}
          </div>
        </div>

        {/* 購入状況 */}
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-2">購入状況</h3>
          <div className="flex gap-3">
            <Button
              variant={!purchased ? "default" : "outline"}
              className="flex-1"
              onClick={() => setPurchased(false)}
            >
              未購入
            </Button>
            <Button
              variant={purchased ? "default" : "outline"}
              className="flex-1"
              onClick={() => setPurchased(true)}
            >
              購入済み
            </Button>
          </div>
        </div>

        {/* 購入場所と価格 */}
        <div>
          <h3 className="text-base font-semibold mb-2">購入場所と価格</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {COMMON_LOCATIONS.map((place) => {
              const selected = locations.some((l) => l.place === place);
              return (
                <Button
                  key={place}
                  variant={selected ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() =>
                    selected
                      ? handleRemoveLocation(place)
                      : handleAddLocation(place)
                  }
                >
                  {place}
                </Button>
              );
            })}
          </div>

          {/* ロケーションカード */}
          <div className="space-y-4">
            {locations.map((loc) => (
              <Card key={loc.place} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <p className="font-semibold">{loc.place}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLocation(loc.place)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {loc.prices.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 border rounded-full px-3 py-1 text-sm"
                    >
                      ¥{p.toLocaleString()}
                      <X
                        className="h-3 w-3 cursor-pointer text-muted-foreground"
                        onClick={() => handleRemovePrice(loc.place, idx)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {COMMON_PRICES.map((price) => (
                    <Button
                      key={price}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddPrice(loc.place, price)}
                      disabled={loc.prices.includes(price)}
                    >
                      ¥{price}
                    </Button>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* カスタム追加 */}
          {showCustom ? (
            <Card className="p-4 mt-4 space-y-3">
              <p className="font-semibold">カスタム場所</p>
              <Input
                placeholder="場所名"
                value={customPlace}
                onChange={(e) => setCustomPlace(e.target.value)}
              />
              <div className="space-y-2">
                {customPrices.map((price, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      placeholder="価格（円）"
                      type="number"
                      value={price}
                      onChange={(e) => {
                        const updated = [...customPrices];
                        updated[i] = e.target.value;
                        setCustomPrices(updated);
                      }}
                    />
                    {customPrices.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setCustomPrices(
                            customPrices.filter((_, idx) => idx !== i)
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomPrices([...customPrices, ""])}
                >
                  <Plus className="h-4 w-4 mr-1" /> 価格を追加
                </Button>
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCustom(false)}
                >
                  キャンセル
                </Button>
                <Button className="flex-1" onClick={handleAddCustomLocation}>
                  追加
                </Button>
              </div>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-4 border-dashed"
              onClick={() => setShowCustom(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> カスタム場所を追加
            </Button>
          )}
        </div>

        <Separator className="my-6" />

        {/* 登録ボタン */}
        <Button
          className="w-full py-5 text-base font-semibold"
          onClick={handleRegister}
        >
          登録
        </Button>
      </DialogContent>
    </Dialog>
  );
}
