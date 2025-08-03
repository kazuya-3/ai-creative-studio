// エラー監視システム
import { trackError } from './analytics';

export interface ErrorLog {
  message: string;
  stack?: string;
  context: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

// エラーログをサーバーに送信
export const logError = async (error: Error | string, context: string) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = error instanceof Error ? error.stack : undefined;

  // GA4にエラーを送信
  trackError(errorMessage, context);

  // サーバーにエラーログを送信
  try {
    const errorLog: ErrorLog = {
      message: errorMessage,
      stack: errorStack,
      context,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
    };

    await fetch('/api/error-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorLog),
    });
  } catch (logError) {
    console.error('Error logging failed:', logError);
  }
};

// セッションID生成
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('ai_creative_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('ai_creative_session_id', sessionId);
  }
  return sessionId;
};

// グローバルエラーハンドラー
export const setupGlobalErrorHandler = () => {
  if (typeof window === 'undefined') return;

  // 未処理のPromiseエラー
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, 'unhandled_promise_rejection');
  });

  // 未処理のJavaScriptエラー
  window.addEventListener('error', (event) => {
    logError(event.error || event.message, 'unhandled_error');
  });

  // ネットワークエラー
  window.addEventListener('offline', () => {
    logError('Network connection lost', 'network_offline');
  });

  window.addEventListener('online', () => {
    logError('Network connection restored', 'network_online');
  });
};

// React Error Boundary用のエラーハンドラー
export const handleReactError = (error: Error, errorInfo: any) => {
  logError(error, 'react_error_boundary');
  console.error('React Error Boundary caught an error:', error, errorInfo);
};

// API呼び出しエラーハンドラー
export const handleAPIError = (error: any, endpoint: string) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  logError(errorMessage, `api_error_${endpoint}`);
};

// パフォーマンス監視
export const trackPerformance = (metric: string, value: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance_metric', {
      event_category: 'performance',
      event_label: metric,
      value: Math.round(value),
    });
  }
};
