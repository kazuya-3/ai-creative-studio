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

// 画像生成イベント追跡
export const trackImageGeneration = (
  prompt: string,
  style: string,
  size: string,
  creativityLevel: number,
  qualityLevel: number,
  generationTime?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'image_generation', {
      event_category: 'ai_creative',
      event_label: 'image_generation',
      value: 1,
      custom_parameters: {
        prompt_length: prompt.length,
        prompt_preview: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
        style: style,
        size: size,
        creativity_level: creativityLevel,
        quality_level: qualityLevel,
        generation_time_ms: generationTime || 0,
        model: 'KaggleAI-StableDiffusion-v2',
        timestamp: new Date().toISOString(),
      },
    });
  }
};

// 音楽生成イベント追跡
export const trackMusicGeneration = (
  prompt: string,
  genre: string,
  duration: number,
  tempo: number,
  mood: string,
  generationTime?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'music_generation', {
      event_category: 'ai_creative',
      event_label: 'music_generation',
      value: 1,
      custom_parameters: {
        prompt_length: prompt.length,
        prompt_preview: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
        genre: genre,
        duration_seconds: duration,
        tempo_bpm: tempo,
        mood: mood,
        generation_time_ms: generationTime || 0,
        model: 'KaggleAI-MusicGen-v1',
        timestamp: new Date().toISOString(),
      },
    });
  }
};

// 画像→音楽変換イベント追跡
export const trackImageToMusicConversion = (
  imageUrl: string,
  genre: string,
  duration: number,
  intensity: number,
  imageAnalysis?: {
    dominantColors: string[];
    mood: string;
    brightness: number;
    complexity: number;
    emotions: string[];
  },
  generationTime?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'image_to_music_conversion', {
      event_category: 'ai_creative',
      event_label: 'image_to_music_conversion',
      value: 1,
      custom_parameters: {
        image_url: imageUrl,
        genre: genre,
        duration_seconds: duration,
        intensity_level: intensity,
        image_mood: imageAnalysis?.mood || 'unknown',
        image_brightness: imageAnalysis?.brightness || 0,
        image_complexity: imageAnalysis?.complexity || 0,
        dominant_colors_count: imageAnalysis?.dominantColors?.length || 0,
        emotions: imageAnalysis?.emotions?.join(', ') || 'none',
        generation_time_ms: generationTime || 0,
        model: 'KaggleAI-Image2Music-v1',
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
