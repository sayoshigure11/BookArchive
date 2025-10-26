// 読み取った後にスキャナーが解除されない。Html5Qrcodeインスタンスはだめみたい。clearメソッドでもダメだった。というか手動解除すらできなくなってた。
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BookScanner() {
  const [isbn, setIsbn] = useState<string>("");
  // const [bookInfo, setBookInfo] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async () => {
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: "environment" }, // バックカメラを使用
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          // formatsToSupport: [
          //   Html5QrcodeSupportedFormats.EAN_13,
          //   Html5QrcodeSupportedFormats.EAN_8,
          // ],
        },
        (decodedText) => {
          console.log("decodedText", decodedText);
          // バーコード読み取り成功
          setIsbn(decodedText);
          // fetchBookInfo(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          // エラーは無視（スキャン中は頻繁に発生）
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error("カメラの起動に失敗しました", err);
    }
  };

  const stopScanner = async () => {
    console.log("scannerRef.current && isScanning", {
      current: scannerRef.current,
      isScanning,
    });
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        // await scannerRef.current.clear();
        setIsScanning(false);
      } catch (err) {
        console.error("スキャナーの停止に失敗しました", err);
      }
    }
  };

  // const fetchBookInfo = async (isbn: string) => {
  //   // Google Books API を使用
  //   const response = await fetch(
  //     `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
  //   );
  //   const data = await response.json();

  //   if (data.items && data.items.length > 0) {
  //     setBookInfo(data.items[0].volumeInfo);
  //   }
  // };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          本のバーコードスキャナー
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div id="reader" className="mb-4"></div>

          <div className="flex gap-4">
            <button
              onClick={startScanner}
              disabled={isScanning}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded"
            >
              {isScanning ? "スキャン中..." : "スキャン開始"}
            </button>

            {isScanning && (
              <button
                onClick={stopScanner}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded"
              >
                停止
              </button>
            )}
          </div>
        </div>

        {isbn && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">読み取ったISBN</h2>
            <p className="text-gray-700">{isbn}</p>
          </div>
        )}

        {/* {bookInfo && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">{bookInfo.title}</h2>

            {bookInfo.imageLinks && (
              <img
                src={bookInfo.imageLinks.thumbnail}
                alt={bookInfo.title}
                className="mb-4 rounded shadow"
              />
            )}

            <div className="space-y-2">
              {bookInfo.authors && (
                <p>
                  <span className="font-semibold">著者:</span>{" "}
                  {bookInfo.authors.join(", ")}
                </p>
              )}
              {bookInfo.publisher && (
                <p>
                  <span className="font-semibold">出版社:</span>{" "}
                  {bookInfo.publisher}
                </p>
              )}
              {bookInfo.publishedDate && (
                <p>
                  <span className="font-semibold">出版日:</span>{" "}
                  {bookInfo.publishedDate}
                </p>
              )}
              {bookInfo.description && (
                <div>
                  <p className="font-semibold">説明:</p>
                  <p className="text-gray-700 mt-1">{bookInfo.description}</p>
                </div>
              )}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
