// htmlq5Scanerに書き換えた。
// app/scan/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { BookRegistrationModal } from "@/components/BookRegistrationModal";

const kariIsbn = "9784041098721";

type ScannedBook = {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  coverImage: string;
};

export default function ScannerPage() {
  const readerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scannedBook, setScannedBook] = useState<ScannedBook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  // Next.jsのクライアントサイドルーティングでは、DOMの準備が完了する前にuseEffectが実行され、readerRef.currentがnullになる
  // これを解消するためにDOMが準備されてからカメラのuseEffectを実行させるための処置
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    function mountFunc() {
      setIsMounted(true);
    }
    mountFunc();
    return () => setIsMounted(false);
  }, []);

  // --- ISBN 検出後処理 ---
  const handleIsbnDetected = async (isbn: string) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      );
      const json = await res.json();

      if (json.items?.length > 0) {
        const info = json.items[0].volumeInfo;
        setScannedBook({
          isbn,
          title: info.title || "不明",
          author: info.authors?.join(", ") || "不明",
          publisher: info.publisher || "不明",
          coverImage:
            info.imageLinks?.thumbnail ||
            info.imageLinks?.smallThumbnail ||
            "https://via.placeholder.com/200x300?text=No+Image",
        });
      } else {
        alert("本の情報が見つかりませんでした");
        setIsScanning(true);
      }
    } catch (err) {
      console.error(err);
      alert("本の情報の取得に失敗しました");
      setIsScanning(true);
    }
  };

  useEffect(() => {
    if (!readerRef.current || !isScanning || scannerRef.current || !isMounted)
      return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 20,
        qrbox: { width: 300, height: 300 },
        formatsToSupport: [0], // 0 = all formats (QR, CODE_128, EAN, etc.)
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        setIsScanning(false);
        await handleIsbnDetected(decodedText);
        scanner.clear();
        scannerRef.current = null;
      },
      (err) => {
        // スキャンエラー（毎フレーム発生することもあるため無視OK）
        console.debug("Scan error:", err);
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scanner.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
    //   }, [isScanning]);
  }, [isScanning, isMounted]);

  // --- モーダルを閉じてスキャン再開 ---
  const handleCloseModal = () => {
    setScannedBook(null);
    setIsScanning(true);
  };

  const handleKari = async () => {
    await handleIsbnDetected(kariIsbn);
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-black">
      <div
        onClick={handleKari}
        className="absolute top-4 left-4 text-white text-lg font-semibold"
      >
        スキャン
      </div>

      {error ? (
        <div className="text-center text-white p-6">{error}</div>
      ) : (
        <div
          id="reader"
          ref={readerRef}
          className="w-[600px] max-w-full border rounded-xl shadow-md bg-white"
        />
      )}

      <div className="absolute bottom-8 text-center text-white text-sm">
        バーコードを枠内に合わせてください
      </div>

      {scannedBook && (
        <BookRegistrationModal
          onClose={handleCloseModal}
          visible={!!scannedBook}
          bookData={scannedBook}
        />
      )}
    </main>
  );
}
