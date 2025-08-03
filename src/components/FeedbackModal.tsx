'use client';

import React, { useState } from 'react';
import { trackFeedback } from '@/utils/analytics';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('評価を選択してください');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          email: email.trim(),
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });

      if (response.ok) {
        // GA4にフィードバックイベントを送信
        trackFeedback(rating, comment.trim().length > 0);
        
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
          setRating(0);
          setComment('');
          setEmail('');
        }, 2000);
      } else {
        throw new Error('フィードバックの送信に失敗しました');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('フィードバックの送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/20">
        {!isSubmitted ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                💬 フィードバック
              </h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 評価 */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4 text-center">
                  AI Creative Studioの評価をお聞かせください
                </label>
                <div className="flex justify-center space-x-3 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-4xl transition-all duration-300 hover:scale-125 ${
                        star <= rating 
                          ? 'text-yellow-400 drop-shadow-lg' 
                          : 'text-white/30 hover:text-white/60'
                      }`}
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                <div className="text-center text-white/80 font-medium">
                  {rating > 0 && (
                    <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                      {rating === 1 && '😞 改善が必要'}
                      {rating === 2 && '😐 やや不満'}
                      {rating === 3 && '😊 普通'}
                      {rating === 4 && '😄 良い'}
                      {rating === 5 && '🤩 素晴らしい'}
                    </span>
                  )}
                </div>
              </div>

              {/* コメント */}
              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  コメント（任意）
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="ご意見・ご要望をお聞かせください..."
                  className="w-full h-28 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all"
                  maxLength={500}
                />
                <div className="text-right text-sm text-white/60 mt-2">
                  {comment.length}/500
                </div>
              </div>

              {/* メールアドレス */}
              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  メールアドレス（任意）
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                />
                <p className="text-sm text-white/60 mt-2">
                  改善点について詳しくお聞きする場合のみ使用します
                </p>
              </div>

              {/* 送信ボタン */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 text-white/80 border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      送信中...
                    </div>
                  ) : (
                    '送信'
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              ありがとうございます！
            </h3>
            <p className="text-white/80 text-lg leading-relaxed">
              フィードバックを送信しました。
              <br />
              <span className="text-purple-300">AI Creative Studio</span>の改善に活用させていただきます。
            </p>
            <div className="mt-6">
              <div className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <span className="text-white/80">✨ より良い体験をお届けします ✨</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
