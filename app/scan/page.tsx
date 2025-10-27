// // chatGPTに書き換えて貰った。
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { BrowserMultiFormatReader } from "@zxing/browser";
// import { Flashlight, FlashlightOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { BookRegistrationModal } from "@/components/BookRegistrationModal";

// type ScannedBook = {
//   isbn: string;
//   title: string;
//   author: string;
//   publisher: string;
//   coverImage: string;
// };

// export default function ScannerPage() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [torchEnabled, setTorchEnabled] = useState(false);
//   const [isScanning, setIsScanning] = useState(true);
//   const [scannedBook, setScannedBook] = useState<ScannedBook | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const fetchBookInfo = async (isbn: string) => {
//     try {
//       const res = await fetch(
//         `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
//       );
//       const json = await res.json();
//       if (json.items?.length > 0) {
//         const info = json.items[0].volumeInfo;
//         setScannedBook({
//           isbn,
//           title: info.title || "不明",
//           author: info.authors?.join(", ") || "不明",
//           publisher: info.publisher || "不明",
//           coverImage:
//             info.imageLinks?.thumbnail ||
//             info.imageLinks?.smallThumbnail ||
//             "https://via.placeholder.com/200x300?text=No+Image",
//         });
//       } else {
//         alert("本の情報が見つかりませんでした");
//         setIsScanning(true);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("本の情報の取得に失敗しました");
//       setIsScanning(true);
//     }
//   };

//   useEffect(() => {
//     const codeReader = new BrowserMultiFormatReader();
//     let activeStream: MediaStream | null = null;

//     async function startScanner() {
//       try {
//         const videoInputDevices =
//           await BrowserMultiFormatReader.listVideoInputDevices();
//         const selectedDeviceId = videoInputDevices[0]?.deviceId;
//         if (!selectedDeviceId) {
//           setError("カメラデバイスが見つかりませんでした");
//           return;
//         }

//         const preview = videoRef.current;
//         if (!preview) return;

//         activeStream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: "environment" },
//         });
//         preview.srcObject = activeStream;
//         preview.play();

//         codeReader.decodeFromVideoDevice(
//           selectedDeviceId,
//           preview,
//           async (result, err) => {
//             if (result && isScanning) {
//               const isbn = result.getText();
//               setIsScanning(false);
//               await fetchBookInfo(isbn);
//             }
//           }
//         );
//       } catch (e) {
//         setError("カメラアクセスを許可してください");
//       }
//     }

//     startScanner();

//     return () => {
//       //   codeReader.reset();
//       codeReader.reset();
//       activeStream?.getTracks().forEach((track) => track.stop());
//     };
//   }, [isScanning]);

//   const handleCloseModal = () => {
//     setScannedBook(null);
//     setIsScanning(true);
//   };

//   return (
//     <div className="relative flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-black">
//       <div className="absolute top-4 left-4 text-white text-lg font-semibold">
//         スキャン
//       </div>

//       {error ? (
//         <div className="text-center text-white p-6">{error}</div>
//       ) : (
//         <video
//           ref={videoRef}
//           className="w-full max-w-md rounded-lg"
//           muted
//           playsInline
//         />
//       )}

//       <div className="absolute bottom-8 flex flex-col items-center space-y-4">
//         <p className="text-white text-sm">バーコードを枠内に合わせてください</p>

//         <Button
//           variant="secondary"
//           size="icon"
//           onClick={() => setTorchEnabled(!torchEnabled)}
//           className="bg-white/20 hover:bg-white/40 text-white rounded-full"
//         >
//           {torchEnabled ? (
//             <FlashlightOff size={24} />
//           ) : (
//             <Flashlight size={24} />
//           )}
//         </Button>
//       </div>

//       {/* <Dialog
//         open={!!scannedBook}
//         onOpenChange={(open) => !open && handleCloseModal()}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>本の情報を確認</DialogTitle>
//           </DialogHeader>
//           {scannedBook && (
//             <Card>
//               <CardContent className="flex gap-4">
//                 <Image
//                   src={scannedBook.coverImage}
//                   alt={scannedBook.title}
//                   width={100}
//                   height={150}
//                   className="rounded-md"
//                 />
//                 <div>
//                   <p className="font-semibold">{scannedBook.title}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {scannedBook.author}
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     {scannedBook.publisher}
//                   </p>
//                   <p className="text-sm text-muted-foreground mt-2">
//                     ISBN: {scannedBook.isbn}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//           <div className="flex justify-end mt-4">
//             <Button onClick={handleCloseModal}>閉じる</Button>
//           </div>
//         </DialogContent>
//       </Dialog> */}

//       {scannedBook && (
//         <BookRegistrationModal
//           onClose={handleCloseModal}
//           visible={!!scannedBook}
//           bookData={scannedBook}
//         />
//       )}
//     </div>
//   );
// }

// htmlq5Scanerに書き換えた。
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
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
    if (!readerRef.current || !isScanning || scannerRef.current) return;

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
      scanner.clear().catch(() => {});
    };
    //   }, [isScanning]);
  }, [isScanning]);

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
          //   className="w-[600px] max-w-full border rounded-xl shadow-md bg-white"
          className="w-[600px] max-w-full border rounded-xl shadow-md bg-white"
        />
      )}

      <div className="absolute bottom-8 text-center text-white text-sm">
        バーコードを枠内に合わせてください
      </div>

      {/* <Dialog
        open={!!scannedBook}
        onOpenChange={(open) => !open && handleCloseModal()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>本の情報を確認</DialogTitle>
          </DialogHeader>
          {scannedBook && (
            <Card>
              <CardContent className="flex gap-4">
                <Image
                  src={scannedBook.coverImage}
                  alt={scannedBook.title}
                  width={100}
                  height={150}
                  className="rounded-md"
                />
                <div>
                  <p className="font-semibold">{scannedBook.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {scannedBook.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {scannedBook.publisher}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ISBN: {scannedBook.isbn}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="flex justify-end mt-4">
            <Button onClick={handleCloseModal}>閉じる</Button>
          </div>
        </DialogContent>
      </Dialog> */}

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
