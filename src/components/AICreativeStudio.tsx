'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AICreativeStudio() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedMusic, setGeneratedMusic] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    // デモ用: 3秒後に結果表示
    setTimeout(() => {
      // Kaggleで開発した技術のデモ
      setGeneratedImage('/api/placeholder/400/400') // プレースホルダー
      setGeneratedMusic('/api/demo-music') // 後で実装
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* ヘッダー */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            🎨 AI Creative Studio
          </motion.h1>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              Gallery
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg hover:scale-105 transition-transform">
              Pro版
            </button>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
            世界初のマルチモーダル
            <br />
            AIクリエイティブプラットフォーム
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            あなたのアイデアを、AIが画像と音楽に同時変換。
            <br />
            想像するだけで、完全なクリエイティブ作品が完成します。
          </p>
          
          {/* 革新的技術バッジ */}
          <div className="flex justify-center space-x-4 mb-12">
            <span className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full text-sm font-semibold">
              🖼️ AI画像生成
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-sm font-semibold">
              🎵 AI音楽生成
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full text-sm font-semibold">
              🔄 画像→音楽変換
            </span>
          </div>
        </motion.div>

        {/* 生成インターフェース */}
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3">
                ✨ あなたのクリエイティブビジョンを入力してください
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例: 未来の東京で踊るAIロボット、ネオンライトが美しい夜景..."
                className="w-full h-32 p-4 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 outline-none focus:border-pink-400 transition-colors resize-none"
              />
            </div>
            
            <motion.button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>🎨 AI創作中...</span>
                </div>
              ) : (
                '🚀 マルチモーダル生成開始'
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* 結果表示エリア */}
        {(generatedImage || generatedMusic) && (
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-3xl font-bold text-center mb-8">🎉 AI創作結果</h3>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* 画像結果 */}
              {generatedImage && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                  <h4 className="text-xl font-semibold mb-4 flex items-center">
                    🖼️ AI生成画像
                  </h4>
                  <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                    <span className="text-6xl">🎨</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-300">
                    Kaggleで開発した画像生成技術により作成
                  </p>
                </div>
              )}
              
              {/* 音楽結果 */}
              {generatedMusic && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                  <h4 className="text-xl font-semibold mb-4 flex items-center">
                    🎵 AI生成音楽
                  </h4>
                  <div className="aspect-square bg-gradient-to-br from-blue-400 to-green-400 rounded-xl flex items-center justify-center">
                    <span className="text-6xl">🎵</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-300">
                    世界初の画像→音楽変換技術により作成
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 技術的差別化 */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-8">🌟 革新技術</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">🧠</div>
              <h4 className="text-xl font-semibold mb-2">マルチモーダルAI</h4>
              <p className="text-gray-300">画像・音楽・テキストを統合的に理解・生成</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-semibold mb-2">リアルタイム生成</h4>
              <p className="text-gray-300">3秒以内で高品質な画像と音楽を同時生成</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold mb-2">感情連携</h4>
              <p className="text-gray-300">画像の感情を音楽に反映する革新的技術</p>
            </div>
          </div>
        </motion.div>

        {/* フッター */}
        <motion.footer 
          className="mt-20 text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>© 2024 AI Creative Studio - 世界初のマルチモーダルAIプラットフォーム</p>
          <p className="mt-2 text-sm">Powered by Kaggle技術 × Next.js × Framer Motion</p>
        </motion.footer>
      </main>
    </div>
  )
} 