'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles, CheckCircle2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TeacherInterviewCardProps {
  onRecordPractice: (teacherName: string, notes: string) => void;
  practiceCount: number;
}

export const TeacherInterviewCard: React.FC<TeacherInterviewCardProps> = ({
  onRecordPractice,
  practiceCount,
}) => {
  const [teacherName, setTeacherName] = useState('');
  const [notes, setNotes] = useState('');
  const [isOpenForm, setIsOpenForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordPractice(teacherName.trim() || '担当の先生', notes.trim());

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch {
      // safe fallback
    }

    setTeacherName('');
    setNotes('');
    setIsOpenForm(false);
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-indigo-500/30 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">担当教員との面接練習</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                1回につき +5 pt（何回でもOK）
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              進路指導部や学年の先生と練習したらここで記録！繰り返し何回でもポイント獲得できます。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="text-right px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block">累計練習回数</span>
            <span className="text-sm font-extrabold text-blue-400">{practiceCount} 回完了</span>
          </div>

          <button
            onClick={() => setIsOpenForm(!isOpenForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isOpenForm ? 'フォームを閉じる' : '練習実績を記録 (+5pt)'}</span>
          </button>
        </div>
      </div>

      {isOpenForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="mt-6 pt-5 border-t border-slate-800 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">面接を担当してもらった先生の名前</label>
              <input
                type="text"
                placeholder="例：山田先生（進路指導）"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">アドバイス・反省メモ（任意）</label>
              <input
                type="text"
                placeholder="例：声の大きさと結論ファーストを意識するよう指導を受けた"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>記録を送信して +5pt 獲得！</span>
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};
