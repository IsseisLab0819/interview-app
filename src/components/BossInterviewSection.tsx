'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Award, Lock, CheckCircle2, Sparkles, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentStats } from '@/types';

interface BossInterviewSectionProps {
  stats: StudentStats;
  onClearPrincipalInterview: () => void;
  onClearHomeroomInterview: () => void;
}

export const BossInterviewSection: React.FC<BossInterviewSectionProps> = ({
  stats,
  onClearPrincipalInterview,
  onClearHomeroomInterview,
}) => {
  const handlePrincipalClick = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#6366f1'],
      });
    } catch {
      // safe fallback
    }
    onClearPrincipalInterview();
  };

  const handleHomeroomClick = () => {
    try {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#10b981', '#f59e0b', '#6366f1', '#a855f7'],
      });
    } catch {
      // safe fallback
    }
    onClearHomeroomInterview();
  };

  return (
    <div className="space-y-6 my-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
          <Crown className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            特別面接ミッション <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">重要解放判定</span>
          </h2>
          <p className="text-xs text-slate-400">
            ポイントを貯めてアンロック！校長・教頭面接と担任面接をクリアしてLevel 100を目指せ！
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 校長・教頭面接 (Lv.90解放) */}
        <motion.div
          whileHover={{ y: stats.principalInterviewStatus === 'LOCKED' ? 0 : -3 }}
          className={`rounded-3xl p-6 border relative overflow-hidden transition-all ${
            stats.principalInterviewStatus === 'CLEARED'
              ? 'bg-slate-900/80 border-emerald-500/40 shadow-emerald-500/10'
              : stats.principalInterviewStatus === 'AVAILABLE'
              ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/60 shadow-xl shadow-amber-500/10'
              : 'bg-slate-950/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                【Lv.90到達で解放】
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-1">
                校長・教頭面接
              </h3>
              <p className="text-xs text-slate-400">
                本番さながらの緊張感！校長・教頭先生との最終模擬面接。
              </p>
            </div>

            <div className="flex-shrink-0">
              {stats.principalInterviewStatus === 'CLEARED' ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : stats.principalInterviewStatus === 'AVAILABLE' ? (
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center animate-bounce">
                  <Award className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-semibold">
              報酬: <strong className="text-amber-400">合格で 95 pt にアップ</strong>
            </span>

            {stats.principalInterviewStatus === 'CLEARED' ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                面接合格（クリア済）
              </span>
            ) : stats.principalInterviewStatus === 'AVAILABLE' ? (
              <button
                onClick={handlePrincipalClick}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>合格を記録 (+95ptへ)</span>
              </button>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Lv.90で解放
              </span>
            )}
          </div>
        </motion.div>

        {/* 担任面接 (Lv.95解放) */}
        <motion.div
          whileHover={{ y: stats.homeroomInterviewStatus === 'LOCKED' ? 0 : -3 }}
          className={`rounded-3xl p-6 border relative overflow-hidden transition-all ${
            stats.homeroomInterviewStatus === 'CLEARED'
              ? 'bg-slate-900/80 border-emerald-500/40 shadow-emerald-500/10'
              : stats.homeroomInterviewStatus === 'AVAILABLE'
              ? 'bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/60 shadow-xl shadow-indigo-500/10'
              : 'bg-slate-950/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                【Lv.95到達で解放】
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-1">
                担任面接（最終確認）
              </h3>
              <p className="text-xs text-slate-400">
                担任の先生と最終確認！これで面接本番へのGOサインを獲得。
              </p>
            </div>

            <div className="flex-shrink-0">
              {stats.homeroomInterviewStatus === 'CLEARED' ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : stats.homeroomInterviewStatus === 'AVAILABLE' ? (
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center animate-bounce">
                  <ShieldAlert className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-semibold">
              報酬: <strong className="text-indigo-400">合格で Lv.100 (CLEAR!)</strong>
            </span>

            {stats.homeroomInterviewStatus === 'CLEARED' ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                GOサイン獲得！（CLEAR）
              </span>
            ) : stats.homeroomInterviewStatus === 'AVAILABLE' ? (
              <button
                onClick={handleHomeroomClick}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>合格を記録 (Lv.100 CLEAR!)</span>
              </button>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Lv.95で解放
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
