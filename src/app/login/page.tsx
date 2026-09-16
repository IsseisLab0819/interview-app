'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Trophy, ShieldCheck, Sparkles, School, ArrowRight, User, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showDemoInput, setShowDemoInput] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleGoogleLogin = () => {
    // Google OAuth 設定前は直接入力フォームへ案内し、401エラーを防止
    setInfoMessage('氏名・メール/出席番号を入力してログインできます');
    setShowDemoInput(true);
  };

  const handleManualLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) return;

    // 生徒情報を LocalStorage に保存してダッシュボードへ遷移
    const user = {
      name: studentName.trim(),
      email: studentEmail.trim(),
    };
    localStorage.setItem('interview_taisaku_current_user', JSON.stringify(user));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* グロー背景 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10 text-center space-y-8">
        {/* ロゴ */}
        <div className="inline-flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-4">
            <Target className="w-9 h-9 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            面接対策室
          </h1>
          <p className="text-xs text-indigo-300 font-medium mt-1">
            高校生のための就職・進学面接 練習ゲーミフィケーション
          </p>
        </div>

        {/* 説明文 */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-left">
          <div className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
            <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>面接質問に「言えた！」でポイント獲得！</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>先生との練習や自分で追加した質問でLevelアップ</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Level 100到達で校長・担任面接クリア & GOサイン！</span>
          </div>
        </div>

        {/* ログインエリア */}
        {!showDemoInput ? (
          <div className="space-y-3 pt-2">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-98"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>生徒ログイン（氏名・アカウント入力）</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>

            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1 pt-1">
              <School className="w-3.5 h-3.5 text-indigo-400" />
              <span>生徒ごとの氏名・メール/出席番号で個別記録されます</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleManualLoginSubmit} className="space-y-4 pt-2 text-left">
            {infoMessage && (
              <div className="p-3 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{infoMessage}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>生徒氏名（例：山田 太郎）</span>
              </label>
              <input
                type="text"
                required
                placeholder="氏名を入力してください"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>メールアドレスまたは出席番号（例：student123@school.ed.jp）</span>
              </label>
              <input
                type="text"
                required
                placeholder="メールまたは出席番号を入力してください"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all active:scale-98"
              >
                <span>ログインして面接練習を始める</span>
                <ArrowRight className="w-4 h-4 text-indigo-200" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
