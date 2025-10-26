"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, X } from "lucide-react";
import { Label } from "@/components/ui/label";
interface BarcodeScannerProps {
  onScan: (isbn: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [manualISBN, setManualISBN] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("カメラへのアクセスが拒否されました");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualISBN.trim()) {
      onScan(manualISBN.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">バーコードスキャン</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scanner Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
          {isScanning ? (
            <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-32 border-2 border-white rounded-lg" />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Camera className="w-16 h-16 text-muted-foreground" />
            </div>
          )}

          {!isScanning && (
            <Button onClick={startCamera} size="lg" className="w-full max-w-md">
              <Camera className="w-5 h-5 mr-2" />
              カメラを起動
            </Button>
          )}

          {isScanning && (
            <Button
              onClick={stopCamera}
              variant="outline"
              size="lg"
              className="w-full max-w-md bg-transparent"
            >
              カメラを停止
            </Button>
          )}

          {/* Manual Input */}
          <div className="w-full max-w-md pt-6 border-t border-border">
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <Label htmlFor="manual-isbn">ISBNを手動入力</Label>
                <Input
                  id="manual-isbn"
                  type="text"
                  placeholder="9784101001012"
                  value={manualISBN}
                  onChange={(e) => setManualISBN(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <Button type="submit" variant="secondary" className="w-full">
                検索
              </Button>
            </form>
          </div>

          <p className="text-xs text-muted-foreground text-center max-w-md">
            注:
            実際のバーコードスキャン機能は、本番環境ではバーコード読み取りライブラリ（例:
            @zxing/library）を使用して実装してください。
          </p>
        </div>
      </div>
    </div>
  );
}
