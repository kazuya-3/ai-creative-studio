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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        {!isSubmitted ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                💬 フィードバック
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 評価 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  AI Creative Studioの評価をお聞かせください
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-transform hover:scale-110 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                <div className="text-center mt-2 text-sm text-gray-500">
                  {rating > 0 && (
                    <span>
                      {rating === 1 && '改善が必要'}
                      {rating === 2 && 'やや不満'}
                      {rating === 3 && '普通'}
                      {rating === 4 && '良い'}
                      {rating === 5 && '素晴らしい'}
                    </span>
                  )}
                </div>
              </div>

              {/* コメント */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  コメント（任意）
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="ご意見・ご要望をお聞かせください..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {comment.length}/500
                </div>
              </div>

              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス（任意）
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  改善点について詳しくお聞きする場合のみ使用します
                </p>
              </div>

              {/* 送信ボタン */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? '送信中...' : '送信'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ありがとうございます！
            </h3>
            <p className="text-gray-600">
              フィードバックを送信しました。
              <br />
              AI Creative Studioの改善に活用させていただきます。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
