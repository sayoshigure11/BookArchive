"use client";
import React, { useState, useMemo } from "react";
import { BookCard } from "./components/BookCard";

type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  purchased: boolean;
  prices: { place: string; values: number[] }[];
};

const books: Book[] = [
  {
    id: "1",
    title: "React入門",
    author: "山田太郎",
    coverUrl: "/covers/react.jpg",
    rating: 5,
    purchased: true,
    prices: [
      { place: "Amazon", values: [150, 180] },
      { place: "BookOff", values: [100, 120] },
      { place: "紀伊國屋", values: [200] },
    ],
  },
  {
    id: "2",
    title: "Next.js実践",
    author: "佐藤花子",
    coverUrl: "/covers/next.jpg",
    rating: 4,
    purchased: false,
    prices: [
      { place: "Amazon", values: [120, 140] },
      { place: "BookOff", values: [160] },
    ],
  },
];

export default function BookListPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    purchased: "all",
    store: "all",
    sort: "rating",
    minRating: 0,
  });

  const filteredBooks = useMemo(() => {
    return books
      .filter((b) =>
        `${b.title}${b.author}`.toLowerCase().includes(query.toLowerCase())
      )
      .filter((b) =>
        filters.purchased === "all"
          ? true
          : filters.purchased === "true"
          ? b.purchased
          : !b.purchased
      )
      .filter((b) =>
        filters.store === "all"
          ? true
          : b.prices.some((p) => p.place === filters.store)
      )
      .filter((b) => b.rating >= filters.minRating)
      .sort((a, b) =>
        filters.sort === "author"
          ? a.author.localeCompare(b.author)
          : b.rating - a.rating
      );
  }, [filters, query]);

  return (
    <div className="p-3 space-y-3 bg-gray-50 min-h-screen">
      {/* 🔍 検索フォーム */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="タイトル・著者で検索"
        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none"
      />

      {/* 📋 フィルター群 */}
      <div className="flex gap-2 overflow-x-auto text-sm py-1">
        <select
          onChange={(e) =>
            setFilters((f) => ({ ...f, purchased: e.target.value }))
          }
          className="p-2 border rounded-md bg-white"
        >
          <option value="all">すべて</option>
          <option value="true">購入済み</option>
          <option value="false">未購入</option>
        </select>

        <select
          onChange={(e) => setFilters((f) => ({ ...f, store: e.target.value }))}
          className="p-2 border rounded-md bg-white"
        >
          <option value="all">全店舗</option>
          <option value="Amazon">Amazon</option>
          <option value="BookOff">BookOff</option>
          <option value="紀伊國屋">紀伊國屋</option>
        </select>

        <select
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          className="p-2 border rounded-md bg-white"
        >
          <option value="rating">期待度順</option>
          <option value="author">著者順</option>
        </select>

        <select
          onChange={(e) =>
            setFilters((f) => ({ ...f, minRating: Number(e.target.value) }))
          }
          className="p-2 border rounded-md bg-white"
        >
          <option value={0}>全ての評価</option>
          <option value={3}>期待度3以上</option>
          <option value={4}>期待度4以上</option>
          <option value={5}>期待度5のみ</option>
        </select>
      </div>

      {/* 📚 書籍リスト */}
      <div className="grid grid-cols-1 gap-3">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
