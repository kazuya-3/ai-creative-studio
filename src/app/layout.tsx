import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// フォントの設定を最適化
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // フォントの表示方法を最適化
  preload: true,   // プリロードを明示的に有効化
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "AI Creative Studio",
  description: "AIを活用したクリエイティブな開発環境",
  keywords: ["AI", "Creative", "Studio", "Next.js", "TypeScript"],
  authors: [{ name: "AI Creative Studio Team" }],
  creator: "AI Creative Studio",
  publisher: "AI Creative Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "AI Creative Studio",
    description: "AIを活用したクリエイティブな開発環境",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Creative Studio",
    description: "AIを活用したクリエイティブな開発環境",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        {/* Service Worker関連のエラーを防ぐためのスクリプト */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // グローバルエラーハンドラー
              window.addEventListener('error', function(event) {
                // Chrome拡張機能のエラーを無視
                if (event.message && (
                  event.message.includes('Could not establish connection') ||
                  event.message.includes('Receiving end does not exist') ||
                  event.message.includes('No tab with id') ||
                  event.message.includes('Extension context invalidated') ||
                  event.message.includes('chrome-extension://') ||
                  event.message.includes('moz-extension://') ||
                  event.message.includes('safari-extension://')
                )) {
                  event.preventDefault();
                  return false;
                }
              });
              
              // Service Worker関連のエラーを無視
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && (
                  event.reason.message && (
                    event.reason.message.includes('Failed to fetch') ||
                    event.reason.message.includes('Network request failed') ||
                    event.reason.message.includes('Failed to convert value to Response')
                  )
                )) {
                  event.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
