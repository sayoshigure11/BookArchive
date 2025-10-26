"use client";
import React, { useState } from "react";
import { X, Plus, MapPin, Tag, Book, Calendar, Hash } from "lucide-react";

const BookRegistrationApp = () => {
  const [showModal, setShowModal] = useState(false);
  const [bookData, setBookData] = useState({
    title: "吾輩は猫である",
    author: "夏目漱石",
    publisher: "岩波書店",
    isbn: "9784003101018",
    year: "1990",
    coverUrl: "https://via.placeholder.com/200x280/4A90E2/FFFFFF?text=書影",
  });
  const [status, setStatus] = useState("読みたい");
  const [memo, setMemo] = useState("");
  const [locations, setLocations] = useState([{ location: "", prices: [""] }]);
  const [existingLocations] = useState([
    "東京",
    "京都",
    "大阪",
    "名古屋",
    "福岡",
  ]);

  const addPriceField = (locationIndex) => {
    const newLocations = [...locations];
    newLocations[locationIndex].prices.push("");
    setLocations(newLocations);
  };

  const removePriceField = (locationIndex, priceIndex) => {
    const newLocations = [...locations];
    newLocations[locationIndex].prices.splice(priceIndex, 1);
    if (newLocations[locationIndex].prices.length === 0) {
      newLocations.splice(locationIndex, 1);
    }
    setLocations(newLocations);
  };

  const updateLocation = (index, value) => {
    const newLocations = [...locations];
    newLocations[index].location = value;
    setLocations(newLocations);
  };

  const updatePrice = (locationIndex, priceIndex, value) => {
    const newLocations = [...locations];
    newLocations[locationIndex].prices[priceIndex] = value;
    setLocations(newLocations);
  };

  const addLocationSet = () => {
    setLocations([...locations, { location: "", prices: [""] }]);
  };

  const handleRegister = () => {
    const filteredLocations = locations.filter(
      (loc) => loc.location.trim() && loc.prices.some((p) => p.trim())
    );
    console.log("登録データ:", {
      ...bookData,
      status,
      memo,
      locations: filteredLocations,
    });
    alert("本を登録しました！");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">📚 読書記録</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            バーコードで本を登録
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-800">
                  本の情報確認
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex-shrink-0">
                    <img
                      src={bookData.coverUrl}
                      alt="書影"
                      className="w-48 h-64 object-cover rounded-lg shadow-md mx-auto md:mx-0"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {bookData.title}
                      </h3>
                      <div className="space-y-2 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Book size={18} className="text-gray-500" />
                          <span className="font-medium">著者:</span>
                          <span>{bookData.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag size={18} className="text-gray-500" />
                          <span className="font-medium">出版社:</span>
                          <span>{bookData.publisher}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-gray-500" />
                          <span className="font-medium">出版年:</span>
                          <span>{bookData.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash size={18} className="text-gray-500" />
                          <span className="font-medium">ISBN:</span>
                          <span className="text-sm">{bookData.isbn}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        読書ステータス
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {["読みたい", "読んでいる", "読了"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${
                              status === s
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    メモ（任意）
                  </label>
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="感想やメモを入力..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      購入場所・価格（任意）
                    </label>
                    <button
                      onClick={addLocationSet}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                      <Plus size={16} />
                      場所を追加
                    </button>
                  </div>

                  <div className="space-y-4">
                    {locations.map((loc, locIndex) => (
                      <div
                        key={locIndex}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin size={18} className="text-gray-500" />
                            <label className="text-sm font-medium text-gray-700">
                              場所
                            </label>
                          </div>
                          <input
                            list={`locations-${locIndex}`}
                            value={loc.location}
                            onChange={(e) =>
                              updateLocation(locIndex, e.target.value)
                            }
                            placeholder="場所を入力または選択"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <datalist id={`locations-${locIndex}`}>
                            {existingLocations.map((el) => (
                              <option key={el} value={el} />
                            ))}
                          </datalist>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            価格（円）
                          </label>
                          {loc.prices.map((price, priceIndex) => (
                            <div key={priceIndex} className="flex gap-2">
                              <input
                                type="number"
                                value={price}
                                onChange={(e) =>
                                  updatePrice(
                                    locIndex,
                                    priceIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="価格を入力"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                              />
                              <button
                                onClick={() =>
                                  removePriceField(locIndex, priceIndex)
                                }
                                className="text-red-500 hover:text-red-700 p-2"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addPriceField(locIndex)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                          >
                            <Plus size={16} />
                            価格を追加
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleRegister}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    登録する
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRegistrationApp;
