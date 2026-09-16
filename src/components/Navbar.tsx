'use client';

import React from 'react';
import { Target, Trophy, LogOut, Sparkles, User } from 'lucide-react';
import { StudentStats } from '@/types';

interface NavbarProps {
  stats: StudentStats;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  userName = '高校生 ユーザー',
  userEmail = 'student@school.ed.jp',
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* ロゴ */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Target className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                面接対策室
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                就職・進学応援
              </span>
            </div>
          </div>
        </div>

        {/* 右側：ミニ統計＆ユーザープロファイル */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
              <Trophy className="w-4 h-4" />
              <span>Lv.{stats.currentLevel}</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-1 text-xs text-slate-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{stats.rankBadge} {stats.totalPoints} / 100 pt</span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-200">{userName}</p>
                <p className="text-[10px] text-slate-400">{userEmail}</p>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="ログアウト"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
