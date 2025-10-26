"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

type Store = {
  id: string;
  name: string;
  prices: number[];
};

export default function StorePricesPage() {
  const [stores, setStores] = useState<Store[]>([]);

  const addStore = () => {
    setStores([...stores, { id: crypto.randomUUID(), name: "", prices: [] }]);
  };

  const removeStore = (id: string) => {
    setStores(stores.filter((s) => s.id !== id));
  };

  const updateStoreName = (id: string, name: string) => {
    setStores(stores.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  const addPrice = (id: string, price: number) => {
    setStores(
      stores.map((s) =>
        s.id === id ? { ...s, prices: [...s.prices, price] } : s
      )
    );
  };

  const removePrice = (storeId: string, index: number) => {
    setStores(
      stores.map((s) =>
        s.id === storeId
          ? { ...s, prices: s.prices.filter((_, i) => i !== index) }
          : s
      )
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">店舗別価格管理</h1>

      <div className="grid gap-4 w-full sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-3 border"
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="店舗名を入力"
                value={store.name}
                onChange={(e) => updateStoreName(store.id, e.target.value)}
                className="text-lg font-semibold border-b w-full focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => removeStore(store.id)}
                className="text-gray-400 hover:text-red-500 ml-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {store.prices.map((price, i) => (
                <span
                  key={i}
                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {price}円
                  <button
                    onClick={() => removePrice(store.id, i)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            <AddPriceInput onAdd={(price) => addPrice(store.id, price)} />
          </div>
        ))}
      </div>

      <button
        onClick={addStore}
        className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
      >
        <Plus size={18} />
        店舗を追加
      </button>
    </main>
  );
}

// 🔹 値段追加コンポーネント
function AddPriceInput({ onAdd }: { onAdd: (price: number) => void }) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    const price = parseInt(value);
    if (!isNaN(price)) {
      onAdd(price);
      setValue("");
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="number"
        inputMode="numeric"
        placeholder="金額を入力"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border rounded-lg px-3 py-1 w-full focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleAdd}
        className="bg-green-500 text-white px-3 rounded-lg hover:bg-green-600 transition"
      >
        追加
      </button>
    </div>
  );
}
