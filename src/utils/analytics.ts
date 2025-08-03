// Google Analytics 4 イベント追跡
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// GA4初期化
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
    page_title: 'AI Creative Studio',
    page_location: window.location.href,
  });
};

// ページビュー追跡
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

// イベント追跡
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// AI生成イベント追跡
export const trackAIGeneration = (
  type: 'image' | 'music' | 'convert',
  prompt: string,
  style?: string,
  genre?: string
) => {
  trackEvent('ai_generation', 'ai_creative', type, 1);
  
  // 詳細情報をカスタムイベントで送信
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ai_generation_detail', {
      event_category: 'ai_creative',
      event_label: type,
      custom_parameters: {
        prompt_length: prompt.length,
        style: style || 'none',
        genre: genre || 'none',
        timestamp: new Date().toISOString(),
      },
    });
  }
};

// フィードバックイベント追跡
export const trackFeedback = (rating: number, hasComment: boolean) => {
  trackEvent('feedback_submitted', 'user_feedback', `rating_${rating}`, rating);
  
  if (hasComment) {
    trackEvent('feedback_with_comment', 'user_feedback', 'with_comment', 1);
  }
};

// エラーイベント追跡
export const trackError = (error: string, context: string) => {
  trackEvent('error_occurred', 'error_tracking', context, 1);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'error_detail', {
      event_category: 'error_tracking',
      event_label: context,
      custom_parameters: {
        error_message: error,
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

// ユーザーエンゲージメント追跡
export const trackEngagement = (action: string, value?: number) => {
  trackEvent(action, 'user_engagement', 'ai_creative_studio', value);
};
