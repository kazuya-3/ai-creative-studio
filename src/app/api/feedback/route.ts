// フィードバック収集API
import { NextRequest, NextResponse } from 'next/server';

interface FeedbackRequest {
  rating: number;
  comment: string;
  email: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

interface FeedbackResponse {
  success: boolean;
  message: string;
  feedbackId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json();
    
    // バリデーション
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, message: '評価は1-5の範囲で入力してください' },
        { status: 400 }
      );
    }

    // フィードバックID生成
    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // フィードバックデータの構造化
    const feedbackData = {
      id: feedbackId,
      rating: body.rating,
      comment: body.comment,
      email: body.email,
      timestamp: body.timestamp,
      userAgent: body.userAgent,
      url: body.url,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userCountry: request.headers.get('x-vercel-ip-country') || 'unknown',
      userCity: request.headers.get('x-vercel-ip-city') || 'unknown',
    };

    // 実際の実装では、データベースに保存
    // 現在はコンソールに出力（開発用）
    console.log('📝 フィードバック受信:', {
      ...feedbackData,
      email: body.email ? '[REDACTED]' : 'not provided',
    });

    // フィードバック統計の更新（実際の実装ではデータベースで管理）
    updateFeedbackStats(body.rating);

    // 高評価（4-5）の場合、開発チームに通知
    if (body.rating >= 4) {
      console.log('🌟 高評価フィードバック:', {
        rating: body.rating,
        comment: body.comment,
        url: body.url,
      });
    }

    // 低評価（1-2）の場合、緊急対応が必要
    if (body.rating <= 2) {
      console.log('⚠️ 改善が必要なフィードバック:', {
        rating: body.rating,
        comment: body.comment,
        email: body.email,
        url: body.url,
      });
    }

    const response: FeedbackResponse = {
      success: true,
      message: 'フィードバックを送信しました。ありがとうございます！',
      feedbackId,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('フィードバックAPI エラー:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'フィードバックの送信に失敗しました。もう一度お試しください。' 
      },
      { status: 500 }
    );
  }
}

// フィードバック統計の更新（モック実装）
function updateFeedbackStats(rating: number) {
  // 実際の実装では、データベースで統計を管理
  const stats = {
    totalFeedbacks: 0,
    averageRating: 0,
    ratingDistribution: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    }
  };

  console.log('📊 フィードバック統計更新:', {
    newRating: rating,
    currentStats: stats,
  });
}

// フィードバック統計取得API（オプション）
export async function GET() {
  try {
    // 実際の実装では、データベースから統計を取得
    const stats = {
      totalFeedbacks: 0,
      averageRating: 0,
      ratingDistribution: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      },
      recentFeedbacks: []
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('フィードバック統計取得エラー:', error);
    
    return NextResponse.json(
      { success: false, message: '統計の取得に失敗しました' },
      { status: 500 }
    );
  }
}
