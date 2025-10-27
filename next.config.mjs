/** @type {import('next').NextConfig} */
import nextPWA from "next-pwa"

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // 開発環境では PWA を無効にする
})

const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "http",
        hostname: "books.google.com"
      }
    ]
  }
}

export default withPWA(nextConfig)