// 読み取った後にちゃんとスキャナーが解除される。Html5QrcodeScannerインスタンスなら大丈夫！
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QrReaderPage() {
  const [result, setResult] = useState<string | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!readerRef.current) return;

    // スキャナ設定
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 20,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setResult(decodedText);
        scanner.clear();
        scannerRef.current = null;
      },
      (error) => {
        console.warn("Scan error:", error);
      }
    );

    scannerRef.current = scanner;

    // コンポーネントのアンマウント時にスキャナ停止
    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {!result ? (
        <div
          id="reader"
          ref={readerRef}
          className="w-[600px] max-w-full border rounded-xl shadow-md"
        />
      ) : (
        <div id="result" className="text-center mt-6 text-xl">
          <h2 className="text-2xl font-semibold text-green-600 mb-2">
            Success!
          </h2>
          <p>
            <a
              href={result}
              className="text-blue-600 underline break-all hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              {result}
            </a>
          </p>
        </div>
      )}
    </main>
  );
}
