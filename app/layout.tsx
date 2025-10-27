import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BookProvider } from "@/hooks/bookProvider";
import { Tab } from "@/components/tab";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookArchive",
  description: "読んだ本と読みたい本を管理するアプリ",
  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BookArchive",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BookProvider>
          <div className="mb-12">{children}</div>
        </BookProvider>
        <div className="fixed bottom-0 z-50 w-full">
          <Tab />
        </div>
      </body>
    </html>
  );
}
