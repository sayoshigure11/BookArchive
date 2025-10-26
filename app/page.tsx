"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDocs,
  where,
  addDoc,
} from "firebase/firestore";

// Lucide React Icons (https://lucide.dev/icons/)
const BookOpen = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
const Plus = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);
const Scan = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 12h10" />
  </svg>
);
const X = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const Filter = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const Search = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const Star = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const Check = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const MapPin = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const Tag = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H2v9.172a2 2 0 0 0 .586 1.414l9.19 9.19a2 2 0 0 0 2.828 0l8.2-8.2a2 2 0 0 0 0-2.828z" />
    <path d="M7 7h.01" />
  </svg>
);

// --- Firebase Setup ---
const firebaseConfig =
  typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const initialAuthToken =
  typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

// Helper to handle async retries (Exponential Backoff)
const withRetry =
  (fn) =>
  async (...args) => {
    let delay = 1000;
    for (let i = 0; i < 3; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (i === 2) throw error;
        console.warn(
          `Firestore operation failed, retrying in ${delay}ms...`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  };

// Placeholder for the main API call function (as per instructions)
const getBookInfoFromIsbn = async (isbn) => {
  // 実際のアプリケーションでは、ISBNを使ってGoogle Books APIや外部データベースから
  // 書影、タイトル、著者、出版社などの情報を非同期で取得します。
  // 今回はデモとしてモックデータを返します。
  console.log(`ISBNで書籍情報を検索中: ${isbn}`);
  await new Promise((resolve) => setTimeout(resolve, 1500)); // API遅延をシミュレート

  // モックデータ (実際のISBNとは異なる場合があります)
  const mockBooks = {
    "978-4-06-189601-5": {
      title: "ノルウェイの森",
      author: "村上 春樹",
      publisher: "講談社",
      imageUrl:
        "https://placehold.co/100x150/007aff/ffffff?text=Norwegian+Wood",
      isbn: "978-4-06-189601-5",
    },
    "978-4-10-103303-3": {
      title: "こころ",
      author: "夏目 漱石",
      publisher: "新潮社",
      imageUrl: "https://placehold.co/100x150/f97316/ffffff?text=Kokoro",
      isbn: "978-4-10-103303-3",
    },
  };

  const book = mockBooks[isbn] || {
    title: "テストブック (ISBN: " + isbn + ")",
    author: "ジェミニ 太郎",
    publisher: "Google Books",
    imageUrl: `https://placehold.co/100x150/10b981/ffffff?text=Book+${isbn.slice(
      -4
    )}`,
    isbn: isbn,
  };

  return book;
};

// --- Types and Constants ---
const STATUS_OPTIONS = [
  {
    value: "want",
    label: "読みたい本",
    color: "bg-indigo-100 text-indigo-700",
  },
  { value: "read", label: "読了した本", color: "bg-green-100 text-green-700" },
];

const QUICK_PLACES = ["自宅", "職場の近く", "オンラインストア", "図書館"];

// --- UI Components ---

// Star Rating Component
const StarRating = ({ rating, setRating, size = 5, editable = false }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const value = index + 1;
    const isFilled = value <= rating;

    const handleClick = () => {
      if (editable) {
        setRating(value === rating ? 0 : value);
      }
    };

    return (
      <Star
        key={index}
        className={`w-${size} h-${size} ${
          isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        } ${
          editable
            ? "cursor-pointer hover:text-yellow-500 transition-colors"
            : ""
        }`}
        onClick={handleClick}
      />
    );
  });

  return <div className="flex space-x-0.5">{stars}</div>;
};

