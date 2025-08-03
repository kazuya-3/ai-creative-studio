import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ビルド時のESLintエラーを無視
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ビルド時のTypeScriptエラーを無視
    ignoreBuildErrors: true,
  },
  // Service Worker関連のエラーを防ぐ
  experimental: {
    // 不要なプリロードを防ぐ
    optimizePackageImports: ['@next/font'],
  },
  
  // 画像最適化
  images: {
    domains: ['via.placeholder.com', 'picsum.photos'],
    unoptimized: false,
  },
  
  // ヘッダー設定（CSPを含む）
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "media-src 'self' data: blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; '),
          },
        ],
      },
    ];
  },
  
  // 不要なファイルを除外
  webpack: (config, { dev, isServer }) => {
    // 開発環境でのService Worker関連のエラーを防ぐ
    if (dev) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
