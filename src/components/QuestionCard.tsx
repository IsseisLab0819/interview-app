'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, HelpCircle, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestionItem } from '@/types';

interface QuestionCardProps {
  question: QuestionItem;
  onComplete: (question: QuestionItem) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCompleteClick = () => {
    if (question.isCompleted || isSubmitting) return;

    setIsSubmitting(true);

    // 紙ふぶきエフェクト
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#a855f7', '#f59e0b', '#10b981'],
      });
    } catch {
      // 画面環境によりconfettiがスキップされてもOK
    }

    onComplete(question);
    setIsSubmitting(false);
  };

  const isMotivation = question.category === 'motivation';
  const isCustom = question.category === 'custom';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl p-5 transition-all border ${
        question.isCompleted
          ? 'bg-slate-900/60 border-emerald-500/30 text-slate-300 opacity-90'
          : isMotivation
          ? 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
          : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/30'
      }`}
    >
      {/* 志望理由強調リボン */}
      {isMotivation && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-indigo-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-md">
          <Star className="w-3 h-3 fill-white" /> 重点必須 (+10 pt)
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* 左側：質問カテゴリ・タイトル */}
        <div className="space-y-1.5 flex-1 pr-6">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                isMotivation
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : isCustom
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {isMotivation ? '志望理由' : isCustom ? 'オリジナル質問' : '基本質問'}
            </span>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
              +{question.points} pt
            </span>
          </div>

          <h3 className="text-base font-bold text-white flex items-center gap-2">
            {question.title}
          </h3>

          {question.description && (
            <p className="text-xs text-slate-400 flex items-start gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>{question.description}</span>
            </p>
          )}
        </div>

        {/* 右側：「できた！」ボタン or クリアバッジ */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          {question.isCompleted ? (
            <div className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>言えた！（達成済）</span>
            </div>
          ) : (
            <button
              onClick={handleCompleteClick}
              disabled={isSubmitting}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md active:scale-95 ${
                isMotivation
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-indigo-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>言えた！ (+{question.points}pt)</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
