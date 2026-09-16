'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Download, X, Sparkles, Award, Heart, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Level100CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  clearedDate?: string;
}

export const Level100CelebrationModal: React.FC<Level100CelebrationModalProps> = ({
  isOpen,
  onClose,
  studentName = '山田 太郎',
  clearedDate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const displayDate = clearedDate
    ? new Date(clearedDate).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  // レベル100達成時の豪華な紙ふぶき＆花火エフェクト
  useEffect(() => {
    if (!isOpen) return;

    // 豪華なコンフェッティループ
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#ec4899', '#6366f1', '#10b981'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#3b82f6', '#8b5cf6', '#f43f5e', '#fbbf24'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen]);

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // HTML5 Canvas を使用して高解像度「面接練習頑張ったで賞」賞状画像をレンダリング＆ダウンロード
  const handleDownloadCertificate = () => {
    setIsGenerating(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // 1. 背景グラデーション (ゴールドプレミアム)
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 850);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(0.5, '#1e1b4b');
    bgGradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 850);

    // 2. 二重枠線 (金色の飾り枠)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, 1120, 770);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.strokeRect(56, 56, 1088, 738);

    // 四隅の飾り模様
    drawCornerDecoration(ctx, 60, 60);
    drawCornerDecoration(ctx, 1140, 60);
    drawCornerDecoration(ctx, 60, 790);
    drawCornerDecoration(ctx, 1140, 790);

    // 3. タイトル「表彰状」
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 54px "Hiragino Mincho ProN", "Yu Mincho", serif';
    ctx.textAlign = 'center';
    ctx.fillText('表　彰　状', 600, 150);

    // 4. 賞名「面接練習頑張ったで賞」
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'extrabold 46px sans-serif';
    ctx.fillText('【 面接練習頑張ったで賞 】', 600, 230);

    // 5. 生徒氏名
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText(`${studentName} 殿`, 600, 320);

    // 6. 本文（指定メッセージ）
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '28px sans-serif';
    ctx.fillText('あなたは面接対策室にて日々熱心に練習を重ね、', 600, 410);
    ctx.fillText('見事 Level 100（就職・進学面接GOサイン）を達成いたしました。', 600, 460);

    // 指定メッセージ（強調）
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('今までの面接練習お疲れ様でした。', 600, 540);
    ctx.fillText('自信を持って挑戦してください。', 600, 590);

    // 7. 日付と発行元
    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`授与日: ${displayDate}`, 120, 710);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('５２HR担任　佐々木一成', 1080, 710);

    // 8. 判定ハンコ（ゴールドの認定シール）
    ctx.save();
    ctx.beginPath();
    ctx.arc(1040, 610, 55, 0, Math.PI * 2);
    ctx.fillStyle = '#d97706';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('面接合格', 1040, 605);
    ctx.fillText('GOサイン', 1040, 630);
    ctx.restore();

    // 画像のダウンロード処理
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `面接練習頑張ったで賞_${studentName.replace(/\s+/g, '')}.png`;
    link.href = dataUrl;
    link.click();
    setIsGenerating(false);
  };

  function drawCornerDecoration(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          {/* 背景のアニメーション・オーラ */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-10 shadow-2xl text-white relative z-10 text-center space-y-6 my-8"
          >
            {/* 閉じるボタン */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 王冠トロフィーバッジ */}
            <div className="inline-flex relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-2xl shadow-amber-500/50 flex items-center justify-center animate-bounce">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-amber-400" />
                </div>
              </div>
              <Sparkles className="w-8 h-8 text-amber-300 absolute -top-3 -right-3 animate-spin" />
            </div>

            {/* お祝いヘッダー */}
            <div className="space-y-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/40 uppercase tracking-widest">
                🎉 LEVEL 100 CLEARED! 就職・進学面接 GOサイン獲得 🎉
              </span>
              <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                【 面接練習頑張ったで賞 】
              </h1>
              <p className="text-sm sm:text-base font-bold text-slate-200">
                授与: <span className="text-amber-300 text-lg">{studentName} 殿</span>
              </p>
            </div>

            {/* 指定メッセージカード */}
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-amber-500/40 space-y-3 shadow-inner">
              <p className="text-base sm:text-lg font-extrabold text-indigo-300 leading-relaxed">
                今までの面接練習お疲れ様でした。
                <br />
                自信を持って挑戦してください。
              </p>
              <p className="text-xs text-slate-400">
                面接質問への回答、オリジナルの作成、教員との面接練習をすべて乗り越え、面接本番への準備がバッチリ整いました！
              </p>
            </div>

            {/* 賞状のビジュアルプレビューカード */}
            <div className="border border-amber-500/30 rounded-2xl p-4 bg-gradient-to-r from-amber-950/30 to-indigo-950/30 flex items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">デジタル賞状賞状（画像）</h3>
                  <p className="text-[11px] text-slate-400">「面接練習頑張ったで賞」を画像（PNG）としてダウンロード保存できます。</p>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadCertificate}
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 active:scale-95 transition-all"
              >
                <Download className="w-5 h-5 text-slate-950" />
                <span>【面接練習頑張ったで賞】をダウンロード</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
              >
                ダッシュボードに戻る
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
