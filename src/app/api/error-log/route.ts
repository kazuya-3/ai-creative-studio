// エラーログAPI
import { NextRequest, NextResponse } from 'next/server';
import { ErrorLog } from '@/utils/errorTracking';

interface ErrorLogResponse {
  success: boolean;
  message: string;
  errorId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ErrorLog = await request.json();
    
    // バリデーション
    if (!body.message || !body.context) {
      return NextResponse.json(
        { success: false, message: 'エラーメッセージとコンテキストが必要です' },
        { status: 400 }
      );
    }

    // エラーID生成
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // エラーログデータの構造化
    const errorLogData = {
      id: errorId,
      message: body.message,
      stack: body.stack,
      context: body.context,
      url: body.url,
      userAgent: body.userAgent,
      timestamp: body.timestamp,
      sessionId: body.sessionId,
      userId: body.userId,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userCountry: request.headers.get('x-vercel-ip-country') || 'unknown',
      userCity: request.headers.get('x-vercel-ip-city') || 'unknown',
    };

    // 実際の実装では、データベースに保存
    // 現在はコンソールに出力（開発用）
    console.log('🚨 エラーログ受信:', errorLogData);

    // 重大なエラーの場合、開発チームに通知
    if (isCriticalError(body.message, body.context)) {
      console.log('🔥 重大エラー検出:', {
        message: body.message,
        context: body.context,
        url: body.url,
        timestamp: body.timestamp,
      });
    }

    // エラー統計の更新
    updateErrorStats(body.context, body.message);

    const response: ErrorLogResponse = {
      success: true,
      message: 'エラーログを記録しました',
      errorId,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('エラーログAPI エラー:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'エラーログの記録に失敗しました' 
      },
      { status: 500 }
    );
  }
}

// 重大エラーの判定
function isCriticalError(message: string, context: string): boolean {
  const criticalKeywords = [
    'crash', 'fatal', 'unhandled', 'network', 'database', 'auth', 'payment'
  ];
  
  const criticalContexts = [
    'api_error', 'unhandled_error', 'react_error_boundary'
  ];

  const messageLower = message.toLowerCase();
  const contextLower = context.toLowerCase();

  return criticalKeywords.some(keyword => messageLower.includes(keyword)) ||
         criticalContexts.some(ctx => contextLower.includes(ctx));
}

// エラー統計の更新（モック実装）
function updateErrorStats(context: string, message: string) {
  // 実際の実装では、データベースで統計を管理
  const stats = {
    totalErrors: 0,
    errorsByContext: {},
    errorsByHour: {},
    criticalErrors: 0,
  };

  console.log('📊 エラー統計更新:', {
    context,
    message: message.substring(0, 100) + '...',
    currentStats: stats,
  });
}

// エラー統計取得API（オプション）
export async function GET() {
  try {
    // 実際の実装では、データベースから統計を取得
    const stats = {
      totalErrors: 0,
      errorsByContext: {},
      errorsByHour: {},
      criticalErrors: 0,
      recentErrors: []
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('エラー統計取得エラー:', error);
    
    return NextResponse.json(
      { success: false, message: '統計の取得に失敗しました' },
      { status: 500 }
    );
  }
}
