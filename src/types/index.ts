export type ActionType = 
  | '自己申告'
  | '教員面接'
  | 'オリジナル質問'
  | '校長面接'
  | '担任面接';

export interface ActionRecord {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  actionType: ActionType;
  questionDetail: string;
  pointsEarned: number;
}

export interface QuestionItem {
  id: string;
  category: 'motivation' | 'basic' | 'custom';
  title: string;
  description?: string;
  points: number;
  isCompleted: boolean;
  completedAt?: string;
}

export type BossStatus = 'LOCKED' | 'AVAILABLE' | 'CLEARED';

export interface StudentStats {
  totalPoints: number;
  currentLevel: number;
  rankTitle: string;
  rankBadge: string;
  principalInterviewStatus: BossStatus;
  homeroomInterviewStatus: BossStatus;
}