// Location and Price Set Component (繰り返しフォーム)
const LocationPriceSet = ({
  set,
  index,
  updateSet,
  deleteSet,
  availablePlaces = [],
}) => {
  const handleLocationChange = (e) => {
    updateSet(index, { ...set, location: e.target.value });
  };

  const handlePriceChange = (priceIndex, e) => {
    const newPrices = [...set.prices];
    newPrices[priceIndex] = e.target.value;
    updateSet(index, { ...set, prices: newPrices });
  };

  const addPrice = () => {
    updateSet(index, { ...set, prices: [...set.prices, ""] });
  };

  const deletePrice = (priceIndex) => {
    const newPrices = set.prices.filter((_, i) => i !== priceIndex);
    updateSet(index, { ...set, prices: newPrices });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-700 flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-indigo-500" /> 場所 #{index + 1}
        </h4>
        <button
          onClick={() => deleteSet(index)}
          className="text-red-500 hover:text-red-700 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        場所名
      </label>
      <input
        type="text"
        value={set.location}
        onChange={handleLocationChange}
        placeholder="例: 東京駅前店"
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-3"
      />

      {/* サジェストタグ */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_PLACES.filter((p) => p !== set.location).map((place) => (
          <button
            key={place}
            type="button"
            onClick={() => updateSet(index, { ...set, location: place })}
            className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full hover:bg-indigo-200 transition-colors flex items-center"
          >
            <Tag className="w-3 h-3 mr-1" /> {place}
          </button>
        ))}
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        価格 ({set.prices.length}件)
      </label>
      <div className="space-y-2">
        {set.prices.map((price, priceIndex) => (
          <div key={priceIndex} className="flex space-x-2">
            <input
              type="text"
              value={price}
              onChange={(e) => handlePriceChange(priceIndex, e)}
              placeholder="例: 110円, 220円, 1000円"
              className="flex-grow p-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={() => deletePrice(priceIndex)}
              className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addPrice}
        className="mt-3 text-sm flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
      >
        <Plus className="w-4 h-4 mr-1" /> 価格を追加
      </button>
    </div>
  );
};

// Main Book Modal (Confirmation/Edit)
const BookModal = ({
  bookData,
  isVisible,
  onClose,
  onSave,
  onQuickSave,
  availablePlaces,
}) => {
  const isNew = !bookData.id;

  // フォームの状態 (既存データまたは新規データの初期値)
  const [formData, setFormData] = useState({
    ...bookData,
    status: bookData.status || "want", // want:読みたい / read:読了
    rating: bookData.rating || 0,
    memo: bookData.memo || "",
    locationPrices: bookData.locationPrices || [{ location: "", prices: [""] }],
    isPurchased: bookData.isPurchased || false,
  });

  // モーダル表示時にデータをリセット
  useEffect(() => {
    if (isVisible && bookData) {
      setFormData({
        ...bookData,
        status: bookData.status || "want",
        rating: bookData.rating || 0,
        memo: bookData.memo || "",
        locationPrices: bookData.locationPrices || [
          { location: "", prices: [""] },
        ],
        isPurchased: bookData.isPurchased || false,
      });
    }
  }, [isVisible, bookData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  const updateLocationPriceSet = useCallback((index, newSet) => {
    setFormData((prev) => {
      const newSets = [...prev.locationPrices];
      newSets[index] = newSet;
      return { ...prev, locationPrices: newSets };
    });
  }, []);

  const addLocationPriceSet = () => {
    setFormData((prev) => ({
      ...prev,
      locationPrices: [...prev.locationPrices, { location: "", prices: [""] }],
    }));
  };

  const deleteLocationPriceSet = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      locationPrices: prev.locationPrices.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isVisible) return null;

  // レスポンシブなモーダルのスタイル (モバイルでは全画面、PCでは中央)
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 transition-opacity duration-300 flex items-start justify-center p-4 sm:p-0">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mt-8 sm:mt-16 transform transition-all duration-300 ease-out">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
            {isNew ? "本の登録/確認" : "本の詳細/編集"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* 1. 基本情報 (確認部分) */}
          <div className="flex mb-6 space-x-4 border-b pb-4">
            <img
              src={
                bookData.imageUrl ||
                `https://placehold.co/100x150/e0e7ff/3730a3?text=No+Image`
              }
              alt={`${bookData.title}の書影`}
              className="w-24 h-36 object-cover rounded-md shadow-md flex-shrink-0"
              onError={(e) =>
                (e.target.src = `https://placehold.co/100x150/e0e7ff/3730a3?text=No+Image`)
              }
            />
            <div className="flex-grow">
              <h4 className="text-xl font-extrabold text-gray-900 leading-tight mb-1">
                {bookData.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                著者: {bookData.author}
              </p>
              <p className="text-xs text-gray-500">
                出版社: {bookData.publisher}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ISBN: {bookData.isbn}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 2. ステータス・期待度 */}
            <div className="mb-6 space-y-4">
              <label className="block text-sm font-bold text-gray-700">
                ステータス
              </label>
              <div className="flex space-x-3">
                {STATUS_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`inline-flex items-center cursor-pointer p-2 rounded-full transition-all ${
                      formData.status === option.value
                        ? option.color + " ring-2 ring-indigo-500"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  期待度・評価
                </label>
                <StarRating
                  rating={formData.rating}
                  setRating={handleRatingChange}
                  size={7}
                  editable={true}
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isPurchased"
                  checked={formData.isPurchased}
                  onChange={handleChange}
                  id="isPurchased"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="isPurchased"
                  className="text-sm font-medium text-gray-700"
                >
                  購入済み
                </label>
              </div>
            </div>

            {/* 3. 場所と価格の複数フォーム */}
            <div className="mb-6 p-4 border rounded-lg bg-indigo-50">
              <h3 className="text-lg font-bold text-indigo-700 mb-4 border-b pb-2">
                場所と価格の記録
              </h3>
              {formData.locationPrices.map((set, index) => (
                <LocationPriceSet
                  key={index}
                  set={set}
                  index={index}
                  updateSet={updateLocationPriceSet}
                  deleteSet={deleteLocationPriceSet}
                  availablePlaces={availablePlaces}
                />
              ))}
              <button
                type="button"
                onClick={addLocationPriceSet}
                className="w-full mt-2 py-2 px-4 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" /> 場所セットを追加
              </button>
            </div>

            {/* 4. メモ */}
            <div className="mb-6">
              <label
                htmlFor="memo"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                メモ・感想
              </label>
              <textarea
                id="memo"
                name="memo"
                rows="3"
                value={formData.memo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="読んだ日付、感想、購入時のエピソードなどを記入..."
              ></textarea>
            </div>

            {/* 5. 登録/更新ボタン */}
            <div className="pt-4 border-t flex justify-end space-x-3">
              {isNew && (
                <button
                  type="button"
                  onClick={() => {
                    onQuickSave(formData);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  クイック登録
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
              >
                {isNew ? "登録を完了する" : "変更を保存する"}
              </button>
            </div>
          </form>
        </div>

        {bookData.id && (
          <div className="p-4 border-t flex justify-start">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("本当にこの本を削除しますか？")) {
                  onSave(bookData, true); // delete flag
                  onClose();
                }
              }}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              この本を削除
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Filter Modal
const FilterModal = ({
  isVisible,
  onClose,
  filters,
  setFilters,
  applyFilters,
}) => {
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    if (isVisible) {
      setTempFilters(filters);
    }
  }, [isVisible, filters]);

  if (!isVisible) return null;

  const handleSortChange = (e) => {
    setTempFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  };

  const handleStatusToggle = (status) => {
    setTempFilters((prev) => ({
      ...prev,
      status: prev.status === status ? null : status, // トグル
    }));
  };

  const handlePlaceToggle = (place) => {
    const currentPlaces = tempFilters.places || [];
    const newPlaces = currentPlaces.includes(place)
      ? currentPlaces.filter((p) => p !== place)
      : [...currentPlaces, place];

    setTempFilters((prev) => ({ ...prev, places: newPlaces }));
  };

  const handlePurchasedToggle = () => {
    setTempFilters((prev) => ({ ...prev, isPurchased: !prev.isPurchased }));
  };

  const handleApply = () => {
    applyFilters(tempFilters);
    onClose();
  };

  const handleClear = () => {
    applyFilters({});
    onClose();
  };

  // モックの利用可能な場所リスト (実際はFirestoreデータから抽出)
  const allAvailablePlaces = Array.from(
    new Set(["東京の書店", "オンラインストア", "地元の古本屋", ...QUICK_PLACES])
  );

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-gray-900 bg-opacity-75 transition-opacity duration-300 flex items-end justify-center">
      <div className="bg-white rounded-t-lg shadow-2xl w-full max-w-lg h-3/4 sm:h-auto transform transition-all duration-300 ease-out flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Filter className="w-6 h-6 mr-2 text-indigo-600" />{" "}
            複合フィルタリング
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto space-y-8">
          {/* ソート順 */}
          <div>
            <h4 className="font-bold text-gray-700 mb-3 border-b pb-1">
              ソート順
            </h4>
            <select
              value={tempFilters.sortBy || "title"}
              onChange={handleSortChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="title">タイトル順 (A-Z)</option>
              <option value="author">著者名順 (あ-順)</option>
              <option value="rating_desc">期待度順 (高→低)</option>
              <option value="createdAt_desc">登録日順 (新→古)</option>
            </select>
          </div>

          {/* ステータスフィルタ */}
          <div>
            <h4 className="font-bold text-gray-700 mb-3 border-b pb-1">
              ステータス
            </h4>
            <div className="flex space-x-3">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusToggle(option.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    tempFilters.status === option.value
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 購入済みフィルタ */}
          <div>
            <h4 className="font-bold text-gray-700 mb-3 border-b pb-1">
              購入ステータス
            </h4>
            <button
              type="button"
              onClick={handlePurchasedToggle}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                tempFilters.isPurchased
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } flex items-center`}
            >
              <Check
                className={`w-4 h-4 mr-1 ${
                  tempFilters.isPurchased ? "block" : "hidden"
                }`}
              />
              購入済みのみ
            </button>
          </div>

          {/* 場所フィルタ */}
          <div>
            <h4 className="font-bold text-gray-700 mb-3 border-b pb-1">
              購入/記録場所 (AND条件)
            </h4>
            <div className="flex flex-wrap gap-2">
              {allAvailablePlaces.map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => handlePlaceToggle(place)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors flex items-center ${
                    (tempFilters.places || []).includes(place)
                      ? "bg-pink-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {(tempFilters.places || []).includes(place) && (
                    <Check className="w-3 h-3 mr-1" />
                  )}
                  {place}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-between space-x-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
          >
            フィルタをクリア
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-colors"
          >
            フィルタを適用
          </button>
        </div>
      </div>
    </div>
  );
};

// Book Card Component for List
const BookCard = ({ book, onClick }) => {
  const statusOption =
    STATUS_OPTIONS.find((o) => o.value === book.status) || STATUS_OPTIONS[0];

  return (
    <div
      onClick={() => onClick(book)}
      className="flex items-start p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer mb-3 relative"
    >
      {/* 書影 */}
      <img
        src={
          book.imageUrl ||
          `https://placehold.co/80x120/e0e7ff/3730a3?text=No+Image`
        }
        alt={`${book.title}の書影`}
        className="w-16 h-24 object-cover rounded-md flex-shrink-0 shadow-md mr-3"
        onError={(e) =>
          (e.target.src = `https://placehold.co/80x120/e0e7ff/3730a3?text=No+Image`)
        }
      />

      <div className="flex-grow min-w-0">
        {/* タイトル */}
        <h4 className="text-base font-bold text-gray-900 truncate mb-0.5">
          {book.title}
        </h4>
        {/* 著者 */}
        <p className="text-sm text-gray-600 mb-2 truncate">
          著者: {book.author}
        </p>

        {/* 期待度・ステータス */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <StarRating rating={book.rating} size={4} />
          </div>
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusOption.color}`}
          >
            {statusOption.label}
          </span>
          {book.isPurchased && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 flex items-center">
              <Tag className="w-3 h-3 mr-1" /> 購入済
            </span>
          )}
        </div>

        {/* 場所（あればコンパクトに表示） */}
        {book.locationPrices &&
          book.locationPrices.length > 0 &&
          book.locationPrices[0].location && (
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> {book.locationPrices.length}
              箇所の価格を記録
            </p>
          )}
      </div>
    </div>
  );
};

const mockBooks = [
  {
    title: "ノルウェイの森",
    author: "村上 春樹",
    publisher: "講談社",
    imageUrl: "https://placehold.co/100x150/007aff/ffffff?text=Norwegian+Wood",
    isbn: "978-4-06-189601-5",
    status: "want", // want:読みたい / read:読了
    rating: 0,
    memo: "初期メモ",
    locationPrices: [
      {
        location: "東京",
        prices: ["110円"],
      },
      {
        location: "京都",
        prices: ["220円"],
      },
    ],
    isPurchased: false,
  },
  {
    title: "海辺のカフカ",
    author: "村上 春樹",
    publisher: "講談社",
    imageUrl: "https://placehold.co/100x150/007aff/ffffff?text=Norwegian+Wood",
    isbn: "978-4-06-189601-1",
    status: "want", // want:読みたい / read:読了
    rating: 3,
    memo: "初期メモ。海辺のカフカ、海辺のカフカ、海辺のカフカ、海辺のカフカ、海辺のカフカ",
    locationPrices: [
      {
        location: "BookOff/大久保",
        prices: ["110円", "220円"],
      },
      {
        location: "BookOff/伊勢田",
        prices: ["220円"],
      },
    ],
    isPurchased: false,
  },
];

// --- Main App Component ---
export default function App() {
  // Firebase State
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // App State
  // const [books, setBooks] = useState([]);
  const [books, setBooks] = useState(mockBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Modal State: { bookData: {...}, isQuickScan: boolean }
  const [modalConfig, setModalConfig] = useState(null);
  const isModalOpen = !!modalConfig;

  // --- Firebase Initialization and Auth ---
  useEffect(() => {
    if (!firebaseConfig.apiKey) {
      console.error("Firebase config is missing. Cannot initialize Firestore.");
      // 認証情報をロードせずにローカルデバッグモードに移行
      setUserId(crypto.randomUUID());
      setDb({ isMock: true });
      setIsLoading(false);
      return;
    }

    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const firebaseAuth = getAuth(app);

    setDb(firestore);
    setAuth(firebaseAuth);

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(firebaseAuth, initialAuthToken);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        } catch (error) {
          console.error("Authentication failed:", error);
          // 認証失敗時もランダムなIDで続行（データはプライベート空間に保存できない）
          setUserId(crypto.randomUUID());
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Firestore Data Listener (Books) ---
  useEffect(() => {
    if (!db || db.isMock || !userId) return;

    const booksColRef = collection(
      db,
      "artifacts",
      appId,
      "users",
      userId,
      "books"
    );

    // Firestoreは複合クエリをサポートしていないため、今回はリアルタイムリスナーですべて取得し、
    // クライアント側で検索・フィルタリングを行います。
    const q = booksColRef;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedBooks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(fetchedBooks);
      },
      (error) => {
        console.error("Firestore onSnapshot failed:", error);
      }
    );

    return () => unsubscribe();
  }, [db, userId]);

  // --- Firestore Data Operations ---
  const saveBook = useCallback(
    withRetry(async (bookData, isDelete = false) => {
      console.log("db,userId", { db, userId });
      if (!db || db.isMock || !userId) {
        console.error("Firestore is not ready or user is unauthorized.");
        return;
      }

      const dataToSave = {
        ...bookData,
        updatedAt: new Date().toISOString(),
      };

      const bookRef = bookData.id
        ? doc(db, "artifacts", appId, "users", userId, "books", bookData.id)
        : doc(collection(db, "artifacts", appId, "users", userId, "books"));

      if (isDelete && bookData.id) {
        await deleteDoc(bookRef);
        console.log("Book deleted:", bookData.id);
      } else if (bookData.id) {
        // 更新時はIDを含めない
        const { id, ...updateData } = dataToSave;
        await updateDoc(bookRef, updateData);
        console.log("Book updated:", bookData.id);
      } else {
        // 新規作成時
        const newData = { ...dataToSave, createdAt: new Date().toISOString() };
        await setDoc(bookRef, newData);
        console.log("Book created:", bookRef.id);
      }
    }),
    [db, userId]
  );

  // --- Filtered and Sorted Books ---
  const filteredBooks = useMemo(() => {
    let result = books;

    // 1. 検索 (タイトル/著者)
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(lowerCaseSearch) ||
          book.author?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // 2. フィルタリング (ステータス)
    if (filters.status) {
      result = result.filter((book) => book.status === filters.status);
    }

    // 3. フィルタリング (購入済み)
    if (filters.isPurchased) {
      result = result.filter((book) => book.isPurchased);
    }

    // 4. フィルタリング (場所 - AND条件)
    if (filters.places && filters.places.length > 0) {
      result = result.filter((book) => {
        if (!book.locationPrices || book.locationPrices.length === 0)
          return false;

        // 登録されている場所が、フィルタ条件の「全ての」場所を含んでいるかチェック
        const bookPlaces = book.locationPrices.map((lp) => lp.location);
        return filters.places.every((filterPlace) =>
          bookPlaces.includes(filterPlace)
        );
      });
    }

    // 5. ソート
    const sortBy = filters.sortBy || "createdAt_desc";
    result.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "author":
          return (a.author || "").localeCompare(b.author || "");
        case "rating_desc":
          return (b.rating || 0) - (a.rating || 0); // 期待度降順
        case "createdAt_desc":
          return new Date(b.createdAt) - new Date(a.createdAt); // 登録日降順
        default:
          return 0;
      }
    });

    return result;
  }, [books, searchTerm, filters]);

  // --- UI Handlers ---

  // 読書記録の編集・詳細表示
  const handleEditBook = (book) => {
    setModalConfig({ bookData: book, isQuickScan: false });
  };

  // バーコードスキャン後のモック確認画面表示
  const handleScanBook = async () => {
    // 実際にはここでWebRTCなどでカメラを起動し、バーコードを読み取ります
    // 今回はモックとして固定ISBNを使用
    const mockIsbn =
      Math.random() < 0.5 ? "978-4-06-189601-5" : "978-4-10-103303-3";

    setIsLoading(true);
    try {
      const bookInfo = await getBookInfoFromIsbn(mockIsbn);
      setModalConfig({ bookData: bookInfo, isQuickScan: true });
    } catch (error) {
      console.error("書籍情報取得エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSave = (formData, isDelete = false) => {
    saveBook(formData, isDelete);
    setModalConfig(null);
  };

  // クイック登録時のハンドラ
  const handleModalQuickSave = (formData) => {
    const quickData = {
      ...formData,
      // クイック登録では場所・価格は空、メモなしで登録
      locationPrices: [],
      memo: "",
      rating: 0,
      isPurchased: false,
      // クイック登録は「読みたい本」として仮登録
      status: "want",
    };
    saveBook(quickData);
    setModalConfig(null);
  };

  // モーダルを閉じる
  const closeModal = () => setModalConfig(null);

  // 利用可能な場所リストの抽出（フィルタリングモーダル用）
  const availablePlaces = useMemo(() => {
    const places = new Set();
    books.forEach((book) => {
      book.locationPrices?.forEach((lp) => {
        if (lp.location) places.add(lp.location);
      });
    });
    return Array.from(places);
  }, [books]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="ml-3 text-indigo-600 font-semibold">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-xl mx-auto bg-white shadow-xl min-h-screen">
        {/* Header (検索・フィルタリング) */}
        <header className="sticky top-0 bg-white z-20 p-4 border-b shadow-sm">
          <h1 className="text-2xl font-extrabold text-indigo-700 flex items-center mb-4">
            <BookOpen className="w-7 h-7 mr-2" /> 読書記録アプリ
          </h1>

          <div className="flex space-x-2">
            {/* 検索フォーム */}
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="タイトルや著者で検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* フィルタリングボタン */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`p-3 rounded-lg transition-colors shadow-md ${
                Object.keys(filters).length > 0
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Filter className="w-6 h-6" />
            </button>
          </div>

          {/* フィルタ適用中の表示 */}
          {Object.keys(filters).length > 0 && (
            <div className="mt-3 text-sm text-indigo-700 font-medium">
              <span className="bg-indigo-100 px-3 py-1 rounded-full flex items-center w-fit">
                <Filter className="w-4 h-4 mr-1" />
                フィルタ適用中: {filteredBooks.length} / {books.length} 件
              </span>
            </div>
          )}
        </header>

        {/* Book List */}
        <main className="p-4 pt-6">
          {filteredBooks.length === 0 && (
            <div className="text-center p-10 bg-gray-100 rounded-xl mt-8">
              <p className="text-gray-500">
                {books.length === 0
                  ? "まだ本が登録されていません。"
                  : "現在のフィルタに一致する本はありません。"}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                下のボタンから登録するか、フィルタを調整してください。
              </p>
            </div>
          )}

          <div className="space-y-3">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onClick={handleEditBook} />
            ))}
          </div>
        </main>

        {/* ユーザーID表示 (必須要件) */}
        <div className="p-4 text-xs text-center text-gray-400 border-t">
          ユーザーID: {userId || "認証情報なし"}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={handleScanBook}
        disabled={isLoading}
        className="fixed bottom-6 right-6 sm:right-auto sm:left-1/2 sm:transform sm:-translate-x-1/2 z-30 p-4 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all duration-300 flex items-center space-x-2 font-bold text-lg"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : (
          <>
            <Scan className="w-6 h-6" />
            <span>バーコード登録</span>
          </>
        )}
      </button>

      {/* モーダル表示 */}
      <BookModal
        bookData={modalConfig?.bookData || {}}
        isVisible={isModalOpen}
        onClose={closeModal}
        onSave={handleModalSave}
        onQuickSave={handleModalQuickSave}
        availablePlaces={availablePlaces}
      />

      {/* フィルタリングモーダル */}
      <FilterModal
        isVisible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        applyFilters={setFilters}
      />
    </div>
  );
}
