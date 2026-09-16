import { ActionRecord, QuestionItem, StudentStats, BossStatus } from '@/types';

// 初期面接質問データ
export const DEFAULT_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-motivation',
    category: 'motivation',
    title: '志望理由',
    description: 'なぜこの高校/大学/企業を選んだのか、自分の言葉でハッキリと伝えられるか？',
    points: 10,
    isCompleted: false,
  },
  {
    id: 'q-basic-1',
    category: 'basic',
    title: '長所と短所',
    description: '自分の強みと、短所を補うために心がけている工夫を具体的に言えるか？',
    points: 3,
    isCompleted: false,
  },
  {
    id: 'q-basic-2',
    category: 'basic',
    title: '高校生活で一番力を入れたこと',
    description: '部活動・学業・行事など、苦労した点とそれを乗り越えた経験を話せるか？',
    points: 3,
    isCompleted: false,
  },
  {
    id: 'q-basic-3',
    category: 'basic',
    title: '将来の夢・卒業後の目標',
    description: '進学先・就職先でどのような学びや貢献をしたいか明確に言えるか？',
    points: 3,
    isCompleted: false,
  },
  {
    id: 'q-basic-4',
    category: 'basic',
    title: '最近気になっているニュース',
    description: '自分の興味のある分野のニュースとそれに対する自分の意見を言えるか？',
    points: 3,
    isCompleted: false,
  },
  {
    id: 'q-basic-5',
    category: 'basic',
    title: '自己PR（1分間）',
    description: '自分の魅力を1分間で自信を持ってアピールできるか？',
    points: 3,
    isCompleted: false,
  },
];

/**
 * ポイントに基づくレベル・ランク称号・ボス面接解放条件の算出
 */
export function calculateStudentStats(actions: ActionRecord[]): StudentStats {
  let totalPoints = 0;
  let principalCleared = false;
  let homeroomCleared = false;

  for (const act of actions) {
    if (act.actionType === '校長面接') {
      principalCleared = true;
    } else if (act.actionType === '担任面接') {
      homeroomCleared = true;
    }
    totalPoints += act.pointsEarned;
  }

  // 特殊ルール処理
  // 校長面接合格で95ptへセット（ポイントが95未満の場合、補正）
  if (principalCleared && totalPoints < 95) {
    totalPoints = 95;
  }
  // 担任面接合格で100ptへセット（クリア）
  if (homeroomCleared) {
    totalPoints = 100;
  }

  // ポイント上限100
  totalPoints = Math.min(100, Math.max(0, totalPoints));
  const currentLevel = totalPoints;

  // ランク称号の決定
  let rankTitle = '🔰 インタビュービギナー';
  let rankBadge = '🥉';

  if (totalPoints >= 100) {
    rankTitle = '🎓 就職・進学面接 GOサイン獲得 (CLEAR!)';
    rankBadge = '🏆';
  } else if (totalPoints >= 95) {
    rankTitle = '👑 最終面接挑戦者 (担任面接 解放中)';
    rankBadge = '💎';
  } else if (totalPoints >= 90) {
    rankTitle = '⚔️ 幹部面接挑戦者 (校長・教頭面接 解放中)';
    rankBadge = '👑';
  } else if (totalPoints >= 70) {
    rankTitle = '🌟 面接マスター';
    rankBadge = '🥇';
  } else if (totalPoints >= 30) {
    rankTitle = '🏃 面接チャレンジャー';
    rankBadge = '🥈';
  }

  // 面接ステータス判定
  let principalInterviewStatus: BossStatus = 'LOCKED';
  if (principalCleared) {
    principalInterviewStatus = 'CLEARED';
  } else if (totalPoints >= 90) {
    principalInterviewStatus = 'AVAILABLE';
  }

  let homeroomInterviewStatus: BossStatus = 'LOCKED';
  if (homeroomCleared) {
    homeroomInterviewStatus = 'CLEARED';
  } else if (totalPoints >= 95) {
    homeroomInterviewStatus = 'AVAILABLE';
  }

  return {
    totalPoints,
    currentLevel,
    rankTitle,
    rankBadge,
    principalInterviewStatus,
    homeroomInterviewStatus,
  };
}
