// src/app/api/generate/music/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface MusicGenerationRequest {
  prompt?: string;
  genre: string;
  duration: number;
  tempo: number;
  mood: string;
}

interface MusicGenerationResponse {
  success: boolean;
  musicUrl?: string;
  waveform?: number[];
  error?: string;
  metadata?: {
    genre: string;
    duration: number;
    tempo: number;
    generationTime: number;
    model: string;
    title: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: MusicGenerationRequest = await request.json();
    
    // バリデーション
    if (!body.genre) {
      return NextResponse.json(
        { success: false, error: 'ジャンルが必要です' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Kaggle音楽生成技術をWeb API化
    const generatedMusic = await generateMusicWithKaggleAI({
      prompt: body.prompt || '',
      genre: body.genre,
      duration: body.duration || 30,
      tempo: body.tempo || 120,
      mood: body.mood || 'neutral'
    });

    const generationTime = Date.now() - startTime;

    const response: MusicGenerationResponse = {
      success: true,
      musicUrl: generatedMusic.url,
      waveform: generatedMusic.waveform,
      metadata: {
        genre: body.genre,
        duration: body.duration || 30,
        tempo: body.tempo || 120,
        generationTime,
        model: 'KaggleAI-MusicGen-v1',
        title: generatedMusic.title
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('音楽生成エラー:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '音楽生成中にエラーが発生しました' 
      },
      { status: 500 }
    );
  }
}

// Kaggle音楽生成技術の統合関数
async function generateMusicWithKaggleAI(params: {
  prompt: string;
  genre: string;
  duration: number;
  tempo: number;
  mood: string;
}) {
  // 音楽生成のシミュレーション（実際のKaggle技術に置き換え予定）
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 4000));
  
  // Kaggleで開発した音楽生成処理をここに実装
  // 実装例:
  // 1. ジャンル・ムード分析
  // 2. 音楽構造生成
  // 3. メロディ・リズム生成
  // 4. 音色・エフェクト適用
  
  const musicTitle = generateMusicTitle(params.genre, params.mood);
  const waveform = generateMockWaveform(params.duration);
  
  // モック音楽URL（実際はKaggleで生成した音楽ファイル）
  const mockMusicUrl = generateMockMusicUrl(params);
  
  return {
    url: mockMusicUrl,
    title: musicTitle,
    waveform: waveform,
    duration: params.duration,
    sampleRate: 44100
  };
}

// 音楽タイトル生成
function generateMusicTitle(genre: string, _mood: string): string {
  const genreTitles = {
    ambient: ['Floating Dreams', 'Ethereal Waves', 'Cosmic Silence'],
    electronic: ['Digital Pulse', 'Cyber Rhythm', 'Neon Beats'],
    classical: ['Morning Sonata', 'Peaceful Prelude', 'Gentle Symphony'],
    jazz: ['Midnight Blues', 'Smooth Melody', 'Urban Groove'],
    cinematic: ['Epic Journey', 'Dramatic Theme', 'Heroic March']
  };
  
  const titles = genreTitles[genre as keyof typeof genreTitles] || ['Generated Track'];
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  
  return `${randomTitle} #${Math.floor(Math.random() * 999) + 1}`;
}

// モック波形データ生成（ビジュライザー用）
function generateMockWaveform(duration: number): number[] {
  const sampleCount = duration * 10; // 10サンプル/秒
  const waveform: number[] = [];
  
  for (let i = 0; i < sampleCount; i++) {
    // 音楽らしい波形パターンを生成
    const time = i / sampleCount;
    const amplitude = Math.sin(time * Math.PI * 4) * 0.5 + 0.5;
    const noise = (Math.random() - 0.5) * 0.2;
    waveform.push(Math.max(0.1, Math.min(1, amplitude + noise)));
  }
  
  return waveform;
}

// モック音楽URL生成（開発用）
function generateMockMusicUrl(params: {
  genre: string;
  duration: number;
  tempo: number;
  mood: string;
}): string {
  // 実際はKaggleで生成した音楽ファイルのURL
  // 現在は開発用のプレースホルダー
  return `/api/audio/mock-${params.genre}-${Date.now()}.mp3`;
}