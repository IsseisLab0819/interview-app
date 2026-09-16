'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Lock, CheckCircle2, Flame, Sparkles, ShieldCheck } from 'lucide-react';
import { StudentStats } from '@/types';

interface LevelHeaderProps {
  stats: StudentStats;
  onOpenCelebration?: () => void;
}

export const LevelHeader: React.FC<LevelHeaderProps> = ({ stats, onOpenCelebration }) => {
  const { totalPoints, currentLevel, rankTitle, rankBadge } = stats;
  const progressPercent = Math.min(100, Math.max(0, totalPoints));

  // 目標計算
  let nextGoalText = '';
  if (totalPoints < 90) {
    nextGoalText = `Lv.90（校長・教頭面接 解放）まで あと ${90 - totalPoints} pt!`;
  } else if (totalPoints < 95) {
    nextGoalText = `Lv.95（担任面接 解放）まで あと ${95 - totalPoints} pt!`;
  } else if (totalPoints < 100) {
    nextGoalText = `Lv.100（GOサインCLEAR!）まで あと ${100 - totalPoints} pt!`;
  } else {
    nextGoalText = '🎉 🎉 祝！面接GOサイン獲得完了！面接本番もバッチリ！';
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-2xl text-white mb-8">
      {/* 背景のグローエフェクト */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Level 100 達成時の賞状ボタンリボン */}
      {totalPoints >= 100 && onOpenCelebration && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={onOpenCelebration}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 active:scale-95 transition-all animate-bounce"
          >
            <Trophy className="w-4 h-4 text-slate-950" />
            <span>🏆【面接練習頑張ったで賞】を表示・ダウンロード</span>
          </button>
        </div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* 左側：レベル数＆バッジ */}
        <div className="flex items-center gap-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex-shrink-0"
          >
            {/* 円形メーター外枠 */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-amber-500 via-purple-500 to-indigo-500 p-1 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="text-3xl md:text-4xl">{rankBadge}</span>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">LEVEL</span>
                <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  {currentLevel}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{rankTitle}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              就職・進学面接 <span className="text-indigo-400">GOサイン</span> チャレンジ
            </h1>
            <p className="text-xs md:text-sm text-slate-300 flex items-center justify-center md:justify-start gap-1">
              <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
              <span>{nextGoalText}</span>
            </p>
          </div>
        </div>

        {/* 右側：マイルストーンステータス */}
        <div className="flex items-center gap-2 md:gap-4 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
          {/* Lv.90 校長面接 */}
          <div className="flex flex-col items-center p-2 rounded-xl min-w-[80px]">
            <span className="text-[10px] text-slate-400 font-bold mb-1">Lv.90 幹部面接</span>
            {stats.principalInterviewStatus === 'CLEARED' ? (
              <span className="flex items-center text-emerald-400 text-xs font-bold gap-1">
                <CheckCircle2 className="w-4 h-4" /> CLEAR
              </span>
            ) : stats.principalInterviewStatus === 'AVAILABLE' ? (
              <span className="flex items-center text-amber-400 text-xs font-bold gap-1 animate-pulse">
                <Award className="w-4 h-4" /> 挑戦可
              </span>
            ) : (
              <span className="flex items-center text-slate-500 text-xs font-medium gap-1">
                <Lock className="w-3.5 h-3.5" /> ロック中
              </span>
            )}
          </div>

          <div className="w-px h-8 bg-slate-800" />

          {/* Lv.95 担任面接 */}
          <div className="flex flex-col items-center p-2 rounded-xl min-w-[80px]">
            <span className="text-[10px] text-slate-400 font-bold mb-1">Lv.95 担任面接</span>
            {stats.homeroomInterviewStatus === 'CLEARED' ? (
              <span className="flex items-center text-emerald-400 text-xs font-bold gap-1">
                <CheckCircle2 className="w-4 h-4" /> CLEAR
              </span>
            ) : stats.homeroomInterviewStatus === 'AVAILABLE' ? (
              <span className="flex items-center text-amber-400 text-xs font-bold gap-1 animate-pulse">
                <Award className="w-4 h-4" /> 挑戦可
              </span>
            ) : (
              <span className="flex items-center text-slate-500 text-xs font-medium gap-1">
                <Lock className="w-3.5 h-3.5" /> ロック中
              </span>
            )}
          </div>

          <div className="w-px h-8 bg-slate-800" />

          {/* Lv.100 GOサイン */}
          <div className="flex flex-col items-center p-2 rounded-xl min-w-[85px]">
            <span className="text-[10px] text-slate-400 font-bold mb-1">Lv.100 GOサイン</span>
            {totalPoints >= 100 ? (
              <span className="flex items-center text-indigo-400 text-xs font-extrabold gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 獲得!
              </span>
            ) : (
              <span className="flex items-center text-slate-500 text-xs font-medium gap-1">
                <Trophy className="w-3.5 h-3.5" /> 100pt目標
              </span>
            )}
          </div>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-300 font-bold">
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-400" /> 現在の面接ポイント
          </span>
          <span className="text-sm font-extrabold text-amber-300">{totalPoints} / 100 pt</span>
        </div>
        <div className="relative w-full h-4 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 shadow-lg shadow-indigo-500/50"
          />
        </div>
      </div>
    </div>
  );
};
