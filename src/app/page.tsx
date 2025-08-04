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
    if (typeof window !== 'undefined') {
      trackPageView(window.location.pathname);
    }
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-teal-500/5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* パーティクル効果 */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({length: 20}, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        {Array.from({length: 15}, (_, i) => (
          <div
            key={`small-${i}`}
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* ヘッダー */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-xl border border-white/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-100 to-blue-100 bg-clip-text text-transparent">
                  AI Creative Studio
                </h1>
                <p className="text-cyan-200/80 text-lg">世界初マルチモーダルAI創作プラットフォーム</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
                          <div className="px-8 py-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-500/20 backdrop-blur-2xl border border-cyan-400/30 rounded-3xl animate-pulse shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 relative overflow-hidden group">
              {/* ガラス反射効果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative z-10 flex items-center space-x-3">
                <span className="text-2xl animate-pulse">✨</span>
                <div>
                  <div className="text-cyan-100 text-sm font-bold drop-shadow-lg">技術プレビュー版</div>
                  <div className="text-cyan-200/80 text-xs">AI技術実装中</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* メインコントロールパネル */}
          <div className="lg:col-span-4">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 relative overflow-hidden group hover:translate-y-[-2px] hover:scale-[1.02]">
              {/* ガラス反射効果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {/* グロー効果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-400/5 to-teal-400/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              {/* フローティングガラスタブ */}
              <div className="flex space-x-3 mb-8 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 relative z-10 hover:translate-y-[-1px] transition-all duration-300">
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'generate'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-xl'
                      : 'text-cyan-200 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <Image className="w-5 h-5 inline mr-3" />
                  画像生成
                </button>
                <button
                  onClick={() => setActiveTab('convert')}
                  className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'convert'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-xl'
                      : 'text-cyan-200 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <Music className="w-5 h-5 inline mr-3" />
                  音楽変換
                </button>
              </div>

              {activeTab === 'generate' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-cyan-100 font-semibold mb-3 text-lg">
                      プロンプト
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-28 px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-cyan-100 placeholder-cyan-200/50 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="美しい夕日の風景、アニメスタイル、高品質..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-cyan-100 font-semibold mb-3">スタイル</label>
                      <select 
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 transition-all duration-300"
                      >
                        <option value="anime">アニメ</option>
                        <option value="realistic">リアル</option>
                        <option value="artistic">アーティスティック</option>
                        <option value="cyberpunk">サイバーパンク</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-cyan-100 font-semibold mb-3">サイズ</label>
                      <select 
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 transition-all duration-300"
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
                <div className="space-y-6">
                  <div>
                    <label className="block text-cyan-100 font-semibold mb-3 text-lg">
                      音楽ジャンル
                    </label>
                    <select 
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 transition-all duration-300"
                    >
                      <option value="ambient">アンビエント</option>
                      <option value="electronic">エレクトロニック</option>
                      <option value="classical">クラシック</option>
                      <option value="jazz">ジャズ</option>
                      <option value="cinematic">シネマティック</option>
                    </select>
                  </div>

                  {imageAnalysis && (
                                  <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-400/20 shadow-xl">
                <h4 className="text-cyan-100 font-semibold mb-4 text-lg flex items-center">
                  <span className="mr-2">🔬</span>
                  AI画像分析結果
                </h4>
                <div className="text-sm text-cyan-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">ムード:</span>
                    <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm rounded-full text-xs">{imageAnalysis.mood}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">明度:</span>
                    <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm rounded-full text-xs">{Math.round(imageAnalysis.brightness)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">感情:</span>
                    <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm rounded-full text-xs">{imageAnalysis.emotions?.join(', ')}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-cyan-400/20">
                  <div className="text-center">
                    <div className="text-cyan-100 text-xs font-medium">🚀 完全版は近日公開予定</div>
                  </div>
                </div>
              </div>
                  )}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full mt-8 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:scale-100 backdrop-blur-xl border border-white/20"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    デモ生成中...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Wand2 className="w-5 h-5 mr-2" />
                    デモ生成開始
                  </div>
                )}
              </button>
            </div>

            {/* 高度な設定 */}
            <div className="mt-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 relative overflow-hidden group hover:translate-y-[-2px] hover:scale-[1.02]">
              {/* ガラス反射効果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {/* グロー効果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-400/5 to-teal-400/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <h3 className="text-cyan-100 font-semibold mb-6 flex items-center text-lg relative z-10">
                <Palette className="w-6 h-6 mr-3 drop-shadow-lg" />
                高度な設定
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-cyan-100 font-medium mb-3">クリエイティブ度: {creativityLevel}%</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={creativityLevel}
                    onChange={(e) => setCreativityLevel(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider" 
                  />
                  <div className="flex justify-between text-sm text-cyan-200 mt-2">
                    <span>安全</span>
                    <span>創造的</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-cyan-100 font-medium mb-3">品質: {qualityLevel}%</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={qualityLevel}
                    onChange={(e) => setQualityLevel(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider" 
                  />
                  <div className="flex justify-between text-sm text-cyan-200 mt-2">
                    <span>高速</span>
                    <span>最高品質</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 結果表示エリア */}
          <div className="lg:col-span-8">
            <div className="grid gap-8">
              {/* 画像結果 */}
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 relative overflow-hidden group hover:translate-y-[-2px] hover:scale-[1.02]">
                {/* ガラス反射効果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {/* グロー効果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-400/5 to-teal-400/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <h3 className="text-cyan-100 font-semibold mb-6 flex items-center text-xl relative z-10">
                  <Image className="w-6 h-6 mr-3 drop-shadow-lg" />
                  生成画像
                </h3>
                
                <div className="aspect-square bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center relative z-10 hover:scale-[1.02] transition-all duration-300">
                  {generatedImage ? (
                    <div className="relative w-full h-full">
                      <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <div className="text-center text-white">
                          <div className="text-lg font-medium">{generatedImage.metadata?.prompt?.slice(0, 50)}...</div>
                          <div className="text-sm opacity-75 mt-2">
                            {generatedImage.metadata?.style} • {generatedImage.metadata?.size}
                          </div>
                          <div className="text-xs opacity-50 mt-1">
                            生成時間: {generatedImage.metadata?.generationTime ? (generatedImage.metadata.generationTime / 1000).toFixed(1) : 'N/A'}秒
                          </div>
                          <div className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-lg">
                            <div className="text-center">
                              <div className="text-cyan-100 text-sm font-bold mb-1">🔬 AI技術実装中</div>
                              <div className="text-cyan-200/80 text-xs">UI/UXデモンストレーション</div>
                            </div>
                          </div>
                          <div className="mt-3 px-4 py-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-400/30 rounded-full">
                            <span className="text-teal-200 text-xs font-medium">🚀 完全版は近日公開予定</span>
                          </div>
                        </div>
                      </div>
                      <button className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-xl hover:bg-white/30 rounded-xl transition-all duration-300 border border-white/20">
                        <Download className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="w-20 h-20 text-cyan-300 mx-auto mb-6" />
                      <p className="text-cyan-200 text-lg mb-4">画像がここに表示されます</p>
                      <div className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-lg">
                        <div className="text-center">
                          <div className="text-cyan-100 text-sm font-bold mb-1">🔬 AI技術実装中</div>
                          <div className="text-cyan-200/80 text-xs">UI/UXデモンストレーション</div>
                        </div>
                      </div>
                      <div className="mt-3 px-4 py-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-400/30 rounded-full inline-block">
                        <span className="text-teal-200 text-xs font-medium">🚀 完全版は近日公開予定</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 音楽プレイヤー */}
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 relative overflow-hidden group hover:translate-y-[-2px] hover:scale-[1.02]">
                {/* ガラス反射効果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {/* グロー効果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-400/5 to-teal-400/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <h3 className="text-cyan-100 font-semibold mb-6 flex items-center text-xl relative z-10">
                  <Music className="w-6 h-6 mr-3 drop-shadow-lg" />
                  生成音楽
                </h3>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 relative z-10 hover:scale-[1.01] transition-all duration-300">
                  {generatedMusic ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-cyan-100 font-semibold text-lg">{generatedMusic.metadata?.generatedTitle || 'Generated Track'}</h4>
                          <p className="text-cyan-200 text-sm">{generatedMusic.metadata?.genre} • {generatedMusic.metadata?.duration}秒</p>
                          {imageAnalysis && (
                            <p className="text-xs text-cyan-300 mt-1">画像から生成 • {imageAnalysis.mood}ムード</p>
                          )}
                          <div className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-lg">
                            <div className="text-center">
                              <div className="text-cyan-100 text-sm font-bold mb-1">🔬 AI技術実装中</div>
                              <div className="text-cyan-200/80 text-xs">UI/UXデモンストレーション</div>
                            </div>
                          </div>
                          <div className="mt-3 px-4 py-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-400/30 rounded-full inline-block">
                            <span className="text-teal-200 text-xs font-medium">🚀 完全版は近日公開予定</span>
                          </div>
                        </div>
                        <button className="p-3 bg-white/20 backdrop-blur-xl hover:bg-white/30 rounded-xl transition-all duration-300 border border-white/20">
                          <Download className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={togglePlayback}
                          className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 transform hover:scale-105 relative overflow-hidden group"
                        >
                          {/* ガラス反射効果 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                                                      {isPlaying ? (
                              <Pause className="w-6 h-6 text-white relative z-10 drop-shadow-lg" />
                            ) : (
                              <Play className="w-6 h-6 text-white ml-1 relative z-10 drop-shadow-lg" />
                            )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="h-3 bg-white/20 backdrop-blur-sm rounded-full">
                            <div className="w-1/3 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg"></div>
                          </div>
                          <div className="flex justify-between text-sm text-cyan-200 mt-2">
                            <span>0:00</span>
                            <span>{generatedMusic.metadata?.duration || 30}秒</span>
                          </div>
                        </div>
                        
                        <Volume2 className="w-6 h-6 text-cyan-300" />
                      </div>
                      
                      {/* 波形ビジュライザー */}
                      <div className="grid grid-cols-32 gap-2 mt-6">
                        {generatedMusic.waveform?.slice(0, 32).map((amplitude, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-cyan-400/80 to-blue-500/80 rounded-md transition-all duration-300 shadow-lg hover:scale-y-110 hover:shadow-cyan-500/50"
                            style={{
                              height: `${amplitude * 40 + 12}px`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        )) || Array.from({length: 32}, (_, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-cyan-400/80 to-blue-500/80 rounded-md shadow-lg hover:scale-y-110 hover:shadow-cyan-500/50"
                            style={{
                              height: `${Math.random() * 40 + 12}px`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Music className="w-20 h-20 text-cyan-300 mx-auto mb-6" />
                      <p className="text-cyan-200 text-lg mb-4">音楽がここに表示されます</p>
                      <div className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-lg">
                        <div className="text-center">
                          <div className="text-cyan-100 text-sm font-bold mb-1">🔬 AI技術実装中</div>
                          <div className="text-cyan-200/80 text-xs">UI/UXデモンストレーション</div>
                        </div>
                      </div>
                      <div className="mt-3 px-4 py-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-400/30 rounded-full inline-block">
                        <span className="text-teal-200 text-xs font-medium">🚀 完全版は近日公開予定</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* フッター統計 */}
      <footer className="mt-20 bg-white/10 backdrop-blur-2xl border-t border-white/20 relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-cyan-500/10 transition-all duration-500">
              <div className="text-3xl font-bold text-cyan-100 mb-2">
                {generatedImage ? '1' : '0'}
              </div>
              <div className="text-cyan-200 text-sm font-medium">デモ画像数</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-cyan-500/10 transition-all duration-500">
              <div className="text-3xl font-bold text-cyan-100 mb-2">
                {generatedMusic ? '1' : '0'}
              </div>
              <div className="text-cyan-200 text-sm font-medium">デモ音楽数</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-cyan-500/10 transition-all duration-500">
              <div className="text-3xl font-bold text-cyan-100 mb-2">
                {isGenerating ? 'デモ中' : '待機中'}
              </div>
              <div className="text-cyan-200 text-sm font-medium">システム状態</div>
            </div>
            <div className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 border border-cyan-400/30 shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-100 mb-2">✨</div>
                <div className="text-cyan-100 text-lg font-bold mb-1">技術プレビュー版</div>
                <div className="text-cyan-200/80 text-sm">AI技術実装中</div>
              </div>
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
        className="fixed bottom-8 right-8 w-18 h-18 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-110 z-40 backdrop-blur-xl border border-white/20 relative overflow-hidden group"
        aria-label="フィードバックを送信"
      >
        {/* ガラス反射効果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
        {/* グロー効果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
        <div className="relative z-10">
          <span className="text-3xl drop-shadow-lg">💬</span>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-pulse shadow-lg"></div>
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