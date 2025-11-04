"use client";

import { BookRegistrationModal } from "@/components/BookRegistrationModal";
import { Input } from "@/components/ui/input";
import { extractName } from "@/lib/extractName";
import { Search } from "lucide-react";
import React, { useState } from "react";
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

function SearchPage() {
  const [isbn, setIsbn] = useState<string>("");
  const [scannedBook, setScannedBook] = useState<ScannedBook | null>(null);

  const handleEnter = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isbn !== "") {
      await handleIsbnDetected(isbn);
    }
  };
  // --- ISBN 検出後処理 ---
  const handleIsbnDetected = async (isbn: string) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      );
      const json = await res.json();

      if (json.items?.length > 0) {
        const res1 = await fetch(`https://api.openbd.jp/v1/get?isbn=${isbn}`);
        const json1 = await res1.json();
        console.log("json1", json1);
        const authors = extractName(
          json1[0].onix.DescriptiveDetail.Contributor
        );

        const info = json.items[0].volumeInfo;
        setScannedBook({
          isbn,
          title: info.title || "不明",
          // author: info.authors?.join(", ") || "不明",
          author: authors,
          publisher: info.publisher || "不明",
          coverImage:
            info.imageLinks?.thumbnail ||
            info.imageLinks?.smallThumbnail ||
            "https://via.placeholder.com/200x300?text=No+Image",
        });
      } else {
        alert("本の情報が見つかりませんでした");
      }
    } catch (err) {
      console.error(err);
      alert("本の情報の取得に失敗しました");
    } finally {
      setIsbn("");
    }
  };
  // --- モーダルを閉じてスキャン再開 ---
  const handleCloseModal = () => {
    setScannedBook(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-center text-2xl font-bold">SearchPage</h1>
      <div className="mt-4">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3 py-2">
          <Search size={18} className="text-muted-foreground" />
          <Input
            placeholder="isbnで検索"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="border-none bg-transparent p-0 focus-visible:ring-0"
            onKeyDown={handleEnter}
          />
        </div>
      </div>

      {scannedBook && (
        <BookRegistrationModal
          onClose={handleCloseModal}
          visible={!!scannedBook}
          bookData={scannedBook}
        />
      )}
    </div>
  );
}

export default SearchPage;
