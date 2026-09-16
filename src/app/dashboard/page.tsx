'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { LevelHeader } from '@/components/LevelHeader';
import { QuestionCard } from '@/components/QuestionCard';
import { AddQuestionModal } from '@/components/AddQuestionModal';
import { TeacherInterviewCard } from '@/components/TeacherInterviewCard';
import { BossInterviewSection } from '@/components/BossInterviewSection';
import { Level100CelebrationModal } from '@/components/Level100CelebrationModal';
import { DEFAULT_QUESTIONS, calculateStudentStats } from '@/lib/mock-db';
import { ActionRecord, QuestionItem } from '@/types';
import { PlusCircle, ListFilter, RefreshCw, Trophy, History, Clock } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  // ユーザー状態（ログイン情報から動的復元）
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: '生徒ユーザー',
    email: 'student@school.ed.jp',
  });

  // 状態管理
  const [questions, setQuestions] = useState<QuestionItem[]>(DEFAULT_QUESTIONS);
  const [actions, setActions] = useState<ActionRecord[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [hasAutoCelebrated, setHasAutoCelebrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'motivation' | 'basic' | 'custom'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // メールアドレスをキー名用に安全化する関数
  const getEmailKey = (email: string) => (email ? email.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '_') : 'default');

  // アクション履歴に基づき質問リストの達成状態とオリジナル質問を動的復元
  const syncQuestionsWithActions = (actionRecords: ActionRecord[], baseQuestions: QuestionItem[]) => {
    const completedDetails = new Set(actionRecords.map((a) => (a.questionDetail || '').trim()));

    // 標準質問の達成フラグを同期
    const updated = baseQuestions.map((q) => {
      if (completedDetails.has(q.title.trim())) {
        return { ...q, isCompleted: true };
      }
      return q;
    });

    // オリジナル質問の復元
    const customActions = actionRecords.filter((a) => a.actionType === 'オリジナル質問');
    const existingCustomTitles = new Set(updated.filter((q) => q.category === 'custom').map((q) => q.title.trim()));

    for (const cAct of customActions) {
      const title = (cAct.questionDetail || '').trim();
      if (title && !existingCustomTitles.has(title)) {
        updated.push({
          id: `q-custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          category: 'custom',
          title,
          points: cAct.pointsEarned || 3,
          isCompleted: true,
          completedAt: cAct.timestamp,
        });
        existingCustomTitles.add(title);
      }
    }

    return updated;
  };

  // 初回読み込み（ユーザー固有データのアカウント別分離＆APIからの完全復元）
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('interview_taisaku_current_user');
      let currentUser = user;
      if (savedUserStr) {
        currentUser = JSON.parse(savedUserStr);
        setUser(currentUser);
      }

      const emailKey = getEmailKey(currentUser.email);
      const userActionsKey = `interview_taisaku_actions_${emailKey}`;
      const userQuestionsKey = `interview_taisaku_questions_${emailKey}`;

      const savedActionsStr = localStorage.getItem(userActionsKey);
      const savedQuestionsStr = localStorage.getItem(userQuestionsKey);

      let loadedActions: ActionRecord[] = savedActionsStr ? JSON.parse(savedActionsStr) : [];
      let loadedQuestions: QuestionItem[] = savedQuestionsStr ? JSON.parse(savedQuestionsStr) : DEFAULT_QUESTIONS;

      if (loadedActions.length > 0) {
        setActions(loadedActions);
        setQuestions(syncQuestionsWithActions(loadedActions, loadedQuestions));
      } else {
        setActions([]);
        setQuestions(DEFAULT_QUESTIONS);
      }

      // Google Sheets API からこの生徒の全記録を取得して同期・復元
      if (currentUser.email) {
        fetch(`/api/actions?email=${encodeURIComponent(currentUser.email)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.records && Array.isArray(data.records) && data.records.length > 0) {
              setActions(data.records);
              const syncedQuestions = syncQuestionsWithActions(data.records, loadedQuestions);
              setQuestions(syncedQuestions);
              localStorage.setItem(userActionsKey, JSON.stringify(data.records));
              localStorage.setItem(userQuestionsKey, JSON.stringify(syncedQuestions));
            }
          })
          .catch((err) => console.warn('API sync check:', err));
      }
    } catch {
      // safe fallback
    }
  }, []);

  // ユーザー固有キーへ状態を保存
  const saveState = (updatedActions: ActionRecord[], updatedQuestions: QuestionItem[]) => {
    setActions(updatedActions);
    setQuestions(updatedQuestions);
    try {
      const emailKey = getEmailKey(user.email);
      localStorage.setItem(`interview_taisaku_actions_${emailKey}`, JSON.stringify(updatedActions));
      localStorage.setItem(`interview_taisaku_questions_${emailKey}`, JSON.stringify(updatedQuestions));
    } catch {
      // safe fallback
    }
  };

  // レベル・ポイント計算
  const stats = useMemo(() => calculateStudentStats(actions), [actions]);

  // Level 100 に到達したときに自動的に全画面お祝いモーダルをポップアップ
  useEffect(() => {
    if (stats.currentLevel >= 100 && !hasAutoCelebrated) {
      setIsCelebrationOpen(true);
      setHasAutoCelebrated(true);
    }
  }, [stats.currentLevel, hasAutoCelebrated]);

  // 教員面接の練習回数算出
  const teacherPracticeCount = useMemo(() => {
    return actions.filter((a) => a.actionType === '教員面接').length;
  }, [actions]);

  // アクションをAPI & ローカルに記録する共通関数
  const recordAction = async (
    actionType: ActionRecord['actionType'],
    questionDetail: string,
    pointsEarned: number,
    updatedQuestions?: QuestionItem[]
  ) => {
    setIsLoading(true);

    const newRecord: ActionRecord = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userName: user.name,
      actionType,
      questionDetail,
      pointsEarned,
    };

    const newActions = [...actions, newRecord];
    const newQuestions = updatedQuestions || questions;

    saveState(newActions, newQuestions);

    // API経由で Google Sheets に追記
    try {
      await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
    } catch (e) {
      console.warn('API sync deferred:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // 「できた！」自己申告処理
  const handleCompleteQuestion = (q: QuestionItem) => {
    const updatedQuestions = questions.map((item) =>
      item.id === q.id ? { ...item, isCompleted: true, completedAt: new Date().toISOString() } : item
    );

    const actionType = q.category === 'custom' ? 'オリジナル質問' : '自己申告';
    recordAction(actionType, q.title, q.points, updatedQuestions);
  };

  // オリジナル質問の追加（末尾に追加）
  const handleAddCustomQuestion = (title: string, description: string) => {
    const newQ: QuestionItem = {
      id: `q-custom-${Date.now()}`,
      category: 'custom',
      title,
      description,
      points: 3,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    };

    const updatedQuestions = [...questions, newQ];
    recordAction('オリジナル質問', title, 3, updatedQuestions);
  };

  // 担当教員面接記録
  const handleRecordTeacherPractice = (teacherName: string, notes: string) => {
    const detail = `${teacherName} 先生との練習 ${notes ? `(${notes})` : ''}`;
    recordAction('教員面接', detail, 5);
  };

  // 校長面接クリア
  const handleClearPrincipalInterview = () => {
    recordAction('校長面接', '校長・教頭面接 合格判定', 95);
  };

  // 担任面接クリア
  const handleClearHomeroomInterview = () => {
    recordAction('担任面接', '担任面接 最終確認クリア（GOサイン）', 100);
  };

  // ログアウト処理（端末からアカウントセッションを消去）
  const handleLogout = () => {
    try {
      localStorage.removeItem('interview_taisaku_current_user');
    } catch {
      // safe fallback
    }
    router.push('/login');
  };

  // ユーザー固有データのリセット
  const handleReset = () => {
    if (confirm(`${user.name} さんの練習データを初期化しますか？`)) {
      const emailKey = getEmailKey(user.email);
      localStorage.removeItem(`interview_taisaku_actions_${emailKey}`);
      localStorage.removeItem(`interview_taisaku_questions_${emailKey}`);
      setQuestions(DEFAULT_QUESTIONS);
      setActions([]);
    }
  };

  // 質問リストの並び順制御
  const sortedAndFilteredQuestions = useMemo(() => {
    const standardQuestions = questions.filter((q) => q.category !== 'custom');
    const customQuestions = questions.filter((q) => q.category === 'custom');
    const combined = [...standardQuestions, ...customQuestions];

    if (activeTab === 'all') return combined;
    return combined.filter((q) => q.category === activeTab);
  }, [questions, activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* ナビゲーション */}
      <Navbar
        stats={stats}
        userName={user.name}
        userEmail={user.email}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* レベル・ポイント・ランクヘッダー */}
        <LevelHeader
          stats={stats}
          onOpenCelebration={() => setIsCelebrationOpen(true)}
        />

        {/* 担当教員との面接練習セクション */}
        <div className="mb-10">
          <TeacherInterviewCard
            onRecordPractice={handleRecordTeacherPractice}
            practiceCount={teacherPracticeCount}
          />
        </div>

        {/* ボス面接（校長・教頭面接 & 担任面接）セクション */}
        <BossInterviewSection
          stats={stats}
          onClearPrincipalInterview={handleClearPrincipalInterview}
          onClearHomeroomInterview={handleClearHomeroomInterview}
        />

        {/* 質問リスト ＆ アクションエリア */}
        <div className="space-y-6 my-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                面接質問・自己申告リスト
              </h2>
              <p className="text-xs text-slate-400">
                質問に答える練習を行い、「言えた！」ボタンを押してポイントをGET！追加した質問は一番下に記録されます。
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>自分で質問を追加 (+3pt)</span>
              </button>
            </div>
          </div>

          {/* タブ切り替え */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>すべて ({questions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('motivation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'motivation'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>⭐ 志望理由 (+10pt)</span>
            </button>

            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'basic'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>基本質問 (+3pt)</span>
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'custom'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>オリジナル質問 ({questions.filter((q) => q.category === 'custom').length})</span>
            </button>
          </div>

          {/* 質問カード一覧 */}
          <div className="grid grid-cols-1 gap-4">
            {sortedAndFilteredQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                onComplete={handleCompleteQuestion}
              />
            ))}
          </div>
        </div>

        {/* 練習アクティビティ履歴 */}
        {actions.length > 0 && (
          <div className="my-10 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                {user.name} さんの練習記録アクティビティ
              </h3>
            </div>
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2">
              {actions.map((act, index) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[10px]">#{index + 1}</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                      {act.actionType}
                    </span>
                    <span className="text-slate-200 font-medium">{act.questionDetail}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="text-amber-400 font-bold">+{act.pointsEarned} pt</span>
                    <span className="text-[10px] flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 履歴・フッター領域 */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-indigo-400" />
            <span>高校生 面接練習 ゲーミフィケーション「面接対策室」</span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{user.name} さんのデータを初期化</span>
          </button>
        </div>
      </main>

      {/* オリジナル質問追加モーダル */}
      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCustomQuestion}
      />

      {/* Level 100 お祝い全画面モーダル & 賞状ダウンロード */}
      <Level100CelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        studentName={user.name}
      />
    </div>
  );
}
