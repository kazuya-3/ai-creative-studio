// src/app/api/audio/generated/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    // 実際の音楽ファイルを生成（開発用のモック）
    const audioData = generateMockAudioData();
    
    // レスポンスヘッダーを設定
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Content-Length', audioData.length.toString());
    headers.set('Cache-Control', 'public, max-age=3600');
    headers.set('Access-Control-Allow-Origin', '*');
    
    return new NextResponse(audioData, {
      status: 200,
      headers,
    });
    
  } catch (error) {
    console.error('音楽ファイル生成エラー:', error);
    return NextResponse.json(
      { error: '音楽ファイルの生成に失敗しました' },
      { status: 500 }
    );
  }
}

// モック音声データを生成（実際の実装では本物の音声ファイルを生成）
function generateMockAudioData(): Buffer {
  // 簡単な音声データを生成（実際の実装では本物の音声ファイルを生成）
  const sampleRate = 44100;
  const duration = 30; // 30秒
  const samples = sampleRate * duration;
  
  // 簡単な正弦波を生成
  const audioData = new Float32Array(samples);
  const frequency = 440; // A4音
  
  for (let i = 0; i < samples; i++) {
    const time = i / sampleRate;
    audioData[i] = Math.sin(2 * Math.PI * frequency * time) * 0.3;
  }
  
  // Float32ArrayをBufferに変換
  return Buffer.from(audioData.buffer);
} 