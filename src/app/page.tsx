"use client";
import React, { useState, useEffect } from 'react';
import FeedbackModal from '@/components/FeedbackModal';
import { 
  trackAIGeneration, 
  trackEngagement, 
  trackPageView,
  trackImageGeneration,
  trackMusicGeneration,
  trackImageToMusicConversion
} from '@/utils/analytics';
import { setupGlobalErrorHandler, handleAPIError } from '@/utils/errorTracking';

// アイコンコンポーネント（lucide-react代替）
interface IconProps {
  name: string;
  className?: string;
}

const Icon = ({ name, className = "w-5 h-5" }: IconProps) => {
  const icons: Record<string, string> = {
    sparkles: "✨",
    image: "🖼️",
    music: "🎵",
    wand: "🪄",
    play: "▶️",
    pause: "⏸️",
    download: "⬇️",
    upload: "⬆️",
    palette: "🎨",
    volume: "🔊"
  };
  
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      {icons[name] || "•"}
    </span>
  );
};

// アイコンコンポーネントのエイリアス
interface IconComponentProps {
  className?: string;
}

const Sparkles = (props: IconComponentProps) => <Icon name="sparkles" {...props} />;
const Image = (props: IconComponentProps) => <Icon name="image" {...props} />;
const Music = (props: IconComponentProps) => <Icon name="music" {...props} />;
const Wand2 = (props: IconComponentProps) => <Icon name="wand" {...props} />;
const Play = (props: IconComponentProps) => <Icon name="play" {...props} />;
const Pause = (props: IconComponentProps) => <Icon name="pause" {...props} />;
const Download = (props: IconComponentProps) => <Icon name="download" {...props} />;
// const Upload = (props: IconComponentProps) => <Icon name="upload" {...props} />;
const Palette = (props: IconComponentProps) => <Icon name="palette" {...props} />;
const Volume2 = (props: IconComponentProps) => <Icon name="volume" {...props} />;

// 型定義
interface ImageResult {
  imageUrl: string;
  metadata?: {
    prompt?: string;
    style?: string;
    size?: string;
    generationTime?: number;
  };
}

interface MusicResult {
  audioUrl: string;
  waveform?: number[];
  metadata?: {
    generatedTitle?: string;
    genre?: string;
    duration?: number;
    generationTime?: number;
  };
}

interface ImageAnalysis {
  mood: string;
  brightness: number;
  emotions?: string[];
  dominantColors?: string[];
  complexity?: number;
}

const AICreativeStudio = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<ImageResult | null>(null);
  const [generatedMusic, setGeneratedMusic] = useState<MusicResult | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  // フォーム状態
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('anime');
  const [size, setSize] = useState('512x512');
  const [genre, setGenre] = useState('ambient');
  const [creativityLevel, setCreativityLevel] = useState<number>(70);
  const [qualityLevel, setQualityLevel] = useState<number>(80);

  // 画像生成API呼び出し
  const handleImageGeneration = async () => {
    if (!prompt.trim()) {
      alert('プロンプトを入力してください');
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style,
          size,
          creativityLevel,
          qualityLevel
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setGeneratedImage(result);
        
        // 画像生成イベント追跡
        const generationTime = Date.now() - startTime;
        trackImageGeneration(
          prompt,
          style,
          size,
          creativityLevel,
          qualityLevel,
          generationTime
        );
      } else {
        alert('画像生成エラー: ' + result.error);
        handleAPIError(result.error, 'image_generation');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('API呼び出しエラー: ' + errorMessage);
      handleAPIError(error, 'image_generation');
    } finally {
      setIsGenerating(false);
    }
  };

  // 音楽生成API呼び出し
  const handleMusicGeneration = async () => {
    setIsGenerating(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/generate/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre,
          duration: 30,
          tempo: 120,
          mood: 'neutral'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setGeneratedMusic(result);
        
        // 音楽生成イベント追跡
        const generationTime = Date.now() - startTime;
        trackMusicGeneration(
          prompt || '音楽生成',
          genre,
          30,
          120,
          'neutral',
          generationTime
        );
      } else {
        alert('音楽生成エラー: ' + result.error);
        handleAPIError(result.error, 'music_generation');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('API呼び出しエラー: ' + errorMessage);
      handleAPIError(error, 'music_generation');
    } finally {
      setIsGenerating(false);
    }
  };

  // 画像→音楽変換API呼び出し
  const handleImageToMusic = async (imageUrl: string) => {
    setIsGenerating(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/convert/image-to-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          genre,
          duration: 30,
          intensity: 50
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setGeneratedMusic(result);
        setImageAnalysis(result.imageAnalysis);
        
        // 画像→音楽変換イベント追跡
        const generationTime = Date.now() - startTime;
        trackImageToMusicConversion(
          imageUrl,
          genre,
          30,
          50,
          result.imageAnalysis,
          generationTime
        );
      } else {
        alert('画像→音楽変換エラー: ' + result.error);
        handleAPIError(result.error, 'image_to_music_conversion');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('API呼び出しエラー: ' + errorMessage);
      handleAPIError(error, 'image_to_music_conversion');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (activeTab === 'generate') {
      handleImageGeneration();
    } else {
      // 画像がある場合は画像→音楽変換、ない場合は通常の音楽生成
      if (generatedImage?.imageUrl) {
        handleImageToMusic(generatedImage.imageUrl);
      } else {
        handleMusicGeneration();
      }
    }
    
    // 生成イベント追跡
    trackEngagement('ai_generation_started', 1);
  };

  // 初期化
  useEffect(() => {
    // ページビュー追跡
    trackPageView(window.location.pathname);
    
    // エラーハンドラー設定
    setupGlobalErrorHandler();
    
    // エンゲージメント追跡
    trackEngagement('page_view', 1);
  }, []);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    trackEngagement('music_playback_toggle', 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* ヘッダー */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Creative Studio</h1>
                <p className="text-purple-200">世界初マルチモーダルAI創作プラットフォーム</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-lg">
                <span className="text-green-300 text-sm font-medium">β版 LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* メインコントロールパネル */}
          <div className="lg:col-span-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    activeTab === 'generate'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Image className="w-4 h-4 inline mr-2" />
                  画像生成
                </button>
                <button
                  onClick={() => setActiveTab('convert')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    activeTab === 'convert'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Music className="w-4 h-4 inline mr-2" />
                  音楽変換
                </button>
              </div>

              {activeTab === 'generate' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      プロンプト
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-24 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="美しい夕日の風景、アニメスタイル、高品質..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">スタイル</label>
                      <select 
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="anime">アニメ</option>
                        <option value="realistic">リアル</option>
                        <option value="artistic">アーティスティック</option>
                        <option value="cyberpunk">サイバーパンク</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">サイズ</label>
                      <select 
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="512x512">512×512</option>
                        <option value="768x768">768×768</option>
                        <option value="1024x1024">1024×1024</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'convert' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      音楽ジャンル
                    </label>
                    <select 
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="ambient">アンビエント</option>
                      <option value="electronic">エレクトロニック</option>
                      <option value="classical">クラシック</option>
                      <option value="jazz">ジャズ</option>
                      <option value="cinematic">シネマティック</option>
                    </select>
                  </div>

                  {imageAnalysis && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-2">画像分析結果</h4>
                      <div className="text-sm text-purple-200 space-y-1">
                        <p><strong>ムード:</strong> {imageAnalysis.mood}</p>
                        <p><strong>明度:</strong> {Math.round(imageAnalysis.brightness)}%</p>
                        <p><strong>感情:</strong> {imageAnalysis.emotions?.join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    生成中...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Wand2 className="w-5 h-5 mr-2" />
                    AI生成開始
                  </div>
                )}
              </button>
            </div>

            {/* 高度な設定 */}
            <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h3 className="text-white font-medium mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                高度な設定
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm mb-2">クリエイティブ度: {creativityLevel}%</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={creativityLevel}
                                         onChange={(e) => setCreativityLevel(Number(e.target.value))}
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-purple-200 mt-1">
                    <span>安全</span>
                    <span>創造的</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white text-sm mb-2">品質: {qualityLevel}%</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={qualityLevel}
                                         onChange={(e) => setQualityLevel(Number(e.target.value))}
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-purple-200 mt-1">
                    <span>高速</span>
                    <span>最高品質</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 結果表示エリア */}
          <div className="lg:col-span-8">
            <div className="grid gap-6">
              {/* 画像結果 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <h3 className="text-white font-medium mb-4 flex items-center">
                  <Image className="w-5 h-5 mr-2" />
                  生成画像
                </h3>
                
                <div className="aspect-square bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center">
                  {generatedImage ? (
                    <div className="relative w-full h-full">
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-lg font-medium">{generatedImage.metadata?.prompt?.slice(0, 50)}...</div>
                          <div className="text-sm opacity-75 mt-2">
                            {generatedImage.metadata?.style} • {generatedImage.metadata?.size}
                          </div>
                          <div className="text-xs opacity-50 mt-1">
                            生成時間: {generatedImage.metadata?.generationTime ? (generatedImage.metadata.generationTime / 1000).toFixed(1) : 'N/A'}秒
                          </div>
                        </div>
                      </div>
                      <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                      <p className="text-purple-200">画像がここに表示されます</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 音楽プレイヤー */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <h3 className="text-white font-medium mb-4 flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  生成音楽
                </h3>
                
                <div className="bg-white/5 rounded-xl p-6">
                  {generatedMusic ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{generatedMusic.metadata?.generatedTitle || 'Generated Track'}</h4>
                          <p className="text-purple-200 text-sm">{generatedMusic.metadata?.genre} • {generatedMusic.metadata?.duration}秒</p>
                          {imageAnalysis && (
                            <p className="text-xs text-purple-300 mt-1">画像から生成 • {imageAnalysis.mood}ムード</p>
                          )}
                        </div>
                        <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={togglePlayback}
                          className="w-12 h-12 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white ml-1" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="h-2 bg-white/20 rounded-full">
                            <div className="w-1/3 h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                          </div>
                          <div className="flex justify-between text-xs text-purple-200 mt-1">
                            <span>0:00</span>
                            <span>{generatedMusic.metadata?.duration || 30}秒</span>
                          </div>
                        </div>
                        
                        <Volume2 className="w-5 h-5 text-purple-300" />
                      </div>
                      
                      {/* 波形ビジュライザー */}
                      <div className="grid grid-cols-32 gap-1">
                        {generatedMusic.waveform?.slice(0, 32).map((amplitude, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-purple-500/60 to-blue-500/60 rounded-sm transition-all duration-300"
                            style={{
                              height: `${amplitude * 32 + 8}px`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        )) || Array.from({length: 32}, (_, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-purple-500/60 to-blue-500/60 rounded-sm"
                            style={{
                              height: `${Math.random() * 32 + 8}px`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Music className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                      <p className="text-purple-200">音楽がここに表示されます</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* フッター統計 */}
      <footer className="mt-16 bg-white/5 backdrop-blur-lg border-t border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white mb-1">
                {generatedImage ? '1' : '0'}
              </div>
              <div className="text-purple-200 text-sm">生成画像数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">
                {generatedMusic ? '1' : '0'}
              </div>
              <div className="text-purple-200 text-sm">生成音楽数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">
                {isGenerating ? '生成中' : '待機中'}
              </div>
              <div className="text-purple-200 text-sm">システム状態</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">β版</div>
              <div className="text-purple-200 text-sm">バージョン</div>
            </div>
          </div>
        </div>
      </footer>

      {/* フィードバックボタン */}
      <button
        onClick={() => {
          setIsFeedbackModalOpen(true);
          trackEngagement('feedback_button_clicked', 1);
        }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-110 z-40 backdrop-blur-sm border border-white/20"
        aria-label="フィードバックを送信"
      >
        <div className="relative">
          <span className="text-2xl">💬</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
        </div>
      </button>

      {/* フィードバックモーダル */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </div>
  );
};

export default AICreativeStudio;